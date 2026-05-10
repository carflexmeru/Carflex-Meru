import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function normalizePhone(phone: string) {
  const compact = phone.replace(/\s+/g, "");
  if (compact.startsWith("0")) return `+254${compact.slice(1)}`;
  if (compact.startsWith("+")) return compact;
  return `+${compact}`;
}

async function resolveEvent(eventName?: string) {
  const query = supabase
    .from("events")
    .select("id,name,is_active,location")
    .limit(1);

  const { data: existing, error } = await (eventName
    ? query.eq("name", eventName)
    : query.eq("is_active", true));

  if (error) throw error;
  if (existing?.[0]) return existing[0];

  const { data: created, error: createError } = await supabase
    .from("events")
    .insert({
      name: eventName || "Manual Registration Event",
      location: "Carflex Event Ground",
      is_active: true,
    })
    .select("id,name,is_active,location")
    .single();

  if (createError) throw createError;
  return created;
}

async function nextSerialNumber() {
  const { data, error } = await supabase
    .from("registration_tickets")
    .select("serial_number")
    .order("serial_number", { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0]?.serial_number || 0) + 1;
}

async function resolveVehicle(params: {
  regNumber: string;
  make: string;
  model: string;
  year: number;
  ticketAmount: number;
  eventName?: string;
}) {
  const { data: existing, error } = await supabase
    .from("vehicles")
    .select("id,reg_number,make,model,year")
    .eq("reg_number", params.regNumber)
    .limit(1);

  if (error) throw error;
  if (existing?.[0]) return existing[0];

  const { data: created, error: createError } = await supabase
    .from("vehicles")
    .insert({
      reg_number: params.regNumber,
      make: params.make || "",
      model: params.model || "",
      year: params.year || null,
      price: params.ticketAmount || 0,
      status: "active",
      is_verified: true,
      at_event: true,
      event_name: params.eventName || null,
    })
    .select("id,reg_number,make,model,year")
    .single();

  if (createError) throw createError;
  return created;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      regNumber,
      ownerName,
      ownerPhone,
      ownerIdNumber,
      make,
      model,
      year,
      amountPaid,
      zoneName,
      eventName,
      processName,
      notes,
    } = body;

    if (!regNumber || !ownerName || !ownerPhone) {
      return NextResponse.json(
        { error: "Registration number, owner name, and phone are required" },
        { status: 400 }
      );
    }

    const cleanRegNumber = regNumber.toUpperCase().trim();
    const normalizedPhone = normalizePhone(ownerPhone);
    const makeValue = typeof make === "string" ? make.trim() : "";
    const modelValue = typeof model === "string" ? model.trim() : "";
    const zoneValue = typeof zoneName === "string" ? zoneName.trim() : "";
    const vehicleYear = year ? Number(year) : 0;
    const ticketAmount = amountPaid ? Number(amountPaid) : 0;

    const event = await resolveEvent(eventName);
    const vehicle = await resolveVehicle({
      regNumber: cleanRegNumber,
      make: makeValue,
      model: modelValue,
      year: vehicleYear,
      ticketAmount,
      eventName,
    });
    const serialNumber = await nextSerialNumber();
    const ticketId = `CFX-${serialNumber.toString().padStart(4, "0")}`;

    const ticketPageUrl = `${new URL(req.url).origin}/gate/ticket/${ticketId}?download=true`;
    
    const qrData = JSON.stringify({
      ticketId,
      regNumber: cleanRegNumber,
      ownerName,
      ownerPhone: normalizedPhone,
      ownerIdNumber: ownerIdNumber || "",
      zoneName: zoneValue || "",
      amountPaid: ticketAmount,
      eventName: eventName || "",
      processName: processName || "Registration ticket",
      notes: notes || "",
      issuedAt: new Date().toISOString(),
    });

    const { data: ticket, error: ticketError } = await supabase
      .from("registration_tickets")
      .insert({
        ticket_id: ticketId,
        serial_number: serialNumber,
        vehicle_id: vehicle.id,
        event_id: event.id,
        reg_number: cleanRegNumber,
        make: makeValue || vehicle.make || "",
        model: modelValue || vehicle.model || "",
        year: vehicleYear || null,
        owner_name: ownerName,
        owner_phone: normalizedPhone,
        owner_id_number: ownerIdNumber || null,
        amount_paid: ticketAmount,
        zone_name: zoneValue || "",
        status: "active",
        qr_data: ticketPageUrl,
      })
      .select("ticket_id,serial_number,vehicle_id,reg_number,make,model,year,owner_name,owner_phone,owner_id_number,amount_paid,zone_name,qr_data")
      .single();

    if (ticketError) throw ticketError;

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
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qr_data)}`,
        printUrl: `/api/vehicles/print-ticket/${ticket.ticket_id}`,
      },
    });
  } catch (error) {
    console.error("Manual ticket creation error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
