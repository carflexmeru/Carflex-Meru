import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { organization, vehicles, paymentMethod, totalAmount } = body;

    // 1. Resolve or Create Organization and Representative Profile
    const result = await prisma.$transaction(async (tx) => {
      // Create/Update Org Representative Profile
      const repProfile = await tx.profile.upsert({
        where: { phone: organization.repPhone },
        update: { name: organization.repName, idNumber: organization.repId },
        create: {
          phone: organization.repPhone,
          name: organization.repName,
          idNumber: organization.repId,
          role: "vendor"
        }
      });

      // Create Organization Record
      const org = await tx.organization.create({
        data: {
          name: organization.name,
          repName: organization.repName,
          repId: organization.repId,
        }
      });

      // 2. Batch Vehicle & Booking Creation
      const createdVehicles = await Promise.all(vehicles.map(async (v: any) => {
        const vehicle = await tx.vehicle.upsert({
          where: { regNumber: v.plate.toUpperCase() },
          update: { 
            organizationId: org.id, 
            ownerId: repProfile.id,
            zoneId: v.zoneId,
            status: "draft",
            isVerified: false 
          },
          create: {
            regNumber: v.plate.toUpperCase(),
            make: "FLEET_ASSET",
            model: organization.name,
            year: 2024,
            price: 0,
            ownerId: repProfile.id,
            organizationId: org.id,
            zoneId: v.zoneId,
            status: "draft",
            isVerified: false,
            images: [] // Mandatory field synchronization
          }
        });

        await tx.booking.create({
          data: {
            vehicleId: vehicle.id,
            zoneId: v.zoneId,
            paymentStatus: "paid",
            paymentMethod: paymentMethod,
          }
        });

        return vehicle;
      }));

      return { org, vehicles: createdVehicles };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("FLEET_INTAKE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
