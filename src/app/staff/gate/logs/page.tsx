"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function GateLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff/logs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">GATE <br/> <span className="text-primary italic text-stroke">AUDIT.</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Reviewing tactical gate verifications and entrance clearance signals.</p>
          </div>
          <button onClick={fetchLogs} className="nm-card p-4 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        <div className="nm-card p-10">
          <div className="space-y-4">
            {loading ? (
              <div className="nm-inset p-20 text-center animate-pulse">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Retrieving Gate History...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="nm-inset p-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">No active signals found.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="nm-inset p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-12 h-12 nm-card flex items-center justify-center bg-zinc-900">
                      <span className="material-symbols-outlined text-primary text-xl">
                        {log.type === 'ASSET_REGISTRATION' ? 'verified' : 'security'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold mb-1 uppercase tracking-widest">{log.type}</p>
                      <p className="text-sm font-black text-white uppercase tracking-tight">{log.description}</p>
                      <p className="text-[8px] text-zinc-600 font-black uppercase mt-1">Operator: {log.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-zinc-500 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">{log.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
