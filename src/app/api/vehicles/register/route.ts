import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      regNumber,
      make,
      model,
      year,
      price,
      eventId,
      zoneId,
      ownerName,
      ownerPhone,
      ownerIdNumber,
      amountPaid,
      zoneName,
    } = await req.json();

    if (!regNumber || !eventId) {
      return NextResponse.json(
        { error: "Registration number and event ID required" },
        { status: 400 }
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if vehicle already exists
    const { data: existingVehicle } = await supabase
      .from("vehicles")
      .select("id")
      .eq("reg_number", regNumber)
      .single();

    if (existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle already registered" },
        { status: 400 }
      );
    }

    // Create vehicle
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .insert({
        owner_id: user.id,
        reg_number: regNumber,
        make,
        model,
        year,
        price,
        event_id: eventId,
        zone_id: zoneId,
        at_event: true,
        status: "active",
        is_complete: true,
      })
      .select()
      .single();

    if (vehicleError) {
      return NextResponse.json(
        { error: vehicleError.message },
        { status: 400 }
      );
    }

    // Get event details
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    // Generate ticket ID
    const ticketId = `CFX-${regNumber.replace(/\s/g, "")}-${Date.now()}`;

    // Create registration ticket with event and time tracking
    const { data: ticket, error: ticketError } = await supabase
      .from("registration_tickets")
      .insert({
        ticket_id: ticketId,
        vehicle_id: vehicle.id,
        event_id: eventId,
        reg_number: regNumber,
        make,
        model,
        year,
        owner_name: ownerName,
        owner_phone: ownerPhone,
        owner_id_number: ownerIdNumber,
        amount_paid: amountPaid,
        zone_name: zoneName,
        status: "active",
        issued_at: new Date().toISOString(),
        expires_at: event?.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        qr_data: {
          vehicleId: vehicle.id,
          regNumber,
          ownerName,
          amount: amountPaid,
          eventId,
          issuedAt: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (ticketError) {
      return NextResponse.json(
        { error: ticketError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Vehicle registered successfully",
      vehicle,
      ticket,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
