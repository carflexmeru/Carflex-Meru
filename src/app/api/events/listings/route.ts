import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("eventName") || "MERU_2026";

    // 1. Fetch assets physically present at the specified event
    const listings = await prisma.vehicle.findMany({
      where: {
        atEvent: true,
        eventName: eventName,
        status: "active" // Only show live marketplace listings
      },
      include: {
        zone: true,
        owner: true,
        views: true
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return NextResponse.json(listings);
  } catch (error: any) {
    console.error("Event listings fetch error:", error);
    return NextResponse.json({ error: "FAILED_TO_SYNC_EVENT_MANIFEST" }, { status: 500 });
  }
}
