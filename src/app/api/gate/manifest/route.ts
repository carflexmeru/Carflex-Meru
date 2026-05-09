import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";

    const { data: tickets, error } = await supabase
      .from("registration_tickets")
      .select(
        "id,ticket_id,reg_number,make,model,year,owner_name,owner_phone,zone_name,amount_paid,status,created_at,vehicle_id,vehicles:vehicle_id(id,reg_number,make,model,year,status,is_verified,event_name,owner_id,zone_id,profiles:owner_id(id,name,phone,id_number),zones:zone_id(id,name,price))"
      )
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const payload = (tickets || []).map((ticket: any) => {
      const vehicle = ticket.vehicles || null;
      const owner = vehicle?.profiles || null;
      const zone = vehicle?.zones || null;
      return {
        id: ticket.id,
        ticketId: ticket.ticket_id,
        regNumber: ticket.reg_number,
        make: ticket.make,
        model: ticket.model,
        year: ticket.year,
        ownerName: ticket.owner_name || owner?.name || "INDIVIDUAL_OWNER",
        ownerPhone: ticket.owner_phone || owner?.phone || "",
        zoneName: ticket.zone_name || zone?.name || "UNASSIGNED",
        amountPaid: ticket.amount_paid || zone?.price || 0,
        status: ticket.status,
        createdAt: ticket.created_at,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qr_data || ticket.ticket_id)}`,
        printUrl: `/api/vehicles/print-ticket/${ticket.ticket_id}`,
        vehicle,
      };
    });

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Manifest API error:", error);
    return NextResponse.json({ error: "Failed to fetch manifest" }, { status: 500 });
  }
}
