import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { vehicleId, reason } = await request.json();

    if (!vehicleId || !reason) {
      return NextResponse.json({ error: "Vehicle ID and Reason required" }, { status: 400 });
    }

    // 1. Get the latest active booking
    const booking = await prisma.booking.findFirst({
      where: { vehicleId, exitAt: null },
      orderBy: { checkInAt: "desc" }
    });

    if (!booking) {
      return NextResponse.json({ error: "No active booking found for this vehicle" }, { status: 404 });
    }

    // 2. Generate Exit Pass QR (Mock JWT for now)
    const qrHash = crypto.randomBytes(32).toString("hex");

    const exitPass = await prisma.exitPass.create({
      data: {
        bookingId: booking.id,
        qrJwtHash: qrHash,
      }
    });

    // 3. Log the early exit
    await prisma.auditLog.create({
      data: {
        action: `EARLY_EXIT_REQUESTED: Vehicle ${vehicleId}. Reason: ${reason}`,
      }
    });

    return NextResponse.json({ success: true, qrHash });
  } catch (error) {
    console.error("Early exit error:", error);
    return NextResponse.json({ error: "Failed to generate exit pass" }, { status: 500 });
  }
}
