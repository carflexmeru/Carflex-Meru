import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    // NORMALIZE PHONE
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+")) {
      normalizedPhone = "+" + normalizedPhone;
    }

    // 1. Resolve Profile First
    const vendor = await prisma.profile.findFirst({
       where: {
         OR: [
           { phone: normalizedPhone },
           { username: phone }
         ]
       }
    });

    if (!vendor) {
       return NextResponse.json([], { status: 200 }); // Return empty array if no vendor
    }

    // 2. Fetch Vehicles with Direct ID link
    const vehicles = await prisma.vehicle.findMany({
      where: {
        ownerId: vendor.id
      },
      include: {
        zone: true,
        views: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(Array.isArray(vehicles) ? vehicles : []);
  } catch (error: any) {
    console.error("Vendor listings fetch error:", error);
    // CRITICAL: Always return an array to prevent frontend crashes
    return NextResponse.json([], { status: 200 }); 
  }
}
