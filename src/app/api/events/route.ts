import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      include: { zones: true },
    });

    const enriched = await Promise.all(
      events.map(async (event) => {
        const vehicleCount = await prisma.vehicle.count({
          where: { eventName: event.id, atEvent: true },
        });

        return {
          ...event,
          vehicleCount,
          zonePrices: event.zones.map((zone) => ({
            name: zone.name,
            price: zone.price,
          })),
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const location = String(body.location || "").trim();
    const isActive = body.isActive !== false;
    const price = Number(body.price ?? 500);
    const capacity = Number(body.capacity ?? 100);

    if (!name || !location) {
      return NextResponse.json({ error: "Event name and location are required" }, { status: 400 });
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const event = await prisma.event.upsert({
      where: { id },
      update: {
        name,
        location,
        isActive,
      },
      create: {
        id,
        name,
        location,
        isActive,
      },
    });

    const baseZones = [
      { name: `${name} - Premium Row`, capacity, price: price * 3 },
      { name: `${name} - Standard Row`, capacity: capacity + 50, price: price * 2 },
      { name: `${name} - Motorcycles`, capacity: capacity + 80, price },
    ];

    await Promise.all(
      baseZones.map((zone) =>
        prisma.zone.upsert({
          where: { name: zone.name },
          update: {
            eventId: event.id,
            capacity: zone.capacity,
            price: zone.price,
          },
          create: {
            name: zone.name,
            capacity: zone.capacity,
            price: zone.price,
            eventId: event.id,
          },
        })
      )
    );

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Event create error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
