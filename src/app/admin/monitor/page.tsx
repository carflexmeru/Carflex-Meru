"use client";

import { useEffect, useState } from "react";

export default function SystemMonitor() {
  const [uptime, setUptime] = useState("00:00:00");

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Core Uptime", value: uptime, color: "text-black" },
          { label: "CPU Utilization", value: "14%", color: "text-green-500" },
          { label: "Memory Pool", value: "256MB / 1GB", color: "text-black" },
          { label: "Network IO", value: "2.4 MB/s", color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="bg-white border-4 border-black p-8">
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{s.label}</p>
             <p className={`text-3xl font-black tracking-tighter ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0A0A0A] p-12 border-4 border-black font-mono text-zinc-500 text-xs leading-relaxed space-y-4">
        <div className="flex gap-4">
           <span className="text-primary font-black">[BOOT]</span>
           <span>System Kernel 4D-DNA-v1.0 initialized successfully.</span>
        </div>
        <div className="flex gap-4">
           <span className="text-green-500 font-black">[DB_LINK]</span>
           <span>SQLite connection pool established. (Primary: dev.db)</span>
        </div>
        <div className="flex gap-4">
           <span className="text-white font-black">[DARAJA]</span>
           <span>Sandbox handshake complete. Handlers listening for callbacks.</span>
        </div>
        <div className="flex gap-4">
           <span className="text-white font-black">[PRISMA]</span>
           <span>Schema verification complete. 18 tables validated.</span>
        </div>
        <div className="flex gap-4">
           <span className="text-primary animate-pulse font-black">[WATCHDOG]</span>
           <span>Monitoring real-time bargaining websockets...</span>
        </div>
      </div>
    </div>
  );
}
