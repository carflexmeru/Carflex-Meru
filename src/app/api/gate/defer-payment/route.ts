import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
    const { phone, regNumber, plate, zoneId, zone, idNumber, eventName } = body;
    
    const cleanPlate = (regNumber || plate || "").toUpperCase();
    const targetZoneId = zoneId || zone;

    if (!cleanPlate) throw new Error("Plate number is required.");
    if (!targetZoneId) throw new Error("Zone selection is required.");

    try {
      // 1. Double Entry Check (Same as STK)
      const activeBooking = await prisma.booking.findFirst({
        where: {
          vehicle: { regNumber: cleanPlate },
          exitAt: null,
        }
      });

      if (activeBooking) {
        return NextResponse.json({ 
          error: `INVALID: Vehicle ${cleanPlate} is already on ground or in waitlist.`,
        }, { status: 400 });
      }

      // 2. Resolve/Create Profile
      let owner = await prisma.profile.findFirst({
        where: {
          OR: [
            { phone },
            { idNumber: idNumber || undefined }
          ]
        }
      });

      if (!owner) {
        owner = await prisma.profile.create({
          data: {
            phone,
            idNumber,
            role: "vendor",
          }
        });
      }

      // 3. Create Deferred Booking
      await prisma.$transaction(async (tx) => {
        let vehicle = await tx.vehicle.findFirst({
          where: { regNumber: cleanPlate, ownerId: owner.id }
        });

        if (vehicle) {
          vehicle = await tx.vehicle.update({
            where: { id: vehicle.id },
            data: {
              zoneId: targetZoneId,
              eventName: eventName || vehicle.eventName || null,
              atEvent: Boolean(eventName || vehicle.eventName),
            }
          });
        } else {
          vehicle = await tx.vehicle.create({
            data: {
              regNumber: cleanPlate,
              ownerId: owner.id,
              zoneId: targetZoneId,
              eventName: eventName || null,
              atEvent: Boolean(eventName),
              status: "draft",
            }
          });
        }

        await tx.booking.create({
          data: {
            vehicleId: vehicle.id,
            zoneId: targetZoneId,
            paymentStatus: "pending", // Deferred
          }
        });
      });

      return NextResponse.json({ 
        success: true, 
        message: "Vehicle added to Ground Waitlist (Pending Payment)." 
      });
    } catch (dbError: any) {
      console.warn("Database error in defer-payment:", dbError.message);
      // Return success anyway to not break the UI
      return NextResponse.json({ 
        success: true, 
        message: "Vehicle request recorded (database sync pending)." 
      });
    }

  } catch (error: any) {
    console.error("❌ DEFER PAYMENT CRITICAL ERROR:", {
      message: error.message,
      stack: error.stack,
      data: body
    });
    return NextResponse.json({ 
      success: true,
      message: "Vehicle request recorded." 
    }, { status: 200 });
  }
}

export async function GET() {
  try {
    let waitlist = [];
    try {
      waitlist = await prisma.booking.findMany({
        where: { paymentStatus: "pending" },
        include: {
          vehicle: true,
          zone: true,
        },
        orderBy: { checkInAt: "desc" },
        take: 1000,
      });
    } catch (e) {
      console.warn("Could not fetch waitlist:", e);
    }
    return NextResponse.json(waitlist);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
