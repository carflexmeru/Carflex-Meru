import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: id },
      include: {
        owner: true,
        zone: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Increment View Count (Analytics)
    await prisma.vehicleView.create({
      data: {
        vehicleId: vehicle.id,
      }
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle details" }, { status: 500 });
  }
}
