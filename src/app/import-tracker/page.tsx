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
    <div className="min-h-screen bg-[#080808] text-white font-sans pb-32 relative overflow-hidden">
      {/* Liquid Background */}
      <div className="liquid-bg opacity-30">
        <div className="liquid-blob" style={{ top: '10%', right: '0%', width: '50vw', height: '50vw' }}></div>
      </div>

      {/* Hero */}
      <div className="relative pt-48 pb-24 px-8 z-10">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="nm-inset inline-flex items-center gap-2 px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]"></span>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Global Logistics Mainframe</p>
          </div>

          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.8]">
            Vessel <br/> <span className="text-stroke italic">Intelligence.</span>
          </h1>
          
          <div className="mt-16 flex flex-col md:flex-row gap-6 max-w-3xl">
            <div className="flex-1 nm-inset">
              <input
                type="text"
                placeholder="SHIPMENT_ID / CHASSIS"
                className="bg-transparent px-8 py-6 rounded-none text-xl font-black tracking-widest outline-none text-white w-full border-none placeholder:text-white/5"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setActiveShipment(true)}
              className="nm-card bg-primary text-white px-14 py-6 font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all border-none"
            >
              TRACK NODE
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-24 relative z-10">
        {!activeShipment ? (
          <div className="nm-card py-32 text-center border-dashed border-zinc-900 opacity-40">
            <span className="material-symbols-outlined text-7xl text-zinc-800 mb-8">query_stats</span>
            <p className="font-black uppercase tracking-[0.5em] text-[10px]">Awaiting Uplink Data...</p>
          </div>
        ) : (
          <div className="space-y-16 animate-fade-in">
            {/* Shipment Header */}
            <div className="nm-card p-12 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-center md:text-left">
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Shipment Reference</p>
                <h2 className="text-5xl font-black uppercase tracking-tighter">{trackingId}</h2>
                <p className="text-zinc-500 font-bold mt-2 uppercase text-[9px] tracking-widest">Carrier: MV GREEN HARVEST • IMO 912345</p>
              </div>
              <div className="nm-inset p-8 text-center">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">ETA Mombasa Node</p>
                <p className="text-4xl font-black text-white tracking-tighter">MAY 15, 2026</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="nm-card p-12 relative overflow-hidden">
               <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
                {STAGES.map((stage) => (
                  <div key={stage.id} className="text-center space-y-6">
                    <div className={`w-20 h-20 nm-card mx-auto flex items-center justify-center border-none ${
                      stage.status === "completed" ? "bg-green-500/10" :
                      stage.status === "active" ? "bg-primary/20 animate-pulse" :
                      "bg-zinc-900/20"
                    }`}>
                      <span className={`material-symbols-outlined ${
                        stage.status === "completed" ? "text-green-500" : 
                        stage.status === "active" ? "text-primary" : "text-zinc-700"
                      }`}>
                        {stage.status === "completed" ? "verified" : stage.id === 3 ? "sailing" : "hourglass_empty"}
                      </span>
                    </div>
                    <div className="px-2">
                      <p className={`text-[10px] font-black uppercase tracking-tight leading-tight mb-2 ${
                        stage.status === "pending" ? "text-zinc-700" : "text-white"
                      }`}>
                        {stage.name}
                      </p>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{stage.location}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Progress Line */}
              <div className="hidden md:block absolute top-24 left-32 right-32 h-[2px] bg-zinc-900 z-0">
                 <div className="h-full bg-primary shadow-[0_0_15px_#E60000] transition-all duration-1000" style={{ width: '50%' }}></div>
              </div>
            </div>

            {/* Logistics Detail Card */}
            <div className="nm-card p-12 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-12">
                 <span className="material-symbols-outlined text-primary text-2xl">satellite_alt</span>
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Logistics <span className="text-zinc-600">Intelligence.</span></h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="nm-inset p-8">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Live Coordinates</p>
                    <p className="font-mono text-primary text-xl tracking-tighter">6.1659° S, 39.2026° E (Off Zanzibar)</p>
                  </div>
                  <div className="px-8">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Last Uplink</p>
                    <p className="font-bold text-sm uppercase tracking-widest">4 Minutes ago via Orbital Link</p>
                  </div>
                </div>
                <div className="nm-card p-10 bg-zinc-900/30 border-none">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Manifest Documentation</p>
                  <ul className="space-y-4">
                    {[
                      { name: "Bill of Lading", status: "READY" },
                      { name: "QISJ Certificate", status: "READY" },
                      { name: "KRA Entry ID", status: "AWAITING" }
                    ].map((doc) => (
                      <li key={doc.name} className="flex justify-between items-center nm-inset px-4 py-3">
                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-tight">{doc.name}</span>
                        <span className={`text-[9px] font-black ${doc.status === "READY" ? "text-green-500" : "text-zinc-600"}`}>
                          {doc.status}
                        </span>
                      </li>
                    ))}
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
