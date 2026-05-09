import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");

  if (!plate) {
    return NextResponse.json({ error: "Missing plate" }, { status: 400 });
  }

  try {
    const { data: vehicles, error } = await supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,status,is_verified,owner_id,zone_id,profiles:owner_id(id,name,phone,id_number),zones:zone_id(id,name,price)")
      .eq("reg_number", plate.toUpperCase());

    if (error) throw error;

    if (!vehicles || vehicles.length === 0) {
      return NextResponse.json({ error: "ASSET_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(
      vehicles.map((vehicle) => ({
        vehicle,
        isStolen: false,
      }))
    );
  } catch (error: any) {
    console.error("Security check error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
