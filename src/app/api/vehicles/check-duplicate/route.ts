import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { regNumber } = await request.json();

    if (!regNumber) {
      return NextResponse.json(
        { message: "Registration number required" },
        { status: 400 }
      );
    }

    // Check if vehicle with this registration number already exists
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        regNumber: regNumber.toUpperCase()
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    if (existingVehicle) {
      return NextResponse.json({
        isDuplicate: true,
        existingVehicle: {
          id: existingVehicle.id,
          regNumber: existingVehicle.regNumber,
          make: existingVehicle.make,
          model: existingVehicle.model,
          year: existingVehicle.year,
          price: existingVehicle.price,
          status: existingVehicle.status,
          owner: existingVehicle.owner,
          createdAt: existingVehicle.createdAt
        }
      });
    }

    return NextResponse.json({
      isDuplicate: false,
      existingVehicle: null
    });
  } catch (error: any) {
    console.error("Duplicate check error:", error);
    return NextResponse.json(
      { message: "Failed to check for duplicates" },
      { status: 500 }
    );
  }
}
