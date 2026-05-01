import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { vehicleId } = await request.json();

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 });
    }

    // 1. Finalize the asset in the database
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: "exited",
        isVerified: false, // Reset verification for next entry
        updatedAt: new Date()
      }
    });

    // 2. Record the exit in the Audit Registry
    await prisma.actionLog.create({
      data: {
        actionType: "FINAL_DEPARTURE",
        agentName: "EXIT_COMMAND_GATE",
        description: `Asset ${updatedVehicle.regNumber} successfully exited the bazaar.`,
        metadata: { vehicleId, plate: updatedVehicle.regNumber }
      }
    });

    return NextResponse.json({ success: true, vehicle: updatedVehicle });
  } catch (error: any) {
    console.error("Exit API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
