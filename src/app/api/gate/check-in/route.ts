import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plate, idNumber, phone, zoneId, paymentMethod, paymentStatus, name } = body;

    const cleanPlate = plate.toUpperCase();

    // 1. Resolve or Create Profile
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
          name,
          role: "vendor",
        }
      });
    } else if (name && !owner.name) {
      owner = await prisma.profile.update({
        where: { id: owner.id },
        data: { name }
      });
    }

    // 2. Clear previous active bookings for this plate (if any)
    await prisma.booking.updateMany({
      where: {
        vehicle: { regNumber: cleanPlate },
        exitAt: null
      },
      data: {
        exitAt: new Date()
      }
    });

    // 3. Find or Create Vehicle (Manual Upsert due to non-unique regNumber)
    const result = await prisma.$transaction(async (tx) => {
      let vehicle = await tx.vehicle.findFirst({
        where: { regNumber: cleanPlate, ownerId: owner.id }
      });

      if (vehicle) {
        vehicle = await tx.vehicle.update({
          where: { id: vehicle.id },
          data: { 
            zoneId,
            status: "draft",
            isVerified: false 
          }
        });
      } else {
        vehicle = await tx.vehicle.create({
          data: {
            regNumber: cleanPlate,
            make: "Unknown",
            model: "Pending",
            year: 2024,
            price: 0,
            ownerId: owner.id,
            zoneId,
            status: "draft",
            isVerified: false
          }
        });
      }

      const booking = await tx.booking.create({
        data: {
          vehicleId: vehicle.id,
          zoneId,
          paymentStatus: paymentStatus || "paid",
          paymentMethod: paymentMethod || "cash",
        }
      });

      return { vehicle, booking };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("CHECKIN_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
