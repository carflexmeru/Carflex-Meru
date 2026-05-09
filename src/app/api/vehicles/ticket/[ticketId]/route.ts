import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;

    const { data: ticket, error } = await supabase
      .from("registration_tickets")
      .select("*")
      .eq("ticket_id", ticketId)
      .single();

    if (error || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qr_data)}`;

    let eventName = "";
    try {
      const parsed = typeof ticket.qr_data === "string" ? JSON.parse(ticket.qr_data) : null;
      eventName = parsed?.eventName || "";
    } catch {}

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketId: ticket.ticket_id,
        regNumber: ticket.reg_number,
        make: ticket.make,
        model: ticket.model,
        year: ticket.year,
        ownerName: ticket.owner_name,
        ownerPhone: ticket.owner_phone,
        ownerIdNumber: ticket.owner_id_number,
        amountPaid: ticket.amount_paid,
        zoneName: ticket.zone_name,
        status: ticket.status,
        qrData: ticket.qr_data,
        createdAt: ticket.created_at,
        eventName,
        qrCodeUrl,
        printUrl: `/api/vehicles/print-ticket/${ticket.ticket_id}`,
      },
    });
  } catch (error) {
    console.error("Fetch ticket error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
