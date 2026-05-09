import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const status = searchParams.get("status");

    if (!phone) {
      return NextResponse.json(
        { message: "Phone number required" },
        { status: 400 }
      );
    }

    // Find vendor by phone
    const vendor = await prisma.profile.findUnique({
      where: { phone }
    });

    if (!vendor) {
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 }
      );
    }

    // Build query
    const whereClause: any = {
      ownerId: vendor.id
    };

    if (status) {
      whereClause.status = status;
    }

    // Fetch vendor's vehicles
    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        zone: true,
        views: true,
        offers: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Format response
    const formattedVehicles = vehicles.map(v => ({
      id: v.id,
      regNumber: v.regNumber,
      make: v.make,
      model: v.model,
      year: v.year,
      price: v.price,
      status: v.status,
      images: v.images ? JSON.parse(v.images) : [],
      registeredDays: v.atEvent ? [v.eventName] : [],
      isVerified: v.isVerified,
      isComplete: v.isComplete,
      createdAt: v.createdAt,
      views: v.views.length,
      offers: v.offers.length
    }));

    return NextResponse.json(formattedVehicles);
  } catch (error: any) {
    console.error("Vendor vehicles fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { phone, vehicleData } = await request.json();

    if (!phone || !vehicleData) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find vendor
    const vendor = await prisma.profile.findUnique({
      where: { phone }
    });

    if (!vendor) {
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 }
      );
    }

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId: vendor.id,
        regNumber: vehicleData.regNumber,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        price: vehicleData.price,
        description: vehicleData.description,
        images: vehicleData.images ? JSON.stringify(vehicleData.images) : null,
        features: vehicleData.features ? JSON.stringify(vehicleData.features) : null,
        status: "draft"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle created successfully",
      vehicle
    });
  } catch (error: any) {
    console.error("Vehicle creation error:", error);
    return NextResponse.json(
      { message: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
