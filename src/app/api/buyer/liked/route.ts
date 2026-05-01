import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) return NextResponse.json([], { status: 200 });

    const user = await prisma.profile.findFirst({
      where: { OR: [{ phone }, { username: phone }] }
    });

    if (!user) return NextResponse.json([], { status: 200 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        vehicle: {
          include: { zone: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(favorites.map(f => f.vehicle));
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { phone, vehicleId } = await request.json();
    
    const user = await prisma.profile.findFirst({
      where: { OR: [{ phone }, { username: phone }] }
    });

    if (!user) return NextResponse.json({ error: "Identity not found" }, { status: 404 });

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_vehicleId: {
          userId: user.id,
          vehicleId
        }
      }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.favorite.create({
        data: { userId: user.id, vehicleId }
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Transmission failure" }, { status: 500 });
  }
}
