import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function nextSerialNumber() {
  const { data, error } = await supabase
    .from("registration_tickets")
    .select("serial_number")
    .order("serial_number", { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0]?.serial_number || 0) + 1;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleId } = body;

    if (!vehicleId) {
      return NextResponse.json({ error: "Missing vehicle ID" }, { status: 400 });
    }

    const { data: vehicleRows, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,status,is_verified,owner_id,zone_id")
      .eq("id", vehicleId)
      .limit(1);

    if (vehicleError) throw vehicleError;

    const vehicle = vehicleRows?.[0];
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    if (!vehicle.is_verified) {
      return NextResponse.json({ error: "Vehicle not verified" }, { status: 400 });
    }

    const { data: zoneRows, error: zoneError } = await supabase
      .from("zones")
      .select("id,name,price,event_id")
      .eq("id", vehicle.zone_id || "")
      .limit(1);

    if (zoneError) throw zoneError;

    const zone = zoneRows?.[0];
    if (!zone?.event_id) {
      return NextResponse.json({ error: "Vehicle must be assigned to an event zone" }, { status: 400 });
    }

    const { data: ownerRows, error: ownerError } = await supabase
      .from("profiles")
      .select("id,name,phone,id_number")
      .eq("id", vehicle.owner_id || "")
      .limit(1);

    if (ownerError) throw ownerError;

    const owner = ownerRows?.[0] || null;

    const nextSerial = await nextSerialNumber();
    const ticketId = `CFX-${nextSerial.toString().padStart(4, "0")}`;
    const qrData = `${new URL(request.url).origin}/gate/ticket/${ticketId}`;

    const { data: ticket, error: ticketError } = await supabase
      .from("registration_tickets")
      .insert({
        ticket_id: ticketId,
        serial_number: nextSerial,
        vehicle_id: vehicle.id,
        event_id: zone.event_id,
        reg_number: vehicle.reg_number,
        make: vehicle.make || "Unknown",
        model: vehicle.model || "Unknown",
        year: vehicle.year || new Date().getFullYear(),
        owner_name: owner?.name || "Unknown",
        owner_phone: owner?.phone || "",
        owner_id_number: owner?.id_number || "",
        amount_paid: zone.price || 0,
        zone_name: zone.name || "General",
        status: "active",
        qr_data: qrData,
      })
      .select("*")
      .single();

    if (ticketError) throw ticketError;

    await supabase.from("vehicles").upsert({
      id: vehicle.id,
      reg_number: vehicle.reg_number,
      make: vehicle.make || "Unknown",
      model: vehicle.model || "Unknown",
      year: vehicle.year || new Date().getFullYear(),
      price: zone.price || 0,
      zone_id: zone.id || null,
      owner_id: owner?.id || null,
      status: "active",
      is_verified: true,
      at_event: Boolean(zone.event_id),
      event_name: zone.event_id || null,
    });

    return NextResponse.json({
      success: true,
      ticket: {
        ticketId: ticket.ticket_id,
        vehicleId: ticket.vehicle_id,
        regNumber: ticket.reg_number,
        make: ticket.make,
        model: ticket.model,
        year: ticket.year,
        ownerName: ticket.owner_name,
        ownerPhone: ticket.owner_phone,
        ownerIdNumber: ticket.owner_id_number,
        amountPaid: ticket.amount_paid,
        zoneName: ticket.zone_name,
        createdAt: ticket.created_at,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qr_data)}`,
        printUrl: `/api/vehicles/print-ticket/${ticket.ticket_id}`,
      },
    });
  } catch (error) {
    console.error("Ticket generation error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
