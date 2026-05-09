import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let zones = [];
    
    try {
      zones = await prisma.zone.findMany({
        where: {
          event: {
            isActive: true,
          },
        },
        take: 1000, // Limit to prevent timeout
      });
    } catch (e) {
      console.warn("Could not fetch zones from database:", e);
      // Return empty array instead of error
      zones = [];
    }

    return NextResponse.json(zones);
  } catch (error) {
    console.error("Error fetching zones:", error);
    return NextResponse.json([], { status: 200 });
  }
}
