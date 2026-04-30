import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { qrHash } = await request.json();

    if (!qrHash) {
      return NextResponse.json({ error: "Exit QR Hash required" }, { status: 400 });
    }

    // 1. Find the Exit Pass
    const exitPass = await prisma.exitPass.findUnique({
      where: { qrJwtHash: qrHash },
      include: {
        booking: {
          include: {
            vehicle: true
          }
        }
      }
    });

    if (!exitPass) {
      return NextResponse.json({ error: "Invalid Exit Pass" }, { status: 404 });
    }

    if (exitPass.isUsed) {
      return NextResponse.json({ error: "Exit Pass has already been used" }, { status: 400 });
    }

    // 2. Atomic Exit Operation
    const result = await prisma.$transaction([
      // Update Exit Pass
      prisma.exitPass.update({
        where: { id: exitPass.id },
        data: { isUsed: true }
      }),
      // Update Booking
      prisma.booking.update({
        where: { id: exitPass.bookingId },
        data: { exitAt: new Date() }
      }),
      // Release Zone Occupancy
      prisma.zone.update({
        where: { id: exitPass.booking.zoneId || "" },
        data: { occupancy: { decrement: 1 } }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Vehicle cleared for exit", 
      vehicle: exitPass.booking.vehicle 
    });
  } catch (error) {
    console.error("Exit validation error:", error);
    return NextResponse.json({ error: "Failed to process exit" }, { status: 500 });
  }
}
