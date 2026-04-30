import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { type, password } = await req.json();

    const agent = await prisma.staffAgent.findUnique({
      where: { type },
    });

    if (!agent || agent.password !== password) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // Update last login
    await prisma.staffAgent.update({
      where: { id: agent.id },
      data: { lastLogin: new Date() },
    });

    // In a real app, we'd set a secure cookie here. 
    // For this tactical implementation, we'll return success and the redirect path.
    let redirectPath = "/staff/registration";
    if (type === "GATE_VERIFICATION_AGENT") redirectPath = "/staff/gate";
    if (type === "GROUND_VERIFICATION_AGENT") redirectPath = "/staff/ground";

    return NextResponse.json({ 
      success: true, 
      redirectPath,
      agentName: agent.name 
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
