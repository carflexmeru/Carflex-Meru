import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json([], { status: 200 });
    }

    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+") && /^\d+$/.test(normalizedPhone)) {
      normalizedPhone = "+" + normalizedPhone;
    }

    const shadowPhone = normalizedPhone.replace("+254", "0");

    const vendor = await prisma.profile.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { username: phone },
          { idNumber: phone }
        ]
      }
    });

    const searchMatrix: any[] = [
      { ownerPhone: normalizedPhone },
      { ownerPhone: shadowPhone },
      { ownerPhone: phone },
      { ownerIdNumber: phone }
    ];

    if (vendor?.idNumber) searchMatrix.push({ ownerIdNumber: vendor.idNumber });
    if (vendor?.email) searchMatrix.push({ ownerIdNumber: vendor.email }); // in case they used email as id

    const rawListings = await prisma.rawListing.findMany({
      where: {
        OR: searchMatrix,
        isConverted: false
      },
      orderBy: {
        gateEntryTime: "desc"
      }
    });

    return NextResponse.json(Array.isArray(rawListings) ? rawListings : []);
  } catch (error: any) {
    console.error("RAW_LISTINGS_API ERROR:", error);
    return NextResponse.json(
       { error: error.message, stack: error.stack }, 
       { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    
    // Mark as converted
    const updated = await prisma.rawListing.update({
      where: { id },
      data: { isConverted: true }
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error("CONVERT_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
