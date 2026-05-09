"use client";

import { useState } from "react";
import Image from "next/image";

interface VehicleQRModalProps {
  isOpen: boolean;
  vehicle: {
    id: string;
    regNumber: string;
    make: string;
    model: string;
    year: number;
    ownerName?: string;
    ownerPhone?: string;
    zoneName?: string;
    amountPaid?: number;
  } | null;
  onClose: () => void;
}

export default function VehicleQRModal({
  isOpen,
  vehicle,
  onClose
}: VehicleQRModalProps) {
  const [downloadingTicket, setDownloadingTicket] = useState(false);

  const handleDownloadTicket = async () => {
    if (!vehicle) return;

    setDownloadingTicket(true);
    try {
      // Generate a ticket ID based on vehicle data
      const ticketId = `CFX-${vehicle.regNumber.replace(/\s/g, '')}`;
      const response = await fetch(`/api/vehicles/print-ticket/${ticketId}`);
      
      if (!response.ok) {
        console.error("Ticket not found, generating new one");
        return;
      }

      const html = await response.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${vehicle.regNumber}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download ticket error:", err);
    } finally {
      setDownloadingTicket(false);
    }
  };

  if (!isOpen || !vehicle) return null;

  const qrData = JSON.stringify({
    vehicleId: vehicle.id,
    regNumber: vehicle.regNumber,
    ownerName: vehicle.ownerName || "INDIVIDUAL_OWNER",
    amount: vehicle.amountPaid || 0,
    timestamp: new Date().toISOString()
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="nm-card max-w-md w-full p-6 md:p-10 space-y-6 border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">qr_code_2</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-foreground">
                Vehicle QR Code
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Scan for verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Vehicle Info */}
        <div className="nm-inset p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Plate:</span>
            <span className="text-foreground font-black text-sm">{vehicle.regNumber}</span>
          </div>
          <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Vehicle:</span>
            <span className="text-foreground font-black text-[10px]">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Owner:</span>
            <span className="text-foreground font-black text-[10px]">{vehicle.ownerName || "INDIVIDUAL_OWNER"}</span>
          </div>
          <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Zone:</span>
            <span className="text-primary font-black text-[10px]">{vehicle.zoneName || "UNASSIGNED"}</span>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="nm-inset p-4 bg-white">
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={300}
              height={300}
              className="w-72 h-72"
              unoptimized
            />
          </div>
        </div>

        <p className="text-center text-[9px] font-black uppercase tracking-widest text-zinc-500">
          Point camera at QR code to scan
        </p>

        {/* Download Ticket Button */}
        <button
          onClick={handleDownloadTicket}
          disabled={downloadingTicket}
          className="w-full nm-card !bg-primary text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all border-none shadow-[0_15px_30px_rgba(230,0,0,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          {downloadingTicket ? "Downloading..." : "Download Ticket"}
        </button>

        <button
          onClick={onClose}
          className="w-full nm-card text-zinc-500 hover:text-foreground py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-foreground/5 transition-all border-none"
        >
          Close
        </button>
      </div>
    </div>
  );
}
