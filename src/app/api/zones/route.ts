import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("eventName");

    let query = supabase
      .from("zones")
      .select("id,name,capacity,occupancy,price,event_id");

    // If eventName is provided, filter by event
    if (eventName) {
      const { data: event } = await supabase
        .from("events")
        .select("id")
        .eq("name", eventName)
        .single();

      if (event) {
        query = query.eq("event_id", event.id);
      }
    } else {
      // Get zones from the first active event
      const { data: activeEvent } = await supabase
        .from("events")
        .select("id")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (activeEvent) {
        query = query.eq("event_id", activeEvent.id);
      }
    }

    const { data: zones, error } = await query.order("name");

    if (error) throw error;

    return NextResponse.json(zones || []);
  } catch (error) {
    console.error("Zones fetch error:", error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of error
  }
}
