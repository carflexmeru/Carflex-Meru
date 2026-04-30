import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  try {
    const offers = await prisma.offer.findMany({
      where: {
        OR: [
          { buyer: { phone } },
          { vehicle: { owner: { phone } } }
        ]
      },
      include: {
        vehicle: true,
        buyer: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}
