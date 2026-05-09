import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const { amountPaid } = await request.json();

    if (!ticketId || amountPaid === undefined) {
      return NextResponse.json(
        { error: "Ticket ID and amount are required" },
        { status: 400 }
      );
    }

    // Update in Prisma
    const updatedTicket = await prisma.registrationTicket.update({
      where: { ticketId },
      data: { amountPaid: parseFloat(amountPaid.toString()) }
    });

    // Also update in Supabase for backup
    await supabase
      .from("registration_tickets")
      .update({ amount_paid: parseFloat(amountPaid.toString()) })
      .eq("ticket_id", ticketId);

    return NextResponse.json({
      success: true,
      ticket: {
        ...updatedTicket,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(updatedTicket.qrData)}`,
        printUrl: `/api/vehicles/print-ticket/${updatedTicket.ticketId}`
      }
    });
  } catch (error) {
    console.error("Update ticket price error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
