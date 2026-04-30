import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ vehicleId: string }> }
) {
  try {
    const { vehicleId } = await params;

    const offers = await prisma.offer.findMany({
      where: { vehicleId },
      include: {
        buyer: true,
        vehicle: true,
      },
      orderBy: {
        amount: "desc",
      },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching vehicle offers:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle offers" }, { status: 500 });
  }
}
