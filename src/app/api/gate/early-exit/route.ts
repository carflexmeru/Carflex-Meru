import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { vehicleId, reason } = await request.json();

    if (!vehicleId || !reason) {
      return NextResponse.json({ error: "Vehicle ID and Reason required" }, { status: 400 });
    }

    const { data: bookingRows, error: bookingError } = await supabase
      .from("bookings")
      .select("id,vehicle_id,exit_at,check_in_at")
      .eq("vehicle_id", vehicleId)
      .is("exit_at", null)
      .order("check_in_at", { ascending: false })
      .limit(1);

    if (bookingError) throw bookingError;

    const booking = bookingRows?.[0];
    if (!booking) {
      return NextResponse.json({ error: "No active booking found for this vehicle" }, { status: 404 });
    }

    const qrHash = crypto.randomBytes(32).toString("hex");

    const { error: exitPassError } = await supabase.from("exit_passes").insert({
      booking_id: booking.id,
      qr_jwt_hash: qrHash,
    });
    if (exitPassError) throw exitPassError;

    await supabase.from("audit_logs").insert({
      action: `EARLY_EXIT_REQUESTED: Vehicle ${vehicleId}. Reason: ${reason}`,
    });

    return NextResponse.json({ success: true, qrHash });
  } catch (error) {
    console.error("Early exit error:", error);
    return NextResponse.json({ error: "Failed to generate exit pass" }, { status: 500 });
  }
}
