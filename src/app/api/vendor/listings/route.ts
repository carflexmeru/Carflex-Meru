import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json([], { status: 200 });
    }

    // NORMALIZE PHONE
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+") && /^\d+$/.test(normalizedPhone)) {
      normalizedPhone = "+" + normalizedPhone;
    }

    console.log(`[LISTINGS_API] Request received for raw phone: ${phone}`);
    console.log(`[LISTINGS_API] Normalized phone format: ${normalizedPhone}`);

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
       console.log(`[LISTINGS_API] FAILURE: No profile found for ${normalizedPhone} or username ${phone}. Returning empty array.`);
       return NextResponse.json([], { status: 200 }); // Return empty array if no vendor
    }

    console.log(`[LISTINGS_API] SUCCESS: Profile resolved. Name: ${vendor.name}, ID: ${vendor.id}`);

    // 2. OMNI-SEARCH PROTOCOL: Find vehicles owned by ANY profile matching these identifiers
    const shadowPhone = normalizedPhone.replace("+254", "0");
    
    const vehicles = await prisma.vehicle.findMany({
      where: {
        owner: {
          OR: [
            { id: vendor.id }, // The exact resolved profile
            { phone: normalizedPhone }, // The permanent format
            { phone: shadowPhone }, // The gate format
            { phone: phone }, // The raw input
            { username: phone }, // The login handle
            { idNumber: phone } // The National ID (if used instead of phone)
          ]
        }
      },
      include: {
        zone: true,
        views: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    console.log(`[LISTINGS_API] ASSET SCAN COMPLETE: Found ${vehicles?.length || 0} vehicles linked to ownerId ${vendor.id}.`);
    
    // Log the statuses to help debug if they are "unlisted" or draft
    if (vehicles && vehicles.length > 0) {
       vehicles.forEach(v => {
          console.log(`   -> Asset [${v.regNumber}]: Status = ${v.status}, Zone = ${v.zone?.name || 'Unassigned'}`);
       });
    }

    return NextResponse.json(Array.isArray(vehicles) ? vehicles : []);
  } catch (error: any) {
    console.error("[LISTINGS_API] CRITICAL FETCH ERROR:", error);
    // CRITICAL: Always return an array to prevent frontend crashes
    return NextResponse.json([], { status: 200 }); 
  }
}
