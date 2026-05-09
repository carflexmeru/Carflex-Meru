import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("eventName");

    const eventFilter = eventName ? { eventName } : {};

    const pendingVehicles = await prisma.vehicle.findMany({
      where: {
        status: "draft",
        isVerified: false,
        ...eventFilter,
      },
      include: {
        owner: true,
        zone: true,
        organization: true,
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
