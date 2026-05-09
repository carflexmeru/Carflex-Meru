import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: zones, error } = await supabase
      .from("zones")
      .select("id,name,capacity,occupancy:current_occupancy,price:fee_kes,is_active,event_id,created_at")
      .limit(1000);

    if (error) throw error;

    return NextResponse.json(zones || []);
  } catch (error) {
    console.error("Error fetching zones:", error);
    return NextResponse.json([], { status: 200 });
  }
}
