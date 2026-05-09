import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initiateStkPush } from "@/lib/daraja";
import { supabase } from "@/lib/supabase";

function normalizePhone(phone: string) {
  const compact = phone.replace(/\s+/g, "");
  if (compact.startsWith("0")) return `+254${compact.slice(1)}`;
  if (compact.startsWith("+")) return compact;
  return `+${compact}`;
}

async function resolveEvent(eventName?: string) {
  const existing = await prisma.event.findMany({
    where: eventName ? { name: eventName } : { isActive: true },
    take: 1,
  });

  if (existing[0]) return existing[0];

  return prisma.event.create({
    data: {
      name: eventName || "Meru Car Bazaar",
      location: "Carflex Event Ground",
      isActive: true,
    },
  });
}

async function resolveZone(zoneInput: string, eventId: string) {
  const found = await prisma.zone.findFirst({
    where: {
      OR: [{ id: zoneInput }, { name: zoneInput }],
      eventId,
    },
  });

  if (found) return found;

  return prisma.zone.create({
    data: {
      eventId,
      name: zoneInput,
      capacity: 100,
      price: 0,
    },
  });
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

  const owner =
    (await prisma.profile.findFirst({
      where: {
        OR: [{ phone: normalizedPhone }, ...(params.idNumber ? [{ idNumber: params.idNumber }] : [])],
      },
    })) ||
    (await prisma.profile.create({
      data: {
        phone: normalizedPhone,
        idNumber: params.idNumber || null,
        role: "vendor",
      },
    }));

  const vehicle =
    (await prisma.vehicle.findFirst({
      where: { regNumber: cleanPlate },
    })) ||
    (await prisma.vehicle.create({
      data: {
        regNumber: cleanPlate,
        make: "Unknown",
        model: "Pending",
        year: new Date().getFullYear(),
        price: zone.price || 0,
        zoneId: zone.id,
        ownerId: owner.id,
        status: params.paymentStatus === "paid" ? "active" : "draft",
        isVerified: true,
        atEvent: Boolean(params.eventName),
        eventName: params.eventName || null,
      },
    }));

  await prisma.booking.updateMany({
    where: {
      vehicleId: vehicle.id,
      exitAt: null,
    },
    data: {
      exitAt: new Date(),
    },
  });

  const booking = await prisma.booking.create({
    data: {
      vehicleId: vehicle.id,
      zoneId: zone.id,
      paymentStatus: params.paymentStatus,
      paymentMethod: params.paymentMethod,
      paymentAmount: zone.price || 0,
    },
  });

  const lastTicket = await prisma.registrationTicket.findFirst({
    orderBy: { serialNumber: "desc" },
  });
  const nextSerial = (lastTicket?.serialNumber || 0) + 1;
  const ticketId = `CFX-${nextSerial.toString().padStart(4, "0")}`;

  const ticket = await prisma.registrationTicket.create({
    data: {
      ticketId,
      serialNumber: nextSerial,
      vehicleId: vehicle.id,
      eventId: event.id,
      regNumber: cleanPlate,
      make: vehicle.make || "Unknown",
      model: vehicle.model || "Pending",
      year: vehicle.year || new Date().getFullYear(),
      ownerName: params.name || owner.name || "Unknown",
      ownerPhone: normalizedPhone,
      ownerIdNumber: params.idNumber || owner.idNumber || null,
      amountPaid: zone.price || 0,
      zoneName: zone.name || "General",
      status: params.paymentStatus === "paid" ? "active" : "pending",
      qrData: JSON.stringify({
        ticketId,
        regNumber: cleanPlate,
        ownerName: params.name || owner.name || "Unknown",
        ownerPhone: normalizedPhone,
        ownerIdNumber: params.idNumber || owner.idNumber || "",
        zoneName: zone.name || "General",
        amountPaid: zone.price || 0,
        eventName: params.eventName || event.name,
        paymentMethod: params.paymentMethod,
        paymentStatus: params.paymentStatus,
        metadata: params.metadata || {},
        issuedAt: new Date().toISOString(),
      }),
    },
  });

  await supabase.from("vehicles").upsert(
    {
      id: vehicle.id,
      reg_number: cleanPlate,
      make: vehicle.make || "Unknown",
      model: vehicle.model || "Pending",
      year: vehicle.year || new Date().getFullYear(),
      price: zone.price || 0,
      zone_id: zone.id,
      owner_id: owner.id,
      status: params.paymentStatus === "paid" ? "active" : "draft",
      is_verified: true,
      at_event: Boolean(params.eventName),
      event_name: params.eventName || null,
    },
    { onConflict: "id" }
  );

  await supabase.from("bookings").upsert(
    {
      id: booking.id,
      vehicle_id: vehicle.id,
      zone_id: zone.id,
      payment_status: params.paymentStatus,
      payment_method: params.paymentMethod,
      payment_amount: zone.price || 0,
    },
    { onConflict: "id" }
  );

  await supabase.from("registration_tickets").upsert(
    {
      ticket_id: ticket.ticketId,
      serial_number: nextSerial,
      vehicle_id: vehicle.id,
      event_id: event.id,
      reg_number: cleanPlate,
      make: ticket.make,
      model: ticket.model,
      year: ticket.year,
      owner_name: ticket.ownerName,
      owner_phone: ticket.ownerPhone,
      owner_id_number: ticket.ownerIdNumber,
      amount_paid: ticket.amountPaid,
      zone_name: ticket.zoneName,
      status: ticket.status,
      qr_data: ticket.qrData,
    },
    { onConflict: "ticket_id" }
  );

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
        ticketId: ticket.ticketId,
        vehicleId: ticket.vehicleId,
      },
    });
  } catch (error) {
    console.error("CHECKIN_ERROR:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
