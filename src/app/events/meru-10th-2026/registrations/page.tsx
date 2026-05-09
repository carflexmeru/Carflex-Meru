"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Meru10thRegistrationsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/events/registrations?eventName=meru-10th-2026");
        const data = await res.json();
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const downloadQr = async (ticket: any) => {
    const response = await fetch(ticket.qrCodeUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${ticket.ticketId}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-12">
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">10th Edition Registration Registry</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-foreground">
          REGISTERED <br /> <span className="text-stroke italic">VEHICLES.</span>
        </h1>
        <p className="max-w-2xl text-zinc-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
          Browse every vehicle registered under the 10th edition and download the ticket or QR code from one place.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="nm-card h-80 animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="nm-inset p-16 text-center opacity-50">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">No registrations found for this event yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="nm-card p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Ticket ID</p>
                  <p className="text-lg font-black text-primary tracking-tighter break-all">{ticket.ticketId}</p>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-primary/10 text-primary">Active</span>
              </div>
              <div className="nm-inset p-4">
                <img src={ticket.qrCodeUrl} alt={`${ticket.ticketId} QR`} className="mx-auto h-40 w-40 object-contain" />
              </div>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500 font-black uppercase">Registration</span>
                  <span className="text-foreground font-black uppercase text-right">{ticket.regNumber}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500 font-black uppercase">Owner</span>
                  <span className="text-foreground font-black uppercase text-right">{ticket.ownerName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500 font-black uppercase">Zone</span>
                  <span className="text-foreground font-black uppercase text-right">{ticket.zoneName}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => downloadQr(ticket)} className="nm-card bg-zinc-900 text-white py-3 font-black uppercase tracking-widest text-[9px] border-none">
                  Download QR
                </button>
                <Link href={ticket.printUrl} target="_blank" rel="noopener noreferrer" className="nm-card bg-primary text-white py-3 font-black uppercase tracking-widest text-[9px] text-center border-none">
                  Download Ticket
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
