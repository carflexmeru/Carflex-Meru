"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function ExitLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/staff/logs");
        const data = await res.json();
        // Filter for exit-related logs
        const exitLogs = data.filter((l: any) => 
          l.type === "FINAL_DEPARTURE" || l.id.startsWith("exit-")
        );
        setLogs(exitLogs);
      } catch (err) {
        console.error("Logs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">DEPARTURE <br/> <span className="text-primary italic">LOGS.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Historical forensic audit of all cleared assets.</p>
        </div>

        <div className="nm-card p-10">
          <div className="space-y-6">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="nm-inset h-20 animate-pulse"></div>
              ))
            ) : logs.length === 0 ? (
              <div className="py-20 text-center opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Departure Records Found.</p>
              </div>
            ) : logs.map((log) => (
              <div key={log.id} className="nm-inset p-6 flex justify-between items-center group hover:bg-primary/5 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">logout</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{log.timestamp}</p>
                    <p className="text-lg font-black text-foreground uppercase tracking-tight">{log.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="nm-inset px-4 py-2 text-[8px] font-black text-green-500 uppercase tracking-widest">
                    CLEARED_BY_GATE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
