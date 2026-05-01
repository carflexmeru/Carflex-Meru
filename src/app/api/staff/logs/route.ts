import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // We combine recent vehicles and bookings as 'actions'
    const vehicles = await prisma.vehicle.findMany({
      include: { owner: true, organization: true },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const bookings = await prisma.booking.findMany({
      include: { vehicle: true, user: true },
      orderBy: { updatedAt: "desc" },
      take: 20
    });

    // Map to a common log format
    const vehicleLogs = vehicles.map(v => ({
      id: `v-${v.id}`,
      type: "ASSET_REGISTRATION",
      description: `${v.make} ${v.model} (${v.regNumber}) registered`,
      user: v.owner?.name || v.organization?.name || "System",
      timestamp: v.createdAt,
      status: v.status
    }));

    const bookingLogs = bookings.map(b => ({
      id: `b-${b.id}`,
      type: "PAYMENT_SIGNAL",
      description: `Payment of KES ${b.paymentAmount} processed for ${b.vehicle?.regNumber || 'Unknown'}`,
      user: b.user?.name || "System",
      timestamp: b.updatedAt,
      status: "COMPLETED"
    }));

    const allLogs = [...vehicleLogs, ...bookingLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(allLogs.slice(0, 40));
  } catch (error) {
    console.error("Staff logs fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
