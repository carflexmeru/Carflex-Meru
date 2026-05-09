import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");

  if (!plate) {
    return NextResponse.json({ error: "Plate number required" }, { status: 400 });
  }

  try {
    const { data: vehicleRows, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,owner_id,zone_id")
      .eq("reg_number", plate.toUpperCase())
      .limit(1);

    if (vehicleError) throw vehicleError;

    const vehicle = vehicleRows?.[0];
    if (!vehicle?.id) {
      return NextResponse.json({ status: "pending" });
    }

    const { data: bookingRows, error: bookingError } = await supabase
      .from("bookings")
      .select("id,vehicle_id,zone_id,payment_status,payment_method,payment_amount,check_in_at")
      .eq("vehicle_id", vehicle.id)
      .eq("payment_status", "paid")
      .gt("check_in_at", new Date(Date.now() - 15 * 60 * 1000).toISOString())
      .order("check_in_at", { ascending: false })
      .limit(1);

    if (bookingError) throw bookingError;

    const booking = bookingRows?.[0];
    if (!booking?.vehicle_id) {
      return NextResponse.json({ status: "pending" });
    }

    const { data: zoneRows, error: zoneError } = await supabase
      .from("zones")
      .select("id,name,price,event_id")
      .eq("id", booking.zone_id || vehicle.zone_id || "")
      .limit(1);

    if (zoneError) throw zoneError;

    const zone = zoneRows?.[0] || null;

    const { data: ticketRows, error: ticketError } = await supabase
      .from("registration_tickets")
      .select("*")
      .eq("vehicle_id", booking.vehicle_id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (ticketError) throw ticketError;

    let ticket = ticketRows?.[0] || null;

    if (!ticket) {
      const { data: eventRows, error: eventError } = await supabase
        .from("events")
        .select("id,name,is_active,location")
        .eq("id", zone?.event_id || "")
        .limit(1);

      if (eventError) throw eventError;

      let event = eventRows?.[0];
      if (!event) {
        const { data: activeEvents, error: activeError } = await supabase
          .from("events")
          .select("id,name,is_active,location")
          .eq("is_active", true)
          .limit(1);

        if (activeError) throw activeError;
        event = activeEvents?.[0];
      }

      if (!event) {
        const { data: createdEvent, error: createEventError } = await supabase
          .from("events")
          .insert({
            name: "Carflex Event",
            location: "Carflex Event Ground",
            is_active: true,
          })
          .select("id,name,is_active,location")
          .single();

        if (createEventError) throw createEventError;
        event = createdEvent;
      }

      const { data: lastTickets, error: lastTicketError } = await supabase
        .from("registration_tickets")
        .select("serial_number")
        .order("serial_number", { ascending: false })
        .limit(1);

      if (lastTicketError) throw lastTicketError;

      const nextSerial = (lastTickets?.[0]?.serial_number || 0) + 1;
      const ticketId = `CFX-${nextSerial.toString().padStart(4, "0")}`;
      const issuedAt = new Date().toISOString();

      const { data: createdTicket, error: createTicketError } = await supabase
        .from("registration_tickets")
        .insert({
          ticket_id: ticketId,
          serial_number: nextSerial,
          vehicle_id: booking.vehicle_id,
          event_id: event.id,
          reg_number: vehicle.reg_number || plate.toUpperCase(),
          make: vehicle.make || "Unknown",
          model: vehicle.model || "Pending",
          year: vehicle.year || new Date().getFullYear(),
          owner_name: "Unknown",
          owner_phone: "",
          owner_id_number: null,
          amount_paid: booking.payment_amount || zone?.price || 0,
          zone_name: zone?.name || "General",
          status: "active",
          qr_data: JSON.stringify({
            ticketId,
            regNumber: vehicle.reg_number || plate.toUpperCase(),
            ownerName: "Unknown",
            ownerPhone: "",
            ownerIdNumber: "",
            zoneName: zone?.name || "General",
            amountPaid: booking.payment_amount || zone?.price || 0,
            eventName: event.name,
            issuedAt,
          }),
        })
        .select("*")
        .single();

      if (createTicketError) throw createTicketError;
      ticket = createdTicket;
    }

    return NextResponse.json({
      success: true,
      status: "paid",
      bookingId: booking.id,
      amount: booking.payment_amount,
      ticketId: ticket?.ticket_id || null,
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}
