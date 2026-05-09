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
      .maybeSingle();

    if (zoneError || !zone) {
      return NextResponse.json(
        { error: `Zone not found: ${zoneId}` },
        { status: 400 }
      );
    }

    // 2. Resolve or Create Profile
    // We search by phone first, then ID number to avoid .or() complexity and ambiguity
    let owner = null;
    
    // Search by phone
    const { data: phoneMatch } = await supabase
      .from("profiles")
      .select("*")
      .eq("phone", normalizedPhone)
      .maybeSingle();
    
    owner = phoneMatch;

    // If no phone match, search by ID number
    if (!owner && idNumber) {
      const { data: idMatch } = await supabase
        .from("profiles")
        .select("*")
        .eq("id_number", idNumber)
        .maybeSingle();
      owner = idMatch;
    }

    if (!owner) {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          phone: normalizedPhone,
          id_number: idNumber || null,
          name: name || "Unknown Owner",
          role: "vendor",
        })
        .select()
        .maybeSingle();

      if (createError || !newProfile) {
        console.error("PROFILE_CREATE_ERROR:", createError);
        return NextResponse.json(
          { error: `Failed to create profile: ${createError?.message || "Unknown error"}` },
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

    // 3. Find or Create Vehicle
    let { data: vehicle, error: vehicleFetchError } = await supabase
      .from("vehicles")
      .select("*")
      .eq("reg_number", cleanPlate)
      .maybeSingle();

    if (vehicleFetchError) {
       console.error("VEHICLE_FETCH_ERROR:", vehicleFetchError);
    }

    if (vehicle) {
      // Update existing vehicle
      const { error: updateVehicleError } = await supabase
        .from("vehicles")
        .update({
          owner_id: owner.id, // Ensure owner is linked
          zone_id: zoneId,
          event_name: eventName || vehicle.event_name || null,
          at_event: Boolean(eventName || vehicle.event_name),
          status: "draft",
          is_verified: true
        })
        .eq("id", vehicle.id);
        
      if (updateVehicleError) console.error("VEHICLE_UPDATE_ERROR:", updateVehicleError);
    } else {
      // Create new vehicle
      const { data: newVehicle, error: createVehicleError } = await supabase
        .from("vehicles")
        .insert({
          owner_id: owner.id,
          reg_number: cleanPlate,
          make: "Unknown",
          model: "Pending",
          year: new Date().getFullYear(),
          price: 0,
          zone_id: zoneId,
          event_name: eventName || null,
          at_event: Boolean(eventName),
          status: "draft",
          is_verified: true
        })
        .select()
        .maybeSingle();

      if (createVehicleError || !newVehicle) {
        console.error("VEHICLE_CREATE_ERROR:", createVehicleError);
        return NextResponse.json({ error: "Failed to create vehicle record" }, { status: 500 });
      }
      vehicle = newVehicle;
    }

    // 4. Clear previous active bookings for this vehicle
    await supabase
      .from("bookings")
      .update({ exit_at: new Date().toISOString() })
      .eq("vehicle_id", vehicle.id)
      .is("exit_at", null);

    // 5. Create Booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        vehicle_id: vehicle.id,
        zone_id: zoneId,
        payment_status: paymentStatus || "paid",
        payment_method: paymentMethod || "cash",
      })
      .select()
      .maybeSingle();
      
    if (bookingError || !booking) {
       console.error("BOOKING_CREATE_ERROR:", bookingError);
       return NextResponse.json({ error: "Failed to create booking record" }, { status: 500 });
    }

    // 6. Generate Ticket
    // Get last serial number
    const { data: lastTicket } = await supabase
      .from("registration_tickets")
      .select("serial_number")
      .order("serial_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextSerial = ((lastTicket?.serial_number || 0) + 1);
    const formattedSerial = nextSerial.toString().padStart(4, '0');
    const ticketId = `CFX-${formattedSerial}`;

    const { data: ticket, error: ticketError } = await supabase
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
        qr_data: { ticketId } // Pass object directly
      })
      .select()
      .maybeSingle();

    if (ticketError || !ticket) {
      console.error("TICKET_CREATE_ERROR:", ticketError);
      // Even if ticket fails, we return the booking but warn
      return NextResponse.json({ 
        success: true, 
        warning: "Ticket generation failed",
        data: { vehicle, booking } 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        vehicle, 
        booking, 
        ticketId: ticket.ticket_id 
      } 
    });
  } catch (error) {
    console.error("CHECKIN_ERROR:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
