import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";

    const { data: tickets, error } = await supabase
      .from("registration_tickets")
      .select("id,ticket_id,reg_number,make,model,year,owner_name,owner_phone,zone_name,amount_paid,status,created_at,vehicle_id")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const payload = (tickets || []).map((ticket: any) => {
      return {
        id: ticket.id,
        ticketId: ticket.ticket_id,
        vehicleId: ticket.vehicle_id,
        regNumber: ticket.reg_number,
        make: ticket.make,
        model: ticket.model,
        year: ticket.year,
        ownerName: ticket.owner_name || "INDIVIDUAL_OWNER",
        ownerPhone: ticket.owner_phone || "",
        zoneName: ticket.zone_name || "UNASSIGNED",
        amountPaid: ticket.amount_paid || 0,
        status: ticket.status,
        createdAt: ticket.created_at,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qr_data || ticket.ticket_id)}`,
        printUrl: `/api/vehicles/print-ticket/${ticket.ticket_id}`,
        vehicle: null,
      };
    });

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Manifest API error:", error);
    return NextResponse.json({ error: "Failed to fetch manifest" }, { status: 500 });
  }
}
