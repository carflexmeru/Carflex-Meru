import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: { status: "withdrawn" }
    });

    return NextResponse.json({ success: true, data: updatedOffer });
  } catch (error) {
    console.error("Offer withdrawal error:", error);
    return NextResponse.json({ error: "Failed to withdraw offer" }, { status: 500 });
  }
}
