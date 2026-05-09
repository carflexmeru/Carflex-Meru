"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function GroundLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState("");

  useEffect(() => {
    const syncEvent = () => setActiveEvent(localStorage.getItem("carflex_staff_event") || "");
    syncEvent();
    window.addEventListener("staffeventchange", syncEvent);
    fetchLogs();
    return () => window.removeEventListener("staffeventchange", syncEvent);
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const qs = activeEvent ? `?eventName=${encodeURIComponent(activeEvent)}` : "";
      const res = await fetch(`/api/staff/logs${qs}`);
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
            Active Event: {activeEvent || "None selected"}
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">GROUND <br/> <span className="text-primary italic text-stroke">AUDIT.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Monitoring physical asset verifications and sector assignment logs.</p>
        </div>

        <div className="nm-card p-10">
          <div className="space-y-4">
            {loading ? (
              <div className="nm-inset p-20 text-center animate-pulse">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Retrieving Ground History...</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="nm-inset p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-12 h-12 nm-card flex items-center justify-center bg-zinc-900">
                      <span className="material-symbols-outlined text-primary text-xl">location_searching</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground uppercase tracking-tight">{log.description}</p>
                      <p className="text-[8px] text-zinc-600 font-black uppercase mt-1">Ground Intel Node: {log.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-500 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</p>
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
