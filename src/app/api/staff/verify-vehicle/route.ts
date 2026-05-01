import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        isVerified: true,
        status: "verified",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error: any) {
    console.error("VERIFY_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
