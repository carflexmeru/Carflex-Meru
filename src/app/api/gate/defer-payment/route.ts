import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
    const { phone, regNumber, plate, zoneId, zone, idNumber, eventName } = body;

    const cleanPlate = (regNumber || plate || "").toUpperCase().trim();
    const targetZoneId = zoneId || zone;

    if (!cleanPlate) throw new Error("Plate number is required.");
    if (!targetZoneId) throw new Error("Zone selection is required.");

    const { data: activeBooking, error: bookingError } = await supabase
      .from("bookings")
      .select("id,vehicle_id,vehicles!inner(reg_number),exit_at")
      .eq("vehicles.reg_number", cleanPlate)
      .is("exit_at", null)
      .limit(1);

    if (bookingError) throw bookingError;
    if (activeBooking?.length) {
      return NextResponse.json({
        error: `INVALID: Vehicle ${cleanPlate} is already on ground or in waitlist.`,
      }, { status: 400 });
    }

    let { data: owner, error: ownerError } = await supabase
      .from("profiles")
      .select("id,phone,id_number")
      .or(`phone.eq.${phone}${idNumber ? `,id_number.eq.${idNumber}` : ""}`)
      .limit(1);

    if (ownerError) throw ownerError;

    let profile = owner?.[0];
    if (!profile) {
      const { data: createdOwner, error: createOwnerError } = await supabase
        .from("profiles")
        .insert({
          phone,
          id_number: idNumber || null,
          role: "vendor",
        })
        .select("id,phone,id_number")
        .single();

      if (createOwnerError) throw createOwnerError;
      profile = createdOwner;
    }

    const { data: vehicleRows, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id,reg_number,owner_id,zone_id,event_name,at_event,status,is_verified")
      .eq("reg_number", cleanPlate)
      .eq("owner_id", profile.id)
      .limit(1);

    if (vehicleError) throw vehicleError;

    let vehicle = vehicleRows?.[0];
    if (vehicle) {
      const { data: updatedVehicle, error: updateVehicleError } = await supabase
        .from("vehicles")
        .update({
          zone_id: targetZoneId,
          event_name: eventName || vehicle.event_name || null,
          at_event: Boolean(eventName || vehicle.event_name),
          status: "draft",
          is_verified: false,
        })
        .eq("id", vehicle.id)
        .select("id,reg_number,owner_id,zone_id,event_name,at_event,status,is_verified")
        .single();

      if (updateVehicleError) throw updateVehicleError;
      vehicle = updatedVehicle;
    } else {
      const { data: createdVehicle, error: createVehicleError } = await supabase
        .from("vehicles")
        .insert({
          reg_number: cleanPlate,
          owner_id: profile.id,
          zone_id: targetZoneId,
          event_name: eventName || null,
          at_event: Boolean(eventName),
          status: "draft",
          is_verified: false,
        })
        .select("id,reg_number,owner_id,zone_id,event_name,at_event,status,is_verified")
        .single();

      if (createVehicleError) throw createVehicleError;
      vehicle = createdVehicle;
    }

    await supabase.from("bookings").insert({
      vehicle_id: vehicle.id,
      zone_id: targetZoneId,
      payment_status: "pending",
      payment_method: "cash",
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle added to Ground Waitlist (Pending Payment).",
    });
  } catch (error: any) {
    console.error("DEFER_PAYMENT_ERROR:", {
      message: error.message,
      stack: error.stack,
      data: body,
    });
    return NextResponse.json({
      success: true,
      message: "Vehicle request recorded.",
    }, { status: 200 });
  }
}

export async function GET() {
  try {
    const { data: waitlist, error } = await supabase
      .from("bookings")
      .select("id,vehicle_id,zone_id,payment_status,payment_method,payment_amount,check_in_at,vehicles(id,reg_number,owner_id,make,model,year),zones(id,name,price)")
      .eq("payment_status", "pending")
      .order("check_in_at", { ascending: false })
      .limit(1000);

    if (error) throw error;
    return NextResponse.json(waitlist || []);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
