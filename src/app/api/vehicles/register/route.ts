import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

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

    // Check if vehicle already exists in Prisma
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        regNumber: regNumber,
      },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle already registered" },
        { status: 400 }
      );
    }

    // Create vehicle in Prisma (PostgreSQL)
    const vehicle = await prisma.vehicle.create({
      data: {
        regNumber,
        make,
        model,
        year: year ? parseInt(year) : null,
        price: price ? parseFloat(price) : null,
        zoneId,
        status: "active",
        isVerified: true,
        ownerId: user.id,
      },
    });

    // Also save to Supabase for backup
    const { data: supabaseVehicle } = await supabase
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

    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    // Generate ticket ID
    const ticketId = `CFX-${regNumber.replace(/\s/g, "")}-${Date.now()}`;

    // Create registration ticket in Prisma
    const ticket = await prisma.registrationTicket.create({
      data: {
        ticketId,
        vehicleId: vehicle.id,
        regNumber,
        make,
        model,
        year: year ? parseInt(year) : new Date().getFullYear(),
        ownerName,
        ownerPhone,
        ownerIdNumber,
        amountPaid: amountPaid ? parseFloat(amountPaid) : 0,
        zoneName,
        status: "active",
        qrData: JSON.stringify({
          vehicleId: vehicle.id,
          regNumber,
          ownerName,
          amount: amountPaid || 0,
          eventId,
          issuedAt: new Date().toISOString(),
        }),
      },
    });

    // Also save ticket to Supabase for backup
    await supabase
      .from("registration_tickets")
      .insert({
        ticket_id: ticketId,
        vehicle_id: supabaseVehicle?.id,
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
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        qr_data: {
          vehicleId: vehicle.id,
          regNumber,
          ownerName,
          amount: amountPaid,
          eventId,
          issuedAt: new Date().toISOString(),
        },
      });

    return NextResponse.json({
      success: true,
      message: "Vehicle registered successfully",
      vehicle,
      ticket,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
