import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Missing identity node." }, { status: 400 });
    }

    // 1. Resolve Profile First
    const vendor = await prisma.profile.findUnique({
       where: { phone }
    });

    if (!vendor) {
       return NextResponse.json([], { status: 200 }); // Return empty array if no vendor
    }

    // 2. Fetch Vehicles with Direct ID link
    const vehicles = await prisma.vehicle.findMany({
      where: {
        ownerId: vendor.id
      },
      include: {
        zone: true,
        views: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(Array.isArray(vehicles) ? vehicles : []);
  } catch (error: any) {
    console.error("Vendor listings fetch error:", error);
    // CRITICAL: Always return an array to prevent frontend crashes
    return NextResponse.json([], { status: 200 }); 
  }
}
