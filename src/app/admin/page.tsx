"use client";

import { useEffect, useState } from "react";

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    const res = await fetch("/api/admin/analytics");
    if (res.ok) {
      const result = await res.json();
      setData(result);
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  const METRICS = [
    { label: "Bazaar Inventory", value: data?.metrics.inventory, icon: "inventory_2", color: "text-foreground" },
    { label: "Live Negotiations", value: data?.metrics.negotiations, icon: "forum", color: "text-primary" },
    { label: "Gross Revenue", value: `KES ${(data?.metrics.revenue / 1000000).toFixed(1)}M`, icon: "payments", color: "text-green-600" },
    { label: "Platform Traffic", value: data?.metrics.traffic, icon: "monitoring", color: "text-blue-600" },
    { label: "Total Identities", value: data?.metrics.users, icon: "group", color: "text-zinc-400" },
    { label: "Security Events", value: data?.metrics.securityEvents, icon: "security", color: "text-primary" },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* High-Level Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {METRICS.map((m) => (
          <div key={m.label} className="nm-card bg-[var(--surface)] border border-[var(--glass-border)] p-8 md:p-10 shadow-[10px_10px_0px_rgba(0,0,0,0.12)] hover:shadow-[15px_15px_0px_#E60000] transition-all group">
            <div className="flex justify-between items-start mb-6">
               <span className={`material-symbols-outlined text-4xl ${m.color}`}>{m.icon}</span>
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-300">Live Feed</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{m.label}</p>
            <p className="text-4xl md:text-5xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Market Pulse Chart (Simplified) */}
        <div className="nm-card bg-[var(--sidebar)] text-foreground p-12 border border-[var(--glass-border)]">
          <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3 text-foreground">
             <span className="w-2 h-8 bg-primary"></span>
             Market Velocity Pulse
          </h3>
          <div className="space-y-8">
             {[
               { zone: "Premium SUV", volume: "75%", color: "bg-primary" },
               { zone: "Executive Sedans", volume: "42%", color: "bg-white" },
               { zone: "Bazaar General", volume: "91%", color: "bg-green-500" },
             ].map(z => (
               <div key={z.zone} className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span>{z.zone}</span>
                    <span>{z.volume}</span>
                 </div>
                 <div className="h-2 bg-black/5 dark:bg-white/5 w-full">
                    <div className={`h-full ${z.color} transition-all duration-1000`} style={{ width: z.volume }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Global System Health */}
        <div className="nm-card bg-[var(--surface)] border border-[var(--glass-border)] p-12">
           <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3 text-foreground">
             <span className="w-2 h-8 bg-foreground"></span>
             Infrastructure Health
          </h3>
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Database Latency</p>
                <p className="text-2xl font-black text-foreground">12ms</p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Handshakes</p>
                <p className="text-2xl font-black text-green-500 font-mono">STABLE</p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Audit Redundancy</p>
                <p className="text-2xl font-black text-foreground">ACTIVE</p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Node Sync</p>
                <p className="text-2xl font-black text-foreground">99.9%</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
