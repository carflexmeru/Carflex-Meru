"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MeruExhibitors() {
  const [exhibitors, setExhibitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        const res = await fetch(`/api/events/listings?eventName=MERU_2026`);
        const data = await res.json();
        
        // Extract unique exhibitors from listings
        const uniqueExhibitors = Array.from(new Set(data.map((v: any) => v.owner?.id)))
          .map(id => {
            const vendor = data.find((v: any) => v.owner?.id === id).owner;
            const count = data.filter((v: any) => v.owner?.id === id).length;
            return { ...vendor, assetCount: count };
          });
          
        setExhibitors(uniqueExhibitors);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-16">
      <div className="flex flex-col gap-2 text-center items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Tactical Partner Directory</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">EXHIBITOR <br/> <span className="text-stroke italic">ROW.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Registry of professional vendors currently on-site at ASK Meru.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {Array(6).fill(0).map((_, i) => <div key={i} className="nm-card h-64 animate-pulse"></div>)}
        </div>
      ) : exhibitors.length === 0 ? (
        <div className="nm-inset p-40 text-center opacity-30">
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Exhibitors Registered for This Deployment Yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {exhibitors.map((ex) => (
             <div key={ex.id} className="nm-card p-10 flex flex-col items-center text-center space-y-6 group hover:bg-white/5 transition-all">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 relative">
                   <span className="material-symbols-outlined text-primary text-4xl">storefront</span>
                   <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg">
                      {ex.assetCount} ASSETS
                   </div>
                </div>

                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter italic">{ex.name || ex.username}</h3>
                   <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Verified Bazaar Vendor</p>
                </div>

                <div className="nm-inset w-full p-4 space-y-2">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                      <span>Physical Booth</span>
                      <span className="text-white">ASK_MAIN_ARENA</span>
                   </div>
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                      <span>Status</span>
                      <span className="text-green-500">ON-SITE</span>
                   </div>
                </div>

                <Link href={`/events/meru-2026/listings?vendorId=${ex.id}`} className="w-full nm-card bg-white text-black py-4 font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-all border-none">
                   VIEW SHOWGROUND FLEET
                </Link>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
