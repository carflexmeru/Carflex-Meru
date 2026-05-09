import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("eventName");

    let query = supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,status,is_verified,at_event,event_name,created_at,owner_id,zone_id")
      .eq("status", "draft")
      .eq("is_verified", false);

    if (eventName) {
      query = query.eq("event_name", eventName);
    }

    const { data: pendingVehicles, error } = await query;
    if (error) throw error;

    return NextResponse.json(pendingVehicles || []);
  } catch (error) {
    console.error("Error fetching pending vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch pending vehicles" }, { status: 500 });
  }
}
