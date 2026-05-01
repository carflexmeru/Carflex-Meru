import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Missing identity node." }, { status: 400 });
    }

    // 1. Fetch bookings linked to vendor's vehicles
    const transactions = await prisma.booking.findMany({
      where: {
        vehicle: {
          owner: { phone }
        }
      },
      include: {
        vehicle: true,
        zone: true
      },
      orderBy: {
        checkInAt: "desc"
      }
    });

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("Vendor transactions fetch error:", error);
    return NextResponse.json({ error: "FAILED_TO_SYNC_LEDGER" }, { status: 500 });
  }
}
