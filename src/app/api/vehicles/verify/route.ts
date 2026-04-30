import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { vehicleId, idNumber } = await request.json();

    if (!vehicleId || !idNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { owner: true }
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Update Profile with ID Number if not set
    if (vehicle.ownerId) {
      await prisma.profile.update({
        where: { id: vehicle.ownerId },
        data: { idNumber }
      });
    }

    // Mark Vehicle as Verified
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        isVerified: true,
        // Status remains draft until listing is complete (Phase 3)
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Vehicle verified successfully", 
      data: updatedVehicle 
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Failed to verify vehicle" }, { status: 500 });
  }
}
