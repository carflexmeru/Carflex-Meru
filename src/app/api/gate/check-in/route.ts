import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plate, idNumber, phone, zoneId, paymentMethod, paymentStatus, name } = body;

    const cleanPlate = plate.toUpperCase();
    
    // NORMALIZE PHONE: Ensure consistent format (e.g., 07... becomes +254...)
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+")) {
      normalizedPhone = "+" + normalizedPhone;
    }

    // 1. Resolve or Create Profile
    let owner = await prisma.profile.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { idNumber: idNumber || undefined }
        ]
      }
    });

    if (!owner) {
      owner = await prisma.profile.create({
        data: {
          phone: normalizedPhone,
          idNumber,
          name,
          role: "vendor",
        }
      });
    } else {
      // UPGRADE: Elevate to vendor role if currently a buyer/guest
      const updateData: any = {};
      if (owner.role !== "vendor") updateData.role = "vendor";
      if (name && !owner.name) updateData.name = name;
      if (idNumber && !owner.idNumber) updateData.idNumber = idNumber;

      if (Object.keys(updateData).length > 0) {
        owner = await prisma.profile.update({
          where: { id: owner.id },
          data: updateData
        });
      }
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
