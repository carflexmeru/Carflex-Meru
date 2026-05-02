import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// SEARCH BY PLATE (Handles Collisions like 'CARFLEX')
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");

  if (!plate) {
    return NextResponse.json({ error: "Missing plate" }, { status: 400 });
  }

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { regNumber: plate.toUpperCase() },
      include: { owner: true, zone: true }
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

// AUTHORIZE SPECIFIC ASSET
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
      },
      include: { owner: true }
    });

    // GENERATE RAW LISTING FOR VENDOR DASHBOARD
    if (updatedVehicle) {
       await prisma.rawListing.create({
          data: {
             originalRegNum: updatedVehicle.regNumber,
             ownerPhone: updatedVehicle.owner?.phone || null,
             ownerIdNumber: updatedVehicle.owner?.idNumber || null,
             make: updatedVehicle.make,
             model: updatedVehicle.model,
             year: updatedVehicle.year
          }
       });
    }


    // RECORD TO ACTION REGISTRY
    await prisma.actionLog.create({
      data: {
        actionType: "AUTHORIZE_ENTRY",
        agentName: "GATE_TERMINAL",
        description: `Asset ${updatedVehicle.regNumber} (ID: ${id}) was authorized for entry.`,
        metadata: { vehicleId: id, plate: updatedVehicle.regNumber }
      }
    });

    return NextResponse.json(updatedVehicle);
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
