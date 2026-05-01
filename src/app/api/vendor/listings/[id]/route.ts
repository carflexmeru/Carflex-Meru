import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { price, description, features, images, ownershipProofUrl, status } = body;

    // 1. Update the Vehicle Asset
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        price: price ? parseFloat(price) : undefined,
        description,
        features,
        ownershipProofUrl,
        images,
        status: status || "active", // Promote to active if not specified
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, vehicle: updatedVehicle });
  } catch (error: any) {
    console.error("Asset update error:", error);
    return NextResponse.json({ error: "FAILED_TO_PROMOTE_ASSET" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { zone: true, owner: true }
    });
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: "ASSET_NOT_FOUND" }, { status: 404 });
  }
}
