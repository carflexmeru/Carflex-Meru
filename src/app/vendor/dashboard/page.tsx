"use client";

import { useState, useEffect } from "react";

export default function VendorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const phone = sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        const res = await fetch(`/api/vendor/stats?phone=${phone}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="nm-card h-48 bg-zinc-900/10"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Operational Intelligence</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">COMMAND <br/> <span className="text-stroke italic">OVERVIEW.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Welcome back, {data?.vendorName || "Commander"}.</p>
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="nm-card p-10 group hover:bg-primary/5 transition-all">
          <div className="flex justify-between items-start mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Asset Units</span>
          </div>
          <p className="text-6xl font-black text-foreground tracking-tighter mb-2">{data?.analytics?.totalAssets}</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Fleet Registered</p>
        </div>

        <div className="nm-card p-10 group hover:bg-primary/5 transition-all">
          <div className="flex justify-between items-start mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">visibility</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Market Reach</span>
          </div>
          <p className="text-6xl font-black text-foreground tracking-tighter mb-2">{data?.analytics?.totalViews}</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Asset Impressions</p>
        </div>

        <div className="nm-card p-10 group hover:bg-primary/5 transition-all">
          <div className="flex justify-between items-start mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">monetization_on</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Asset Value</span>
          </div>
          <p className="text-6xl font-black text-foreground tracking-tighter mb-2 italic">KES {data?.analytics?.totalValue.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Aggregate Market Cap</p>
        </div>

        <div className="nm-card p-10 group hover:bg-primary/5 transition-all">
          <div className="flex justify-between items-start mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Listings</span>
          </div>
          <p className="text-6xl font-black text-foreground tracking-tighter mb-2">{data?.analytics?.activeListings}</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Currently Live in Bazaar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Activity Stream */}
        <div className="lg:col-span-2 space-y-8">
           <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4">Live Activity Stream</h3>
           <div className="space-y-4">
              {data?.recentActivity?.map((activity: any, i: number) => (
                <div key={i} className="nm-inset p-6 flex justify-between items-center group hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'MESSAGE' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'}`}>
                         <span className="material-symbols-outlined text-sm">{activity.type === 'MESSAGE' ? 'chat' : 'sync_alt'}</span>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{new Date(activity.time).toLocaleString()}</p>
                         <p className="text-lg font-black text-foreground uppercase tracking-tight italic">{activity.message}</p>
                      </div>
                   </div>
                </div>
              ))}
              {(!data?.recentActivity || data.recentActivity.length === 0) && (
                <div className="nm-inset p-20 text-center opacity-20">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Recent Tactical Events Recorded.</p>
                </div>
              )}
           </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
           <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4">Tactical Shortcuts</h3>
           <div className="grid grid-cols-1 gap-4">
              <button className="nm-card p-8 flex flex-col items-center justify-center gap-4 group hover:bg-primary transition-all border-none">
                 <span className="material-symbols-outlined text-primary group-hover:text-white text-4xl">add_a_photo</span>
                 <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">Quick Upload</span>
              </button>
              <button className="nm-card p-8 flex flex-col items-center justify-center gap-4 group hover:bg-primary transition-all border-none">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-4xl">support_agent</span>
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">Request Support</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
