import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";

    const { data: vehicles, error } = await supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,status,is_verified,owner_id,zone_id,created_at,profiles:owner_id(id,name,phone,id_number),zones:zone_id(id,name,price)")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(vehicles || []);
  } catch (error: any) {
    console.error("Manifest API error:", error);
    return NextResponse.json({ error: "Failed to fetch manifest" }, { status: 500 });
  }
}
