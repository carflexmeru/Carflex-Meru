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

    // 2. ULTIMATE OMNI-SEARCH PROTOCOL: Cast a net using ALL immutable identifiers
    const shadowPhone = normalizedPhone.replace("+254", "0");
    
    // Build an array of highly-reliable query parameters
    const searchMatrix: any[] = [
      { id: vendor.id }, 
      { phone: normalizedPhone }, 
      { phone: shadowPhone }, 
      { phone: phone }, 
      { username: phone }, 
      { idNumber: phone } 
    ];

    // If the resolved profile has these immutable fields, add them to the matrix!
    if (vendor.email) searchMatrix.push({ email: vendor.email });
    if (vendor.idNumber) searchMatrix.push({ idNumber: vendor.idNumber });
    if (vendor.username) searchMatrix.push({ username: vendor.username });

    const vehicles = await prisma.vehicle.findMany({
      where: {
        owner: {
          OR: searchMatrix
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
