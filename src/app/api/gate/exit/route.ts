import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { vehicleId } = await request.json();

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 });
    }

    const { data: updatedRows, error: updateError } = await supabase
      .from("vehicles")
      .update({
        status: "exited",
        is_verified: false,
      })
      .eq("id", vehicleId)
      .select("id,reg_number,make,model,year,status,is_verified")
      .limit(1);

    if (updateError) throw updateError;

    const updatedVehicle = updatedRows?.[0];
    if (!updatedVehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    await supabase.from("action_logs").insert({
      action_type: "FINAL_DEPARTURE",
      agent_name: "EXIT_COMMAND_GATE",
      description: `Asset ${updatedVehicle.reg_number} successfully exited the bazaar.`,
      metadata: { vehicleId, plate: updatedVehicle.reg_number },
    });

    return NextResponse.json({ success: true, vehicle: updatedVehicle });
  } catch (error: any) {
    console.error("Exit API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
