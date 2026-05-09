import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("eventName") || "MERU_2026";

    const tickets = await prisma.registrationTicket.findMany({
      where: {
        vehicle: {
          eventName,
        },
      },
      include: {
        vehicle: {
          include: {
            owner: true,
            zone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const payload = tickets.map((ticket) => ({
      id: ticket.id,
      ticketId: ticket.ticketId,
      regNumber: ticket.regNumber,
      make: ticket.make,
      model: ticket.model,
      year: ticket.year,
      ownerName: ticket.ownerName,
      ownerPhone: ticket.ownerPhone,
      zoneName: ticket.zoneName,
      createdAt: ticket.createdAt,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qrData)}`,
      printUrl: `/api/vehicles/print-ticket/${ticket.ticketId}`,
      vehicle: ticket.vehicle
        ? {
            id: ticket.vehicle.id,
            eventName: ticket.vehicle.eventName,
            status: ticket.vehicle.status,
          }
        : null,
    }));

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Event registrations fetch error:", error);
    return NextResponse.json({ error: "FAILED_TO_SYNC_REGISTRATIONS" }, { status: 500 });
  }
}
