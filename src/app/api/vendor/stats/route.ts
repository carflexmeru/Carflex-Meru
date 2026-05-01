import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Missing identity node." }, { status: 400 });
    }

    // 1. Fetch Core Profile with Resilient Includes
    const vendor = await prisma.profile.findUnique({
      where: { phone },
      include: {
        vehicles: {
          include: { views: true }
        },
        bookings: true,
      }
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found." }, { status: 404 });
    }

    // 2. Fetch Messages Separately to avoid relation-drift crashes
    let receivedMessages: any[] = [];
    try {
       receivedMessages = await prisma.message.findMany({
          where: { receiverId: vendor.id },
          take: 5,
          orderBy: { createdAt: "desc" }
       });
    } catch (mErr) {
       console.warn("Message relation sync error:", mErr);
    }

    // 3. Calculate Analytics
    const totalAssets = vendor.vehicles.length;
    const activeListings = vendor.vehicles.filter(v => v.status === "active").length;
    const totalViews = vendor.vehicles.reduce((sum, v) => sum + (v.views?.length || 0), 0);
    const totalValue = vendor.vehicles.reduce((sum, v) => sum + (v.price || 0), 0);

    // 4. Recent History (Combined logs)
    const recentActivity = [
      ...vendor.vehicles.slice(0, 3).map(v => ({
        type: "ASSET_UPDATE",
        message: `${v.make} ${v.model} (${v.regNumber}) status changed to ${v.status}`,
        time: v.updatedAt
      })),
      ...receivedMessages.map(m => ({
        type: "MESSAGE",
        message: `New communication received: ${m.content.substring(0, 30)}...`,
        time: m.createdAt
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    return NextResponse.json({
      analytics: {
        totalAssets,
        activeListings,
        totalViews,
        totalValue
      },
      recentActivity,
      vendorName: vendor.name || vendor.username
    });

  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "FAILED_TO_SYNC_ANALYTICS" }, { status: 500 });
  }
}
