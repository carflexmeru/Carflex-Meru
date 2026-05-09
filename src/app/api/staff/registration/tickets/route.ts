import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizePhone(phone: string) {
  const compact = phone.replace(/\s+/g, "");
  if (compact.startsWith("0")) return `+254${compact.slice(1)}`;
  if (compact.startsWith("+")) return compact;
  return `+${compact}`;
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

    if (!regNumber || !ownerName || !ownerPhone || !zoneName) {
      return NextResponse.json(
        { error: "Registration number, owner name, phone, and zone are required" },
        { status: 400 }
      );
    }

    const cleanRegNumber = regNumber.toUpperCase().trim();
    const normalizedPhone = normalizePhone(ownerPhone);
    const vehicleYear = year ? Number(year) : new Date().getFullYear();
    const ticketAmount = amountPaid ? Number(amountPaid) : 0;

    let event = await prisma.event.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!event) {
      event = await prisma.event.create({
        data: {
          name: eventName || "Manual Registration Event",
          location: "Carflex Event Ground",
          isActive: true,
        },
      });
    }

    const existingVehicle = await prisma.vehicle.findFirst({
      where: { regNumber: cleanRegNumber },
    });

    const vehicle =
      existingVehicle ??
      (await prisma.vehicle.create({
        data: {
          regNumber: cleanRegNumber,
          make: make || "Unknown",
          model: model || "Pending",
          year: vehicleYear,
          price: ticketAmount,
          status: "active",
          isVerified: true,
          atEvent: true,
          eventName: eventName || null,
        },
      }));

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
        regNumber: cleanRegNumber,
        make: make || vehicle.make || "Unknown",
        model: model || vehicle.model || "Pending",
        year: vehicleYear,
        ownerName,
        ownerPhone: normalizedPhone,
        ownerIdNumber: ownerIdNumber || null,
        amountPaid: ticketAmount,
        zoneName,
        status: "active",
        qrData: JSON.stringify({
          ticketId,
          regNumber: cleanRegNumber,
          ownerName,
          ownerPhone: normalizedPhone,
          ownerIdNumber: ownerIdNumber || "",
          zoneName,
          amountPaid: ticketAmount,
          eventName: eventName || "",
          processName: processName || "Registration ticket",
          notes: notes || "",
          issuedAt: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      ticket: {
        ticketId: ticket.ticketId,
        vehicleId: ticket.vehicleId,
        regNumber: ticket.regNumber,
        make: ticket.make,
        model: ticket.model,
        year: ticket.year,
        ownerName: ticket.ownerName,
        ownerPhone: ticket.ownerPhone,
        ownerIdNumber: ticket.ownerIdNumber,
        amountPaid: ticket.amountPaid,
        zoneName: ticket.zoneName,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qrData)}`,
        printUrl: `/api/vehicles/print-ticket/${ticket.ticketId}`,
      },
    });
  } catch (error) {
    console.error("Manual ticket creation error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
