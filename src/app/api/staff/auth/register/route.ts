import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password, name, type } = await req.json();

    if (!email || !password || !name || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          type, // REGISTRATION_AGENT, GATE_VERIFICATION_AGENT, GROUND_VERIFICATION_AGENT, EXIT_COMMAND_AGENT
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Store staff agent info in database
    if (authData.user) {
      const { error: dbError } = await supabase
        .from("staff_agents")
        .insert({
          id: authData.user.id,
          email,
          name,
          type,
          created_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json(
          { error: "Failed to create staff record" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Staff account created successfully",
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        name,
        type,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
