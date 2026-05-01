import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || body.vehicleId;
    const { status } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing vehicle ID" }, { status: 400 });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        isVerified: true,
        status: status || "active"
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Vehicle verified successfully", 
      data: updatedVehicle 
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // Existing PATCH logic for backward compatibility
  return POST(request);
}
