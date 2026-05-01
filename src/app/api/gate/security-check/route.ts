import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");

  if (!plate) {
    return NextResponse.json({ error: "Missing plate" }, { status: 400 });
  }

  try {
    // 1. Find all vehicles sharing this plate/branding
    const vehicles = await prisma.vehicle.findMany({
      where: {
        regNumber: plate.toUpperCase()
      },
      include: {
        owner: true,
        zone: true
      }
    });

    if (vehicles.length === 0) {
      return NextResponse.json({ error: "ASSET_NOT_FOUND" }, { status: 404 });
    }

    // 2. Check each asset against the Stolen registry
    const manifest = await Promise.all(vehicles.map(async (v) => {
      const stolenRecord = await prisma.stolenVehicle.findUnique({
        where: { regNumber: v.regNumber } // In our schema, stolen is by plate
      });

      // Note: If multiple cars have the same plate and one is stolen, 
      // we might need to flag them all or check by chassis if we had it in stolen table.
      // For now, we flag the plate.
      
      return {
        vehicle: v,
        isStolen: !!stolenRecord
      };
    }));

    return NextResponse.json(manifest);
  } catch (error: any) {
    console.error("Security check error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
