import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// SEARCH BY PLATE (Handles Collisions like 'CARFLEX')
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");

  if (!plate) {
    return NextResponse.json({ error: "Missing plate" }, { status: 400 });
  }

  try {
    const { data: vehicles, error } = await supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,price,status,is_verified,created_at,owner_id,zone_id")
      .eq("reg_number", plate.toUpperCase())
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(vehicles || []);
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

// AUTHORIZE SPECIFIC ASSET
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || body.vehicleId || body.ticketId || body.regNumber;
    const status = body.status || "active";

    if (!id) {
      return NextResponse.json({ error: "Missing vehicle ID" }, { status: 400 });
    }

    let vehicleId = body.vehicleId || body.id;
    let resolvedPlate = body.regNumber || "";

    if (!vehicleId && body.ticketId) {
      const { data: ticketRows, error: ticketError } = await supabase
        .from("registration_tickets")
        .select("vehicle_id,reg_number,ticket_id")
        .eq("ticket_id", body.ticketId)
        .limit(1);

      if (ticketError) throw ticketError;
      const ticket = ticketRows?.[0];
      vehicleId = ticket?.vehicle_id || null;
      resolvedPlate = ticket?.reg_number || resolvedPlate;
    }

    if (!vehicleId && resolvedPlate) {
      const { data: vehicleRows, error: lookupError } = await supabase
        .from("vehicles")
        .select("id,reg_number")
        .eq("reg_number", resolvedPlate.toUpperCase())
        .limit(1);

      if (lookupError) throw lookupError;
      vehicleId = vehicleRows?.[0]?.id || null;
    }

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Get the current vehicle to preserve event_name and get zone info
    const { data: currentVehicle } = await supabase
      .from("vehicles")
      .select("event_name,at_event,zone_id")
      .eq("id", vehicleId)
      .single();

    // If vehicle doesn't have event_name, try to get it from the zone
    let eventName = currentVehicle?.event_name;
    if (!eventName && currentVehicle?.zone_id) {
      const { data: zone } = await supabase
        .from("zones")
        .select("event_id")
        .eq("id", currentVehicle.zone_id)
        .single();
      
      if (zone?.event_id) {
        const { data: event } = await supabase
          .from("events")
          .select("name")
          .eq("id", zone.event_id)
          .single();
        eventName = event?.name;
      }
    }

    const { data: updatedRows, error: updateError } = await supabase
      .from("vehicles")
      .update({
        is_verified: true,
        status,
        event_name: eventName || null,
      })
      .eq("id", vehicleId)
      .select("id,reg_number,make,model,year,price,status,is_verified,created_at,owner_id,zone_id,event_name,at_event")
      .limit(1);

    if (updateError) throw updateError;

    const updatedVehicle = updatedRows?.[0];
    if (!updatedVehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const { data: ownerRows } = await supabase
      .from("profiles")
      .select("id,phone,id_number,name")
      .eq("id", updatedVehicle.owner_id || "")
      .limit(1);

    const owner = ownerRows?.[0] || null;

    await supabase.from("raw_listings").insert({
      original_reg_num: updatedVehicle.reg_number,
      owner_phone: owner?.phone || null,
      owner_id_number: owner?.id_number || null,
      make: updatedVehicle.make,
      model: updatedVehicle.model,
      year: updatedVehicle.year,
    });

    const { data: existingLog } = await supabase
      .from("action_logs")
      .select("id")
      .eq("action_type", "AUTHORIZE_ENTRY")
      .ilike("description", `%${vehicleId}%`)
      .limit(1);

    if (!existingLog?.length) {
      await supabase.from("action_logs").insert({
        action_type: "AUTHORIZE_ENTRY",
        agent_name: "GATE_TERMINAL",
        description: `Asset ${updatedVehicle.reg_number} (ID: ${vehicleId}) was authorized for entry.`,
        metadata: { vehicleId, plate: updatedVehicle.reg_number },
      });
    }

    return NextResponse.json(updatedVehicle);
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
