import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Missing identity node." }, { status: 400 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        owner: { phone }
      },
      include: {
        zone: true,
        views: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(vehicles);
  } catch (error: any) {
    console.error("Vendor listings fetch error:", error);
    return NextResponse.json({ error: "FAILED_TO_SYNC_INVENTORY" }, { status: 500 });
  }
}
