import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleId } = body;

    if (!vehicleId) {
      return NextResponse.json({ error: "Missing vehicle ID" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { 
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            idNumber: true
          }
        },
        zone: {
          select: {
            id: true,
            name: true,
            price: true,
            eventId: true
          }
        }
      }
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    if (!vehicle.isVerified) {
      return NextResponse.json({ error: "Vehicle not verified" }, { status: 400 });
    }

    // Ensure vehicle has an event
    if (!vehicle.zone?.eventId) {
      return NextResponse.json({ error: "Vehicle must be assigned to an event zone" }, { status: 400 });
    }

    // Get the next serial number
    const lastTicket = await prisma.registrationTicket.findFirst({
      orderBy: { serialNumber: 'desc' }
    });
    const nextSerial = (lastTicket?.serialNumber || 0) + 1;
    const formattedSerial = nextSerial.toString().padStart(4, '0');
    
    // Generate a human-readable sequential ticket ID
    const ticketId = `CFX-${formattedSerial}`;
    
    // Create ticket record
    const ticket = await prisma.registrationTicket.create({
      data: {
        ticketId,
        serialNumber: nextSerial,
        vehicleId,
        eventId: vehicle.zone!.eventId,
        regNumber: vehicle.regNumber,
        make: vehicle.make || "Unknown",
        model: vehicle.model || "Unknown",
        year: vehicle.year || new Date().getFullYear(),
        ownerName: vehicle.owner?.name || "Unknown",
        ownerPhone: vehicle.owner?.phone || "",
        ownerIdNumber: vehicle.owner?.idNumber || "",
        amountPaid: vehicle.zone?.price || 0,
        zoneName: vehicle.zone?.name || "General",
        status: "active",
        qrData: `${new URL(request.url).origin}/gate/ticket/${ticketId}`,
      }
    });

    // Generate QR code data URL (using a simple QR code service)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qrData)}`;

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
        createdAt: ticket.createdAt,
        qrCodeUrl,
        printUrl: `/api/vehicles/print-ticket/${ticket.ticketId}`
      }
    });
  } catch (error) {
    console.error("Ticket generation error:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json({ error: "Ticket already exists for this vehicle" }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
