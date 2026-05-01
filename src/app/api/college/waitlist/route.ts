import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, coursePref } = data;

    if (!email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Resolve or Create Profile
    const profile = await prisma.profile.upsert({
      where: { phone: phone || `COLLEGE-${email}` },
      update: { name, email },
      create: {
        phone: phone || `COLLEGE-${email}`,
        name,
        role: "student",
      }
    });

    const lead = await prisma.collegeLead.create({
      data: {
        userId: profile.id,
        coursePref,
      },
    });

    return NextResponse.json({ success: true, message: "Waitlist joined successfully", data: lead });
  } catch (error) {
    console.error("College waitlist error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
