import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("eventName");

    let query = supabase
      .from("vehicles")
      .select(
        "id,reg_number,make,model,year,status,is_verified,at_event,event_name,created_at,owner_id,zone_id,profiles:owner_id(id,name,phone,id_number),zones:zone_id(id,name,price)"
      )
      .eq("status", "active")
      .eq("is_verified", true)
      .order("created_at", { ascending: false });

    if (eventName) {
      query = query.eq("event_name", eventName);
    }

    const { data: vehicles, error } = await query;
    if (error) throw error;

    return NextResponse.json(vehicles || []);
  } catch (error) {
    console.error("Error fetching approved vehicles:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
