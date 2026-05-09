import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: tickets, error } = await supabase
      .from("registration_tickets")
      .select("id,ticket_id,reg_number,make,model,year,owner_name,owner_phone,owner_id_number,zone_name,amount_paid,status,qr_data,created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      tickets: tickets || [],
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
