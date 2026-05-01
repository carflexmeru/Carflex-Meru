"use client";

import { useState, useEffect } from "react";

export default function VendorLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const phone = sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        const res = await fetch(`/api/vendor/stats?phone=${phone}`);
        const data = await res.json();
        setLogs(data.recentActivity || []);
      } catch (err) {
        console.error("Logs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Operational Forensic Audit</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">ACTIVITY <br/> <span className="text-stroke italic">TIMELINE.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Historical record of all identity-linked events.</p>
      </div>

      <div className="nm-card p-10">
         <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5 lg:left-10"></div>

            <div className="space-y-10 relative">
               {loading ? (
                 Array(5).fill(0).map((_, i) => (
                   <div key={i} className="flex gap-8 animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5"></div>
                      <div className="flex-1 nm-inset h-20"></div>
                   </div>
                 ))
               ) : logs.length === 0 ? (
                 <div className="py-20 text-center opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Forensic Logs Found for This Identity Node.</p>
                 </div>
               ) : (
                 logs.map((log, i) => (
                   <div key={i} className="flex gap-8 group">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${log.type === 'MESSAGE' ? 'bg-primary shadow-[0_0_20px_rgba(230,0,0,0.3)]' : 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'}`}>
                         <span className="material-symbols-outlined text-white text-sm">{log.type === 'MESSAGE' ? 'chat' : 'sync_alt'}</span>
                      </div>
                      <div className="flex-1 nm-inset p-8 group-hover:bg-white/5 transition-all">
                         <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{new Date(log.time).toLocaleString()}</p>
                               <h4 className="text-xl font-black text-foreground uppercase tracking-tight italic">{log.message}</h4>
                            </div>
                            <div className="text-right">
                               <span className={`nm-card px-4 py-2 text-[8px] font-black uppercase tracking-widest ${log.type === 'MESSAGE' ? 'text-primary' : 'text-green-500'}`}>
                                  {log.type}
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
