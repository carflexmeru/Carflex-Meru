"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StaffLayout from "@/components/layout/StaffLayout";
import Link from "next/link";

interface Ticket {
  id: string;
  ticketId: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  ownerName: string;
  ownerPhone: string;
  ownerIdNumber: string;
  zoneName: string;
  amountPaid: number;
  status: string;
  qrData: string;
  createdAt: string;
}

export default function RegisteredTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingQR, setDownloadingQR] = useState<string | null>(null);
  const [downloadingTicket, setDownloadingTicket] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/vehicles/tickets");
        const data = await res.json();
        if (data.success) {
          setTickets(data.tickets);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const handleDownloadQR = async (ticket: Ticket) => {
    setDownloadingQR(ticket.ticketId);
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qrData)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${ticket.ticketId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download QR error:", err);
    } finally {
      setDownloadingQR(null);
    }
  };

  const handleDownloadTicket = async (ticket: Ticket) => {
    setDownloadingTicket(ticket.ticketId);
    try {
      const response = await fetch(`/api/vehicles/print-ticket/${ticket.ticketId}`);
      const html = await response.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${ticket.ticketId}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download ticket error:", err);
    } finally {
      setDownloadingTicket(null);
    }
  };

  const handleShareTicket = async (ticket: Ticket) => {
    const shareUrl = `${window.location.origin}/gate/ticket/${ticket.ticketId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Carflex Ticket ${ticket.ticketId}`,
          text: `Ticket ${ticket.ticketId} for ${ticket.regNumber}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Ticket link copied to clipboard.");
      }
    } catch (err) {
      console.error("Share ticket error:", err);
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaffLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">confirmation_number</span>
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
                  Registered <span className="text-primary italic">Tickets</span>
                </h1>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Event Enrollment History & Verification Logs
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="nm-inset p-1 flex items-center gap-3 pr-6">
              <div className="p-3 text-zinc-500">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                placeholder="SEARCH PLATE, ID, OR OWNER..."
                className="bg-transparent border-none outline-none w-full text-[10px] font-black uppercase tracking-widest py-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="nm-card p-6 border-l-4 border-primary">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Issued</p>
            <p className="text-3xl font-black text-foreground tracking-tighter">{tickets.length}</p>
          </div>
          <div className="nm-card p-6 border-l-4 border-zinc-700">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">Revenue Collected</p>
            <p className="text-3xl font-black text-foreground tracking-tighter">
              KSH {tickets.reduce((acc, t) => acc + (t.amountPaid || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="nm-card p-6 border-l-4 border-zinc-700">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">Today</p>
            <p className="text-3xl font-black text-foreground tracking-tighter">
              {tickets.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
        </div>

        {/* Tickets Table - Desktop View */}
        <div className="hidden md:block nm-card overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-400">ID</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-400">Plate</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-400">Vehicle</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-400">Owner</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-400">Zone</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-400">Amount</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="p-6 bg-white/5 h-16" />
                    </tr>
                  ))
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                        <span className="font-mono text-[10px] text-primary font-bold">{ticket.ticketId}</span>
                      </td>
                      <td className="p-6 font-black uppercase tracking-widest text-xs text-foreground">
                        {ticket.regNumber}
                      </td>
                      <td className="p-6 text-[10px] text-zinc-400">
                        {ticket.year} {ticket.make} {ticket.model}
                      </td>
                      <td className="p-6 text-[10px] text-zinc-400 font-bold uppercase">
                        {ticket.ownerName}
                      </td>
                      <td className="p-6">
                        <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {ticket.zoneName}
                        </span>
                      </td>
                      <td className="p-6 font-black text-foreground text-xs">
                        KSH {ticket.amountPaid?.toLocaleString()}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadQR(ticket)}
                            disabled={downloadingQR === ticket.ticketId}
                            className="nm-inset p-2 rounded-lg text-zinc-500 hover:text-primary transition-colors flex items-center justify-center w-10 h-10 disabled:opacity-50"
                            title="Download QR Code"
                          >
                            <span className="material-symbols-outlined text-sm">qr_code_2</span>
                          </button>
                          <button
                            onClick={() => handleDownloadTicket(ticket)}
                            disabled={downloadingTicket === ticket.ticketId}
                            className="nm-inset p-2 rounded-lg text-zinc-500 hover:text-primary transition-colors flex items-center justify-center w-10 h-10 disabled:opacity-50"
                            title="Download Ticket"
                          >
                            <span className="material-symbols-outlined text-sm">download</span>
                          </button>
                          <button
                            onClick={() => handleShareTicket(ticket)}
                            className="nm-inset p-2 rounded-lg text-zinc-500 hover:text-primary transition-colors flex items-center justify-center w-10 h-10"
                            title="Share Ticket"
                          >
                            <span className="material-symbols-outlined text-sm">share</span>
                          </button>
                          <Link
                            href={`/gate/ticket/${ticket.ticketId}`}
                            className="nm-inset p-2 rounded-lg text-zinc-500 hover:text-primary transition-colors flex items-center justify-center w-10 h-10"
                            title="View Details"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <span className="material-symbols-outlined text-zinc-700 text-5xl">inventory_2</span>
                        <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">No tickets found for this event</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tickets Grid - Mobile View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="nm-card p-4 animate-pulse h-40" />
            ))
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="nm-card p-4 space-y-3 border border-white/5">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Ticket ID</p>
                    <p className="font-mono text-sm text-primary font-bold">{ticket.ticketId}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {ticket.zoneName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Plate</p>
                    <p className="font-black uppercase text-xs text-foreground">{ticket.regNumber}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Amount</p>
                    <p className="font-black text-xs text-foreground">KSH {ticket.amountPaid?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">Vehicle</p>
                  <p className="text-[10px] text-zinc-400">{ticket.year} {ticket.make} {ticket.model}</p>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">Owner</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">{ticket.ownerName}</p>
                  <p className="text-[9px] text-zinc-500">{ticket.ownerPhone}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                  <button
                    onClick={() => handleDownloadQR(ticket)}
                    disabled={downloadingQR === ticket.ticketId}
                    className="nm-card p-3 text-zinc-500 hover:text-primary transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">qr_code_2</span>
                    <span className="text-[7px] font-black uppercase tracking-widest">QR</span>
                  </button>
                  <button
                    onClick={() => handleDownloadTicket(ticket)}
                    disabled={downloadingTicket === ticket.ticketId}
                    className="nm-card p-3 text-zinc-500 hover:text-primary transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span className="text-[7px] font-black uppercase tracking-widest">Download</span>
                  </button>
                  <button
                    onClick={() => handleShareTicket(ticket)}
                    className="nm-card p-3 text-zinc-500 hover:text-primary transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                    <span className="text-[7px] font-black uppercase tracking-widest">Share</span>
                  </button>
                  <Link
                    href={`/gate/ticket/${ticket.ticketId}`}
                    className="nm-card p-3 text-zinc-500 hover:text-primary transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    <span className="text-[7px] font-black uppercase tracking-widest">View</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="nm-card p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-zinc-700 text-5xl">inventory_2</span>
                <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">No tickets found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  );
}
