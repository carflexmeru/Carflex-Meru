import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all bookings with payment data
    const transactions = await prisma.booking.findMany({
      where: {
        paymentAmount: { gt: 0 }
      },
      include: {
        vehicle: true,
        user: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Staff transactions fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
