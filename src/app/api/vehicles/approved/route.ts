import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("eventName");

    let query = supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,status,is_verified,at_event,event_name,created_at,owner_id,zone_id")
      .eq("status", "active")
      .eq("is_verified", true);

    if (eventName) {
      query = query.eq("event_name", eventName);
    }

    const { data: vehicles, error } = await query;
    if (error) throw error;

    const formattedVehicles = (vehicles || []).map((v: any) => ({
      id: v.id,
      regNumber: v.reg_number,
      make: v.make,
      model: v.model,
      year: v.year,
      status: v.status,
      isVerified: v.is_verified,
      atEvent: v.at_event,
      eventName: v.event_name,
      createdAt: v.created_at,
      ownerId: v.owner_id,
      zoneId: v.zone_id,
    }));

    return NextResponse.json(formattedVehicles);
  } catch (error) {
    console.error("Error fetching approved vehicles:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
