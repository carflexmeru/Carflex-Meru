import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";

    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: status
      },
      include: {
        owner: true,
        zone: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(vehicles);
  } catch (error: any) {
    console.error("Manifest API error:", error);
    return NextResponse.json({ error: "Failed to fetch manifest" }, { status: 500 });
  }
}
