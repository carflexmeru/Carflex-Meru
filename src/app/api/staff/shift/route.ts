import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  try {
    const staff = await prisma.profile.findUnique({
      where: { phone },
      include: {
        bookings: {
          where: {
            checkInAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's bookings
            }
          }
        },
        transactions: {
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }
      }
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    const totalHandled = staff.transactions.reduce((acc, curr) => acc + curr.amount, 0);

    return NextResponse.json({
      checkIns: staff.bookings.length,
      cashHandled: totalHandled,
      transactions: staff.transactions.length,
      shiftStart: staff.createdAt, // Mock shift start for now
    });
  } catch (error) {
    console.error("Shift summary error:", error);
    return NextResponse.json({ error: "Failed to fetch shift summary" }, { status: 500 });
  }
}
