import { NextResponse } from "next/server";
import { initiateStkPush } from "@/lib/daraja";
import { supabase } from "@/lib/supabase";

function normalizePhone(phone: string) {
  const compact = phone.replace(/\s+/g, "");
  if (compact.startsWith("0")) return `+254${compact.slice(1)}`;
  if (compact.startsWith("+")) return compact;
  return `+${compact}`;
}

async function resolveEvent(eventName?: string) {
  const query = supabase.from("events").select("id,name,is_active,location").limit(1);
  const { data: existing, error } = await (eventName ? query.eq("name", eventName) : query.eq("is_active", true));
  if (error) throw error;
  if (existing?.[0]) return existing[0];

  const { data: created, error: createError } = await supabase
    .from("events")
    .insert({
      name: eventName || "Meru Car Bazaar",
      location: "Carflex Event Ground",
      is_active: true,
    })
    .select("id,name,is_active,location")
    .single();

  if (createError) throw createError;
  return created;
}

async function resolveZone(zoneInput: string, eventId: string) {
  const { data: found, error } = await supabase
    .from("zones")
    .select("id,event_id,name,capacity,price")
    .eq("event_id", eventId)
    .or(`id.eq.${zoneInput},name.eq.${zoneInput}`)
    .limit(1);

  if (error) throw error;
  if (found?.[0]) return found[0];

  const { data: created, error: createError } = await supabase
    .from("zones")
    .insert({
      event_id: eventId,
      name: zoneInput,
      capacity: 100,
      price: 0,
    })
    .select("id,event_id,name,capacity,price")
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

async function createTicket(params: {
  plate: string;
  phone: string;
  idNumber?: string;
  name?: string;
  zoneId: string;
  paymentMethod: "cash" | "mpesa" | "paybill";
  paymentStatus: "paid" | "pending";
  eventName?: string;
  metadata?: Record<string, unknown>;
}) {
  const cleanPlate = params.plate.toUpperCase().trim();
  const normalizedPhone = normalizePhone(params.phone);
  const event = await resolveEvent(params.eventName);
  const zone = await resolveZone(params.zoneId, event.id);

  const { data: matchedOwner, error: ownerError } = await supabase
    .from("profiles")
    .select("id,phone,name,id_number")
    .or(`phone.eq.${normalizedPhone}${params.idNumber ? `,id_number.eq.${params.idNumber}` : ""}`)
    .limit(1);

  if (ownerError) throw ownerError;

  let owner = matchedOwner?.[0];
  if (!owner) {
    const { data: createdOwner, error: createOwnerError } = await supabase
      .from("profiles")
      .insert({
        phone: normalizedPhone,
        id_number: params.idNumber || null,
        role: "vendor",
      })
      .select("id,phone,name,id_number")
      .single();

    if (createOwnerError) throw createOwnerError;
    owner = createdOwner;
  }

  const { data: vehicleMatches, error: vehicleError } = await supabase
    .from("vehicles")
    .select("id,reg_number,make,model,year")
    .eq("reg_number", cleanPlate)
    .limit(1);

  if (vehicleError) throw vehicleError;

  let vehicle = vehicleMatches?.[0];
  if (!vehicle) {
    const { data: createdVehicle, error: createVehicleError } = await supabase
      .from("vehicles")
      .insert({
        reg_number: cleanPlate,
        make: "Unknown",
        model: "Pending",
        year: new Date().getFullYear(),
        price: zone.price || 0,
        zone_id: zone.id,
        owner_id: owner.id,
        status: params.paymentStatus === "paid" ? "active" : "draft",
        is_verified: true,
        at_event: Boolean(params.eventName),
        event_name: params.eventName || null,
      })
      .select("id,reg_number,make,model,year")
      .single();

    if (createVehicleError) throw createVehicleError;
    vehicle = createdVehicle;
  } else {
    await supabase.from("vehicles").update({
      price: zone.price || 0,
      zone_id: zone.id,
      owner_id: owner.id,
      status: params.paymentStatus === "paid" ? "active" : "draft",
      is_verified: true,
      at_event: Boolean(params.eventName),
      event_name: params.eventName || null,
    }).eq("id", vehicle.id);
  }

  await supabase
    .from("bookings")
    .update({ exit_at: new Date().toISOString() })
    .eq("vehicle_id", vehicle.id)
    .is("exit_at", null);

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      vehicle_id: vehicle.id,
      zone_id: zone.id,
      payment_status: params.paymentStatus,
      payment_method: params.paymentMethod,
      payment_amount: zone.price || 0,
    })
    .select("id,vehicle_id,zone_id,payment_status,payment_method,payment_amount,check_in_at")
    .single();

  if (bookingError) throw bookingError;

  const nextSerial = await nextSerialNumber();
  const ticketId = `CFX-${nextSerial.toString().padStart(4, "0")}`;
  const issuedAt = new Date().toISOString();
  const ownerName = params.name || owner.name || "Unknown";
  const qrData = JSON.stringify({
    ticketId,
    regNumber: cleanPlate,
    ownerName,
    ownerPhone: normalizedPhone,
    ownerIdNumber: params.idNumber || owner.id_number || "",
    zoneName: zone.name || "General",
    amountPaid: zone.price || 0,
    eventName: params.eventName || event.name,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentStatus,
    metadata: params.metadata || {},
    issuedAt,
  });

  const { data: ticket, error: ticketError } = await supabase
    .from("registration_tickets")
    .insert({
      ticket_id: ticketId,
      serial_number: nextSerial,
      vehicle_id: vehicle.id,
      event_id: event.id,
      reg_number: cleanPlate,
      make: vehicle.make || "Unknown",
      model: vehicle.model || "Pending",
      year: vehicle.year || new Date().getFullYear(),
      owner_name: ownerName,
      owner_phone: normalizedPhone,
      owner_id_number: params.idNumber || owner.id_number || null,
      amount_paid: zone.price || 0,
      zone_name: zone.name || "General",
      status: params.paymentStatus === "paid" ? "active" : "pending",
      qr_data: qrData,
    })
    .select("*")
    .single();

  if (ticketError) throw ticketError;

  return { ticket, booking };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plate, idNumber, phone, zoneId, paymentMethod, paymentStatus, name, eventName, metadata } = body;

    if (!plate || !phone || !zoneId) {
      return NextResponse.json(
        { error: "Missing required fields: plate, phone, and zoneId" },
        { status: 400 }
      );
    }

    if (paymentMethod === "mpesa") {
      const pushResponse = await initiateStkPush(phone, 0, plate.toUpperCase().trim());
      if (pushResponse.ResponseCode !== "0") {
        return NextResponse.json(
          { error: pushResponse.errorMessage || "M-Pesa integration error." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "STK Push Initiated to Phone.",
        merchantRequestId: pushResponse.MerchantRequestID,
        checkoutRequestId: pushResponse.CheckoutRequestID,
      });
    }

    const { ticket, booking } = await createTicket({
      plate,
      phone,
      idNumber,
      name,
      zoneId,
      paymentMethod: (paymentMethod || "cash") as "cash" | "mpesa" | "paybill",
      paymentStatus: (paymentStatus || "paid") as "paid" | "pending",
      eventName,
      metadata,
    });

    return NextResponse.json({
      success: true,
      data: {
        booking,
        ticketId: ticket.ticket_id,
        vehicleId: ticket.vehicle_id,
      },
    });
  } catch (error) {
    console.error("CHECKIN_ERROR:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
