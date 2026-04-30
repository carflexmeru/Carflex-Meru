import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingVehicles = await prisma.vehicle.findMany({
      where: {
        status: "draft",
        isVerified: false,
      },
      include: {
        owner: true,
        zone: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pendingVehicles);
  } catch (error) {
    console.error("Error fetching pending vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch pending vehicles" }, { status: 500 });
  }
}
