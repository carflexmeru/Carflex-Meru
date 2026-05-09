import { NextResponse } from "next/server";
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

    const newAmount = parseFloat(amountPaid.toString());

    const { data: updatedTicket, error } = await supabase
      .from("registration_tickets")
      .update({ amount_paid: newAmount })
      .eq("ticket_id", ticketId)
      .select("*")
      .single();

    if (error || !updatedTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: updatedTicket.id,
        ticketId: updatedTicket.ticket_id,
        regNumber: updatedTicket.reg_number,
        make: updatedTicket.make,
        model: updatedTicket.model,
        year: updatedTicket.year,
        ownerName: updatedTicket.owner_name,
        ownerPhone: updatedTicket.owner_phone,
        ownerIdNumber: updatedTicket.owner_id_number,
        amountPaid: updatedTicket.amount_paid,
        zoneName: updatedTicket.zone_name,
        status: updatedTicket.status,
        qrData: updatedTicket.qr_data,
        createdAt: updatedTicket.created_at,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(updatedTicket.qr_data)}`,
        printUrl: `/api/vehicles/print-ticket/${updatedTicket.ticket_id}`,
      },
    });
  } catch (error) {
    console.error("Update ticket price error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
