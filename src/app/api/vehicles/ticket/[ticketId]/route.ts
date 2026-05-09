import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;

    const ticket = await prisma.registrationTicket.findUnique({
      where: { ticketId }
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Generate QR code data URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qrData)}`;

    return NextResponse.json({
      success: true,
      ticket: {
        ...ticket,
        qrCodeUrl,
        printUrl: `/api/vehicles/print-ticket/${ticket.ticketId}`
      }
    });
  } catch (error) {
    console.error("Fetch ticket error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
