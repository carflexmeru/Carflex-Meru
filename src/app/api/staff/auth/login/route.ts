import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Get staff agent info
    const { data: staffData, error: staffError } = await supabase
      .from("staff_agents")
      .select("*")
      .eq("id", authData.user?.id)
      .single();

    if (staffError || !staffData) {
      return NextResponse.json(
        { error: "Staff record not found" },
        { status: 404 }
      );
    }

    // Determine redirect path based on type
    let redirectPath = "/staff/registration";
    if (staffData.type === "GATE_VERIFICATION_AGENT") redirectPath = "/staff/gate";
    if (staffData.type === "GROUND_VERIFICATION_AGENT") redirectPath = "/staff/ground";
    if (staffData.type === "EXIT_COMMAND_AGENT") redirectPath = "/staff/exit";

    return NextResponse.json({
      success: true,
      redirectPath,
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        name: staffData.name,
        type: staffData.type,
      },
      session: authData.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
