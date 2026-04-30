import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, email, phone, coursePref } = data;

    if (!email || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Following 4D DNA: Link to profile or create if not exists
    let user = await prisma.profile.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.profile.create({
        data: {
          phone,
          fullName,
          role: "student",
        }
      });
    }

    const lead = await prisma.collegeLead.create({
      data: {
        userId: user.id,
        coursePref,
      },
    });

    return NextResponse.json({ success: true, message: "Waitlist joined successfully", data: lead });
  } catch (error) {
    console.error("College waitlist error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
