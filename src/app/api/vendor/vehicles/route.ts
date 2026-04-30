import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        owner: { phone }
      },
      include: {
        zone: true,
        offers: {
          include: {
            buyer: true
          }
        },
        bookings: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Vendor vehicles fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch vendor vehicles" }, { status: 500 });
  }
}
