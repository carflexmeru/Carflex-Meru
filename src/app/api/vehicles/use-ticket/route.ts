import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { ticketId, eventId } = await req.json();

    if (!ticketId || !eventId) {
      return NextResponse.json(
        { error: "Ticket ID and event ID required" },
        { status: 400 }
      );
    }

    // Get ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("registration_tickets")
      .select("*")
      .eq("ticket_id", ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Validate ticket is for the correct event
    if (ticket.event_id !== eventId) {
      return NextResponse.json(
        { error: "Ticket is not valid for this event" },
        { status: 400 }
      );
    }

    // Check if ticket is already used
    if (ticket.status === "used") {
      return NextResponse.json(
        { error: "Ticket has already been used" },
        { status: 400 }
      );
    }

    // Check if ticket is expired
    const now = new Date();
    const expiresAt = new Date(ticket.expires_at);

    if (now > expiresAt) {
      return NextResponse.json(
        { error: "Ticket has expired" },
        { status: 400 }
      );
    }

    // Mark ticket as used
    const { data: updatedTicket, error: updateError } = await supabase
      .from("registration_tickets")
      .update({
        status: "used",
        used_at: new Date().toISOString(),
      })
      .eq("ticket_id", ticketId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ticket marked as used",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Use ticket error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
