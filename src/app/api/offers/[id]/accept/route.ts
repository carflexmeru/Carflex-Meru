import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch the offer and vehicle
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { vehicle: true }
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // 2. Atomic Sale Transaction
    const result = await prisma.$transaction([
      // Accept this offer
      prisma.offer.update({
        where: { id },
        data: { status: "sold" }
      }),
      // Reject all other offers for this vehicle
      prisma.offer.updateMany({
        where: { 
          vehicleId: offer.vehicleId,
          NOT: { id }
        },
        data: { status: "rejected" }
      }),
      // Mark vehicle as SOLD
      prisma.vehicle.update({
        where: { id: offer.vehicleId || "" },
        data: { status: "sold" }
      }),
      // Log the sale in Audit Logs
      prisma.auditLog.create({
        data: {
          action: `VEHICLE_SALE_CLOSED: ${offer.vehicle?.regNumber} for KES ${offer.amount.toLocaleString()}`,
        }
      })
    ]);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Sale acceptance error:", error);
    return NextResponse.json({ error: "Failed to finalize sale" }, { status: 500 });
  }
}
