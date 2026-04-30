"use client";

import AgentLayout from "@/components/layout/AgentLayout";
import { useState, useEffect } from "react";

export default function GateDashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGateTransactions();
  }, []);

  const fetchGateTransactions = async () => {
    try {
      const res = await fetch("/api/dashboard/transactions"); // I'll check if this exists or create it
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AgentLayout
      agentName="Gate Command Authority"
      primaryAction="OPEN GATE ENTRY PROTOCOL"
      onAction={() => window.location.href = "/gate/check-in"}
    >
      <div className="space-y-12 py-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">GATE <br/> <span className="text-stroke italic text-primary">COMMAND.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Real-time authorization and financial clearance monitoring.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="nm-card p-10 space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">rss_feed</span>
                    Live Clearance Feed
                 </h3>
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22C55E]"></div>
              </div>
              
              <div className="space-y-4">
                 {transactions.length === 0 ? (
                   <div className="nm-inset p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                      Waiting for active signals...
                   </div>
                 ) : (
                   transactions.slice(0, 5).map((t) => (
                     <div key={t.id} className="nm-inset p-6 flex justify-between items-center group hover:bg-white/5 transition-all">
                        <div>
                           <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">{t.reference}</p>
                           <p className="text-xl font-black text-white tracking-tighter">{t.user?.phone || "ANON_NODE"}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xl font-black text-primary tracking-tighter">KES {t.amount}</p>
                           <p className="text-[8px] text-green-500 font-black uppercase mt-1">CLEARED</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="space-y-8">
              <div className="nm-card p-10 bg-primary/5 border-none relative overflow-hidden group">
                 <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[150px]">nfc</span>
                 </div>
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Command Stats</h3>
                 <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <p className="text-6xl font-black text-white tracking-tighter">
                        KES {transactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}
                      </p>
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Daily Revenue Node</p>
                    </div>
                    <div className="text-right">
                       <p className="text-3xl font-black text-white">{transactions.length}</p>
                       <p className="text-[8px] font-bold uppercase text-zinc-600">Assets Cleared</p>
                    </div>
                 </div>
              </div>

              <div className="nm-card p-10 space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Protocol Access</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <button className="nm-inset p-6 text-center hover:text-primary transition-colors">
                       <span className="material-symbols-outlined text-xl mb-2 block">emergency_home</span>
                       <span className="text-[9px] font-black uppercase tracking-widest">E-Lock</span>
                    </button>
                    <button className="nm-inset p-6 text-center hover:text-primary transition-colors">
                       <span className="material-symbols-outlined text-xl mb-2 block">history</span>
                       <span className="text-[9px] font-black uppercase tracking-widest">Logs</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AgentLayout>
  );
}
