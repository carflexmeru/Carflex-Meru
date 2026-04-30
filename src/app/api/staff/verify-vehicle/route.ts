import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "VEHICLE_ID_REQUIRED" }, { status: 400 });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: { 
        isVerified: true,
        status: "active" // Once verified on ground, it becomes active in the bazaar
      },
    });

    return NextResponse.json({ 
      success: true, 
      vehicle: updatedVehicle 
    });
  } catch (error) {
    console.error("VERIFICATION_ERROR:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
