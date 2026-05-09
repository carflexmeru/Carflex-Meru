import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");

  if (!plate) {
    return NextResponse.json({ error: "Plate number required" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        vehicle: { regNumber: plate.toUpperCase() },
        paymentStatus: "paid",
        checkInAt: {
          gt: new Date(Date.now() - 15 * 60 * 1000),
        },
      },
      orderBy: { checkInAt: "desc" },
      include: {
        vehicle: true,
        zone: true,
      },
    });

    if (!booking?.vehicleId) {
      return NextResponse.json({ status: "pending" });
    }

    let ticket = await prisma.registrationTicket.findFirst({
      where: { vehicleId: booking.vehicleId },
      orderBy: { createdAt: "desc" },
    });

    if (!ticket) {
      const event =
        (booking.zone?.eventId
          ? await prisma.event.findUnique({ where: { id: booking.zone.eventId } })
          : null) ||
        (await prisma.event.findFirst({ where: { isActive: true } })) ||
        (await prisma.event.create({
          data: {
            name: "Carflex Event",
            location: "Carflex Event Ground",
            isActive: true,
          },
        }));

      const lastTicket = await prisma.registrationTicket.findFirst({
        orderBy: { serialNumber: "desc" },
      });

      const nextSerial = (lastTicket?.serialNumber || 0) + 1;
      const ticketId = `CFX-${nextSerial.toString().padStart(4, "0")}`;

      ticket = await prisma.registrationTicket.create({
        data: {
          ticketId,
          serialNumber: nextSerial,
          vehicleId: booking.vehicleId,
          eventId: event.id,
          regNumber: booking.vehicle?.regNumber || plate.toUpperCase(),
          make: booking.vehicle?.make || "Unknown",
          model: booking.vehicle?.model || "Pending",
          year: booking.vehicle?.year || new Date().getFullYear(),
          ownerName: booking.vehicle?.ownerId ? "Unknown" : "Unknown",
          ownerPhone: "",
          ownerIdNumber: null,
          amountPaid: booking.paymentAmount || booking.zone?.price || 0,
          zoneName: booking.zone?.name || "General",
          status: "active",
          qrData: JSON.stringify({
            ticketId,
            regNumber: booking.vehicle?.regNumber || plate.toUpperCase(),
            ownerName: "Unknown",
            ownerPhone: "",
            ownerIdNumber: "",
            zoneName: booking.zone?.name || "General",
            amountPaid: booking.paymentAmount || booking.zone?.price || 0,
            issuedAt: new Date().toISOString(),
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      status: "paid",
      bookingId: booking.id,
      amount: booking.paymentAmount,
      ticketId: ticket?.ticketId || null,
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}
