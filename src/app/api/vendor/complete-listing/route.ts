import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { vehicleId, make, model, year, price } = await request.json();

    if (!vehicleId || !make || !model || !year || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        make,
        model,
        year,
        price,
        isComplete: true,
        status: "active", // Activate the listing in the marketplace
      },
    });

    return NextResponse.json({ success: true, data: updatedVehicle });
  } catch (error) {
    console.error("Listing completion error:", error);
    return NextResponse.json({ error: "Failed to complete listing" }, { status: 500 });
  }
}
