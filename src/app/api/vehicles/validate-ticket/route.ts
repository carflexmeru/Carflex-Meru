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
        {
          valid: false,
          error: "Ticket is not valid for this event",
          reason: "EVENT_MISMATCH",
        },
        { status: 400 }
      );
    }

    // Check if ticket is expired
    const now = new Date();
    const expiresAt = new Date(ticket.expires_at);

    if (now > expiresAt) {
      return NextResponse.json(
        {
          valid: false,
          error: "Ticket has expired",
          reason: "EXPIRED",
          expiredAt: ticket.expires_at,
        },
        { status: 400 }
      );
    }

    // Check if ticket has already been used
    if (ticket.status === "used") {
      return NextResponse.json(
        {
          valid: false,
          error: "Ticket has already been used",
          reason: "ALREADY_USED",
          usedAt: ticket.used_at,
        },
        { status: 400 }
      );
    }

    // Calculate time since issuance
    const issuedAt = new Date(ticket.issued_at);
    const timeSinceIssuance = Math.floor((now.getTime() - issuedAt.getTime()) / 1000); // in seconds

    return NextResponse.json({
      valid: true,
      ticket: {
        id: ticket.id,
        ticketId: ticket.ticket_id,
        vehicleId: ticket.vehicle_id,
        regNumber: ticket.reg_number,
        ownerName: ticket.owner_name,
        ownerPhone: ticket.owner_phone,
        amountPaid: ticket.amount_paid,
        zoneName: ticket.zone_name,
        status: ticket.status,
        issuedAt: ticket.issued_at,
        expiresAt: ticket.expires_at,
        timeSinceIssuance, // in seconds
        eventId: ticket.event_id,
      },
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
