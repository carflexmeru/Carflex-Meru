import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");

  if (!plate) {
    return NextResponse.json({ error: "Plate number required" }, { status: 400 });
  }

  try {
    // Check if there is a paid booking for this vehicle created in the last 15 minutes
    const booking = await prisma.booking.findFirst({
      where: {
        vehicle: { regNumber: plate.toUpperCase() },
        paymentStatus: "paid",
        checkInAt: {
          gt: new Date(Date.now() - 15 * 60 * 1000) // 15 minute window
        }
      },
      orderBy: { checkInAt: "desc" }
    });

    if (booking) {
      return NextResponse.json({ 
        status: "paid", 
        bookingId: booking.id,
        amount: booking.paymentAmount 
      });
    }

    return NextResponse.json({ status: "pending" });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}
