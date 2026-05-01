"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function RegistrationDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVehicles();
  }, []);

  const fetchPendingVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vehicles/pending");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setVehicles(data);
      } else {
        setVehicles([]);
        console.error("API Error:", data.error);
      }
    } catch (err) {
      console.error(err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">REGISTRATION <br/> <span className="text-stroke italic">VAULT.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Processing new entries into the bazaar mainframe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="nm-card p-10 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">pending_actions</span>
                 Recent Intake Log
              </h3>
              <div className="space-y-4">
                 {vehicles.length === 0 ? (
                   <div className="nm-inset p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                      No pending intakes detected.
                   </div>
                 ) : (
                   vehicles.slice(0, 5).map((v) => (
                     <div key={v.id} className="nm-inset p-6 flex justify-between items-center">
                        <div>
                           <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">{v.make} {v.model}</p>
                           <p className="text-xl font-black text-foreground">{v.regNumber}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-black text-primary uppercase">{v.status}</p>
                           <p className="text-[8px] text-zinc-600 uppercase mt-1">Ready for Sync</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="space-y-8">
              <div className="nm-card p-10 bg-primary/5 border-none relative overflow-hidden group">
                 <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[150px]">inventory_2</span>
                 </div>
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Division Stats</h3>
                 <div className="relative z-10">
                    <p className="text-6xl font-black text-foreground tracking-tighter">{vehicles.length}</p>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Active Intake Files</p>
                 </div>
              </div>

              <div className="nm-card p-10 space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Quick Operations</h3>
                 <div className="grid grid-cols-1 gap-4">
                    <button className="nm-inset p-6 text-left hover:text-primary transition-colors flex justify-between items-center group">
                       <span className="text-[11px] font-black uppercase tracking-widest">Generate Daily Report</span>
                       <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    </button>
                    <button className="nm-inset p-6 text-left hover:text-primary transition-colors flex justify-between items-center group">
                       <span className="text-[11px] font-black uppercase tracking-widest">Sync with Ground Units</span>
                       <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">sync</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </StaffLayout>
  );
}
