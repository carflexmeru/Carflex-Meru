import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
    const { phone, regNumber, plate, zoneId, zone, idNumber } = body;
    
    const cleanPlate = (regNumber || plate || "").toUpperCase();
    const targetZoneId = zoneId || zone;

    if (!cleanPlate) throw new Error("Plate number is required.");
    if (!targetZoneId) throw new Error("Zone selection is required.");

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
      const vehicle = await tx.vehicle.upsert({
        where: { regNumber: cleanPlate },
        update: { ownerId: owner.id, zoneId: targetZoneId },
        create: {
          regNumber: cleanPlate,
          ownerId: owner.id,
          zoneId: targetZoneId,
          status: "draft",
        }
      });

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

  } catch (error: any) {
    console.error("❌ DEFER PAYMENT CRITICAL ERROR:", {
      message: error.message,
      stack: error.stack,
      data: body
    });
    return NextResponse.json({ 
      error: "INTERNAL SERVER ERROR", 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const waitlist = await prisma.booking.findMany({
      where: { paymentStatus: "pending" },
      include: {
        vehicle: true,
        zone: true,
      },
      orderBy: { checkInAt: "desc" }
    });
    return NextResponse.json(waitlist);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch waitlist" }, { status: 500 });
  }
}
