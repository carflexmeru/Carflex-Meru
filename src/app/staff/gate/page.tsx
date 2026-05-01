"use client";

import AgentLayout from "@/components/layout/AgentLayout";
import { useState, useEffect } from "react";

export default function GateDashboard() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vehicles/pending");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPending(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/vehicles/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      if (res.ok) fetchPendingVerifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AgentLayout
      agentName="Gate Command Authority"
      primaryAction="REFRESH MANIFEST"
      onAction={fetchPendingVerifications}
    >
      <div className="space-y-12 py-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">GATE <br/> <span className="text-stroke italic text-primary">MANIFEST.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Authorizing asset entry and verifying operational clearance.</p>
        </div>

        <div className="nm-card p-10 space-y-8">
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                Pending Authorization [{pending.length}]
             </h3>
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]"></div>
          </div>
          
          <div className="space-y-6">
             {loading ? (
               <div className="nm-inset p-12 text-center animate-pulse">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Syncing with Mainframe...</p>
               </div>
             ) : pending.length === 0 ? (
               <div className="nm-inset p-12 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">No assets currently in staging.</p>
               </div>
             ) : (
               pending.map((v) => (
                 <div key={v.id} className="nm-inset p-8 flex flex-wrap md:flex-nowrap justify-between items-center gap-8 group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 nm-card bg-zinc-900 flex items-center justify-center font-black text-primary text-xl">
                        {v.regNumber.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">{v.owner?.name || "INDIVIDUAL_OWNER"}</p>
                        <p className="text-3xl font-black text-white tracking-tighter uppercase">{v.regNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">Sector Assignment</p>
                        <p className="text-xl font-black text-white tracking-tight uppercase">{v.zone?.name || "UNASSIGNED"}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleVerify(v.id)}
                        className="nm-card bg-primary text-white px-8 py-4 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_20px_rgba(230,0,0,0.3)] hover:scale-[1.05] active:scale-95 transition-all border-none"
                      >
                        AUTHORIZE ENTRY
                      </button>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
