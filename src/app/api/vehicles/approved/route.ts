import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("eventName");

    const query: any = {
      status: "active",
      isVerified: true
    };

    if (eventName) {
      query.eventName = eventName;
    }

    const vehicles = await prisma.vehicle.findMany({
      where: query,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            idNumber: true
          }
        },
        zone: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error fetching approved vehicles:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
