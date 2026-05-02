import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        isVerified: true,
        status: "verified",
        updatedAt: new Date(),
      },
      include: { owner: true }
    });

    // Generate the Raw Listing for the Vendor Dashboard
    if (vehicle) {
       await prisma.rawListing.create({
          data: {
             originalRegNum: vehicle.regNumber,
             ownerPhone: vehicle.owner?.phone || null,
             ownerIdNumber: vehicle.owner?.idNumber || null,
             make: vehicle.make,
             model: vehicle.model,
             year: vehicle.year
          }
       });
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (error: any) {
    console.error("VERIFY_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
