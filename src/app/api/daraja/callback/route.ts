import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { checkoutRequestId, regNumber, zoneId, phone } = await request.json();

    // 1. Logic would normally parse Safaricom JSON here. 
    // We'll simulate a successful processing.

    const owner = await prisma.profile.findUnique({ where: { phone } });
    if (!owner) throw new Error("Owner profile not found");

    const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
    if (!zone) throw new Error("Zone not found");

    // 2. Perform Atomic Transaction (Supabase/Prisma level)
    const result = await prisma.$transaction(async (tx) => {
      // Find or Create Vehicle (Manual Upsert due to non-unique regNumber)
      let vehicle = await tx.vehicle.findFirst({
        where: { regNumber, ownerId: owner.id }
      });

      if (vehicle) {
        vehicle = await tx.vehicle.update({
          where: { id: vehicle.id },
          data: { zoneId: zoneId, status: "draft" }
        });
      } else {
        vehicle = await tx.vehicle.create({
          data: {
            regNumber,
            ownerId: owner.id,
            zoneId: zoneId,
            status: "draft",
          }
        });
      }

      // Create Booking
      const booking = await tx.booking.create({
        data: {
          vehicleId: vehicle.id,
          zoneId: zoneId,
          paymentStatus: "paid",
        }
      });

      // Increment Zone Occupancy
      await tx.zone.update({
        where: { id: zoneId },
        data: { occupancy: { increment: 1 } }
      });

      return { vehicle, booking };
    });

    return NextResponse.json({ 
      success: true, 
      message: "ENTRY GRANTED. Payment confirmed.",
      data: result
    });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: "Failed to process entry" }, { status: 500 });
  }
}
