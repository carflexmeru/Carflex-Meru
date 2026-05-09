import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plate, idNumber, phone, zoneId, paymentMethod, paymentStatus, name, eventName } = body;

    // Validate required fields
    if (!plate || !phone || !zoneId) {
      return NextResponse.json(
        { error: "Missing required fields: plate, phone, and zoneId" },
        { status: 400 }
      );
    }

    const cleanPlate = plate.toUpperCase();
    
    // NORMALIZE PHONE: Ensure consistent format (e.g., 07... becomes +254...)
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+")) {
      normalizedPhone = "+" + normalizedPhone;
    }

    // 1. Verify zone exists
    const { data: zone, error: zoneError } = await supabase
      .from("zones")
      .select("*")
      .eq("id", zoneId)
      .single();

    if (zoneError || !zone) {
      return NextResponse.json(
        { error: `Zone not found: ${zoneId}` },
        { status: 400 }
      );
    }

    // 2. Resolve or Create Profile
    let { data: owner, error: ownerError } = await supabase
      .from("profiles")
      .select("*")
      .or(`phone.eq.${normalizedPhone},id_number.eq.${idNumber || ""}`)
      .single();

    if (!owner) {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          phone: normalizedPhone,
          id_number: idNumber,
          name,
          role: "vendor",
        })
        .select()
        .single();

      if (createError || !newProfile) {
        return NextResponse.json(
          { error: "Failed to create profile" },
          { status: 500 }
        );
      }

      owner = newProfile;
    } else {
      // Update profile if needed
      const updateData: Record<string, any> = {};
      if (owner.role !== "vendor") updateData.role = "vendor";
      if (name && !owner.name) updateData.name = name;
      if (idNumber && !owner.id_number) updateData.id_number = idNumber;

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", owner.id);
      }
    }

    // 3. Clear previous active bookings for this plate
    await supabase
      .from("bookings")
      .update({ exit_at: new Date().toISOString() })
      .eq("vehicle_id", (await supabase.from("vehicles").select("id").eq("reg_number", cleanPlate).single()).data?.id || "")
      .is("exit_at", null);

    // 4. Find or Create Vehicle
    let { data: vehicle } = await supabase
      .from("vehicles")
      .select("*")
      .eq("reg_number", cleanPlate)
      .eq("owner_id", owner.id)
      .single();

    if (vehicle) {
      // Update existing vehicle
      await supabase
        .from("vehicles")
        .update({
          zone_id: zoneId,
          event_name: eventName || vehicle.event_name || null,
          at_event: Boolean(eventName || vehicle.event_name),
          status: "draft",
          is_verified: true
        })
        .eq("id", vehicle.id);
    } else {
      // Create new vehicle
      const { data: newVehicle } = await supabase
        .from("vehicles")
        .insert({
          owner_id: owner.id,
          reg_number: cleanPlate,
          make: "Unknown",
          model: "Pending",
          year: 2024,
          price: 0,
          zone_id: zoneId,
          event_name: eventName || null,
          at_event: Boolean(eventName),
          status: "draft",
          is_verified: true
        })
        .select()
        .single();

      vehicle = newVehicle;
    }

    // 5. Create Booking
    const { data: booking } = await supabase
      .from("bookings")
      .insert({
        vehicle_id: vehicle.id,
        zone_id: zoneId,
        payment_status: paymentStatus || "paid",
        payment_method: paymentMethod || "cash",
      })
      .select()
      .single();

    // 6. Generate Ticket
    const { data: lastTicket } = await supabase
      .from("registration_tickets")
      .select("serial_number")
      .order("serial_number", { ascending: false })
      .limit(1)
      .single();

    const nextSerial = ((lastTicket?.serial_number || 0) + 1);
    const formattedSerial = nextSerial.toString().padStart(4, '0');
    const ticketId = `CFX-${formattedSerial}`;

    const { data: ticket } = await supabase
      .from("registration_tickets")
      .insert({
        serial_number: nextSerial,
        ticket_id: ticketId,
        vehicle_id: vehicle.id,
        reg_number: cleanPlate,
        make: vehicle.make || "Unknown",
        model: vehicle.model || "Pending",
        year: vehicle.year || 2024,
        owner_name: owner.name || "Unknown",
        owner_phone: owner.phone,
        owner_id_number: owner.id_number,
        amount_paid: zone.price || 0,
        zone_name: zone.name || "General",
        status: "active",
        qr_data: JSON.stringify({ ticketId })
      })
      .select()
      .single();

    return NextResponse.json({ 
      success: true, 
      data: { 
        vehicle, 
        booking, 
        ticketId: ticket?.ticket_id 
      } 
    });
  } catch (error) {
    console.error("CHECKIN_ERROR:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
