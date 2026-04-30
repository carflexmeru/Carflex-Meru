import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const zones = await prisma.zone.findMany({
      where: {
        event: {
          isActive: true,
        },
      },
    });

    return NextResponse.json(zones);
  } catch (error) {
    console.error("Error fetching zones:", error);
    return NextResponse.json({ error: "Failed to fetch zones" }, { status: 500 });
  }
}
