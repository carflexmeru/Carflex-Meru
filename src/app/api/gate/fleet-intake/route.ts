import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { organization, vehicles, paymentMethod } = body;

    const { data: repProfile, error: repError } = await supabase
      .from("profiles")
      .upsert(
        {
          phone: organization.repPhone,
          name: organization.repName,
          id_number: organization.repId,
          role: "vendor",
        },
        { onConflict: "phone" }
      )
      .select("id,phone,name,id_number")
      .single();

    if (repError) throw repError;

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: organization.name,
        rep_name: organization.repName,
        rep_id: organization.repId,
      })
      .select("id,name,rep_name,rep_id")
      .single();

    if (orgError) throw orgError;

    const createdVehicles = await Promise.all(
      (vehicles || []).map(async (v: any) => {
        const cleanPlate = v.plate.toUpperCase();
        const { data: existingVehicle, error: existingError } = await supabase
          .from("vehicles")
          .select("id,reg_number,organization_id,owner_id,zone_id,status,is_verified")
          .eq("reg_number", cleanPlate)
          .eq("organization_id", org.id)
          .limit(1);

        if (existingError) throw existingError;

        let vehicle = existingVehicle?.[0];
        if (vehicle) {
          const { data: updatedVehicle, error: updateError } = await supabase
            .from("vehicles")
            .update({
              owner_id: repProfile.id,
              zone_id: v.zoneId,
              status: "draft",
              is_verified: false,
            })
            .eq("id", vehicle.id)
            .select("id,reg_number,organization_id,owner_id,zone_id,status,is_verified")
            .single();
          if (updateError) throw updateError;
          vehicle = updatedVehicle;
        } else {
          const { data: createdVehicle, error: createError } = await supabase
            .from("vehicles")
            .insert({
              reg_number: cleanPlate,
              make: "FLEET_ASSET",
              model: organization.name,
              year: 2024,
              price: 0,
              owner_id: repProfile.id,
              organization_id: org.id,
              zone_id: v.zoneId,
              status: "draft",
              is_verified: false,
              images: JSON.stringify([]),
            })
            .select("id,reg_number,organization_id,owner_id,zone_id,status,is_verified")
            .single();
          if (createError) throw createError;
          vehicle = createdVehicle;
        }

        const { error: bookingError } = await supabase.from("bookings").insert({
          vehicle_id: vehicle.id,
          zone_id: v.zoneId,
          payment_status: "paid",
          payment_method: paymentMethod,
        });

        if (bookingError) throw bookingError;
        return vehicle;
      })
    );

    return NextResponse.json({ success: true, data: { org, vehicles: createdVehicles } });
  } catch (error: any) {
    console.error("FLEET_INTAKE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
