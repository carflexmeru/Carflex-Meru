import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Missing identity node." }, { status: 400 });
    }

    // NORMALIZE PHONE
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+") && /^\d+$/.test(normalizedPhone)) {
      normalizedPhone = "+" + normalizedPhone;
    }

    // 1. Fetch Core Profile
    const vendor = await prisma.profile.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { username: phone }
        ]
      }
    });

    const shadowPhone = normalizedPhone.replace("+254", "0");

    // 2. OMNI-SEARCH PROTOCOL: Retrieve all vehicles tied to ANY matching profile
    const vehicles = await prisma.vehicle.findMany({
       where: {
         owner: {
           OR: [
             { id: vendor?.id || "N/A" },
             { phone: normalizedPhone },
             { phone: shadowPhone },
             { phone: phone },
             { username: phone },
             { idNumber: phone }
           ]
         }
       },
       include: { views: true }
    });

    // 3. BASELINE RESPONSE: If no assets and no profile, return empty
    if (!vendor && vehicles.length === 0) {
      return NextResponse.json({
        analytics: {
          totalAssets: 0,
          activeListings: 0,
          totalViews: 0,
          totalValue: 0
        },
        recentActivity: [],
        vendorName: "Pending Activation",
        isNew: true
      });
    }

    // 3. Fetch Messages Separately to avoid relation-drift crashes
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

    // 4. Calculate Analytics
    const totalAssets = vehicles.length;
    const activeListings = vehicles.filter((v: any) => v.status === "active").length;
    const totalViews = vehicles.reduce((sum: number, v: any) => sum + (v.views?.length || 0), 0);
    const totalValue = vehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0);

    // 5. Recent History (Combined logs)
    const recentActivity = [
      ...vehicles.slice(0, 3).map((v: any) => ({
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
      vendorName: vendor?.name || vendor?.username || "Authorized Vendor"
    });

  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "FAILED_TO_SYNC_ANALYTICS" }, { status: 500 });
  }
}
