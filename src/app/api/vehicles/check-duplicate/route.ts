import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { regNumber } = await request.json();

    if (!regNumber) {
      return NextResponse.json(
        { message: "Registration number required" },
        { status: 400 }
      );
    }

    const { data: existingVehicle, error } = await supabase
      .from("vehicles")
      .select("id,reg_number,make,model,year,price,status,created_at,owner_id")
      .eq("reg_number", regNumber.toUpperCase())
      .limit(1);

    if (error) throw error;

    if (existingVehicle?.[0]) {
      return NextResponse.json({
        isDuplicate: true,
        existingVehicle: {
          id: existingVehicle[0].id,
          regNumber: existingVehicle[0].reg_number,
          make: existingVehicle[0].make,
          model: existingVehicle[0].model,
          year: existingVehicle[0].year,
          price: existingVehicle[0].price,
          status: existingVehicle[0].status,
          owner: null,
          createdAt: existingVehicle[0].created_at,
        },
      });
    }

    return NextResponse.json({
      isDuplicate: false,
      existingVehicle: null,
    });
  } catch (error: any) {
    console.error("Duplicate check error:", error);
    return NextResponse.json(
      { message: "Failed to check for duplicates" },
      { status: 500 }
    );
  }
}
