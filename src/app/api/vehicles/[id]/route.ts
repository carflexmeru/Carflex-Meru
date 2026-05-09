import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: vehicleRows, error } = await supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,status,is_verified,owner_id,zone_id,created_at")
      .eq("id", id)
      .limit(1);

    if (error) throw error;

    const vehicle = vehicleRows?.[0];
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    await supabase.from("vehicle_views").insert({
      vehicle_id: vehicle.id,
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle details" }, { status: 500 });
  }
}
