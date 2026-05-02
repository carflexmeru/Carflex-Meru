"use client";

import { useState, useEffect } from "react";
import ListingCard from "@/components/cards/ListingCard";

export default function BuyerDashboard() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/marketplace?limit=4");
        const data = await res.json();
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Analytics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="nm-card p-10 space-y-4 bg-primary text-white relative overflow-hidden group">
           <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 blur-[50px] rounded-full group-hover:scale-150 transition-all duration-700"></div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Acquisition Power</p>
           <h2 className="text-4xl font-black italic">ACTIVE LEADS</h2>
           <p className="text-6xl font-black tracking-tighter">04</p>
        </div>
        <div className="nm-card p-10 space-y-4">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Vault Security</p>
           <h2 className="text-4xl font-black italic text-foreground uppercase">WATCHLIST</h2>
           <p className="text-6xl font-black tracking-tighter text-foreground">12</p>
        </div>
        <div className="nm-card p-10 space-y-4">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Ledger Status</p>
           <h2 className="text-4xl font-black italic text-foreground uppercase">TRANSFERS</h2>
           <p className="text-6xl font-black tracking-tighter text-foreground">02</p>
        </div>
      </div>

      {/* Main Mission Deck */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-2">Market Intelligence</p>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic">RECOMMENDED <br/> <span className="text-stroke">ASSETS.</span></h2>
           </div>
           <button className="nm-card px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all">
              View All Marketplace
           </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="nm-inset h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((vehicle) => (
              <ListingCard key={vehicle.id} vehicle={vehicle} />
            ))}
            {recommendations.length === 0 && (
               <div className="col-span-full nm-inset p-20 text-center opacity-20">
                  <span className="material-symbols-outlined text-[100px] mb-6">inventory_2</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">No Intelligence Gathered Yet...</p>
               </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity Ledger */}
      <div className="nm-card p-10">
         <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Recent Mission Logs</h3>
         <div className="space-y-6">
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center gap-6 p-4 nm-inset hover:bg-white/5 transition-all">
                 <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">notifications</span>
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">Price Drop Alert: 2022 Toyota Land Cruiser</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Status: Information Received | 2 hours ago</p>
                 </div>
                 <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:tracking-[0.2em] transition-all">
                    View
                 </button>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
