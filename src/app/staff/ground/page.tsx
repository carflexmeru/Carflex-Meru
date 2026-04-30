"use client";

import AgentLayout from "@/components/layout/AgentLayout";
import { useState, useEffect } from "react";

export default function GroundDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnverifiedVehicles();
  }, []);

  const fetchUnverifiedVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles/pending"); // Same as registration for now
      const data = await res.json();
      setVehicles(data.filter((v: any) => !v.isVerified));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyVehicle = async (id: string) => {
    // I'll need to create this API
    try {
      const res = await fetch(`/api/staff/verify-vehicle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchUnverifiedVehicles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AgentLayout
      agentName="Ground Intelligence Unit"
      primaryAction="INITIATE PHYSICAL SCAN"
      onAction={() => alert("Scanner Uplink Active. Move to vehicle node.")}
    >
      <div className="space-y-12 py-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">GROUND <br/> <span className="text-stroke italic">INTEL.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Verifying asset specifications and marking physical verification nodes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="nm-card p-10 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">verified</span>
                 Unverified Assets
              </h3>
              
              <div className="space-y-4">
                 {vehicles.length === 0 ? (
                   <div className="nm-inset p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                      All assets verified in this sector.
                   </div>
                 ) : (
                   vehicles.map((v) => (
                     <div key={v.id} className="nm-inset p-8 space-y-6">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">{v.make} {v.model}</p>
                              <p className="text-3xl font-black text-white tracking-tighter">{v.regNumber}</p>
                           </div>
                           <div className="px-3 py-1 nm-card bg-primary/20 border-none text-[8px] font-black text-primary uppercase">
                              Pending
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="nm-inset p-3 text-center">
                              <p className="text-[8px] font-bold text-zinc-600 uppercase">Zone</p>
                              <p className="text-[10px] font-black text-white">{v.zone?.name || "TBA"}</p>
                           </div>
                           <div className="nm-inset p-3 text-center">
                              <p className="text-[8px] font-bold text-zinc-600 uppercase">Engine</p>
                              <p className="text-[10px] font-black text-white">SYNC_PENDING</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => verifyVehicle(v.id)}
                          className="w-full nm-card bg-white text-black py-4 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all border-none"
                        >
                          VERIFY ASSET
                        </button>
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="space-y-8">
              <div className="nm-card p-10 bg-primary/5 border-none relative overflow-hidden group">
                 <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:-rotate-12 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[150px]">qr_code_scanner</span>
                 </div>
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Intelligence Stats</h3>
                 <div className="relative z-10">
                    <p className="text-6xl font-black text-white tracking-tighter">{vehicles.length}</p>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Subjects Awaiting Clearance</p>
                 </div>
              </div>

              <div className="nm-card p-10 space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Field Tools</h3>
                 <div className="grid grid-cols-1 gap-4">
                    <button className="nm-inset p-6 flex items-center gap-4 hover:text-primary transition-colors">
                       <span className="material-symbols-outlined">camera</span>
                       <span className="text-[11px] font-black uppercase tracking-widest">Capture Proof of Condition</span>
                    </button>
                    <button className="nm-inset p-6 flex items-center gap-4 hover:text-primary transition-colors">
                       <span className="material-symbols-outlined">map</span>
                       <span className="text-[11px] font-black uppercase tracking-widest">Ground Navigation</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AgentLayout>
  );
}
