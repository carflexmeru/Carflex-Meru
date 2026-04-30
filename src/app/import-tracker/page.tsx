"use client";

import { useState } from "react";

const STAGES = [
  { id: 1, name: "Purchase & Inspection", location: "Yokohama, Japan", status: "completed" },
  { id: 2, name: "Booking & Loading", location: "Port of Nagoya", status: "completed" },
  { id: 3, name: "On the High Seas", location: "Indian Ocean", status: "active" },
  { id: 4, name: "Arrival & Port Clearance", location: "Mombasa, Kenya", status: "pending" },
  { id: 5, name: "Transit to Nairobi", location: "SGR / Road", status: "pending" },
];

export default function ImportTracker() {
  const [trackingId, setTrackingId] = useState("");
  const [activeShipment, setActiveShipment] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans pb-32">
      {/* Hero */}
      <div className="pt-32 pb-24 px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[400px]">ship</span>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
            Global <br/> <span className="text-primary">Import</span> Tracker
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Direct Logistics from Japan & UK to your doorstep.</p>
          
          <div className="mt-16 flex gap-4">
            <input
              type="text"
              placeholder="ENTER SHIPMENT / CHASSIS ID"
              className="bg-white/5 border border-white/10 px-8 py-5 rounded-none text-xl font-black tracking-widest outline-none focus:border-primary w-full max-w-xl"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
            <button 
              onClick={() => setActiveShipment(true)}
              className="bg-primary text-white px-12 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              TRACK
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-24">
        {!activeShipment ? (
          <div className="text-center py-32 opacity-20">
            <span className="material-symbols-outlined text-9xl">package_2</span>
            <p className="font-black uppercase tracking-[0.5em] mt-8">Waiting for input...</p>
          </div>
        ) : (
          <div className="space-y-16 animate-fade-in">
            {/* Shipment Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-12">
              <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Shipment Reference</p>
                <h2 className="text-4xl font-black uppercase tracking-tight">{trackingId}</h2>
                <p className="text-zinc-500 font-bold mt-1">Vessel: MV GREEN HARVEST</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">ETA Mombasa</p>
                <p className="text-3xl font-black text-white">MAY 15, 2026</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-1 bg-white/10 w-full absolute top-8 left-0"></div>
              <div className="h-1 bg-primary w-[50%] absolute top-8 left-0 shadow-[0_0_20px_#E60000]"></div>
              
              <div className="grid grid-cols-5 gap-4 relative z-10">
                {STAGES.map((stage) => (
                  <div key={stage.id} className="text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border-4 ${
                      stage.status === "completed" ? "bg-primary border-primary" :
                      stage.status === "active" ? "bg-black border-primary animate-pulse" :
                      "bg-zinc-900 border-zinc-800"
                    }`}>
                      <span className="material-symbols-outlined text-white">
                        {stage.status === "completed" ? "check" : stage.id === 3 ? "sailing" : "hourglass_empty"}
                      </span>
                    </div>
                    <div className="px-2">
                      <p className={`text-[9px] font-black uppercase tracking-tight leading-tight ${
                        stage.status === "pending" ? "text-zinc-600" : "text-white"
                      }`}>
                        {stage.name}
                      </p>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase mt-1">{stage.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics Detail Card */}
            <div className="bg-white/5 border border-white/10 p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                Live Logistics Intel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Current Coordinates</p>
                    <p className="font-mono text-primary">6.1659° S, 39.2026° E (Off Zanzibar)</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Last Transmission</p>
                    <p className="font-bold">4 Minutes ago via Satellite Link</p>
                  </div>
                </div>
                <div className="bg-black p-6 border border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Port Documents</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-400">Bill of Lading</span>
                      <span className="text-green-500">READY</span>
                    </li>
                    <li className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-400">QISJ Certificate</span>
                      <span className="text-green-500">READY</span>
                    </li>
                    <li className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-400">KRA Entry ID</span>
                      <span className="text-zinc-600">AWAITING ARRIVAL</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
