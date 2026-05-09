import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { staffId, newPassword } = await req.json();

    if (!staffId || !newPassword) {
      return NextResponse.json(
        { error: "Staff ID and new password required" },
        { status: 400 }
      );
    }

    // Verify admin access (you should add proper admin verification)
    const adminToken = req.headers.get("authorization");
    if (!adminToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update password in Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(staffId, {
      password: newPassword,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Log the password change
    const { error: logError } = await supabase
      .from("admin_logs")
      .insert({
        action: "STAFF_PASSWORD_CHANGED",
        staff_id: staffId,
        timestamp: new Date().toISOString(),
      });

    if (logError) {
      console.error("Log error:", logError);
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
