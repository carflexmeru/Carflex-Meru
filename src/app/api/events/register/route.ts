import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { vehicleId, days, eventName } = await request.json();

    // Validate input
    if (!vehicleId || !days || days.length === 0 || !eventName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 }
      );
    }

    // Update vehicle to mark it as at event
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        atEvent: true,
        eventName: eventName,
        status: "active"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle registered for event successfully",
      vehicle: updatedVehicle
    });
  } catch (error: any) {
    console.error("Event registration error:", error);
    return NextResponse.json(
      { message: "Failed to register vehicle for event" },
      { status: 500 }
    );
  }
}
