"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Meru10thListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/events/listings?eventName=meru-10th-2026");
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">10th Edition Inventory</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">THE <br/> <span className="text-stroke italic">YARD.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Forensic manifest of assets physically present at the 10th edition bazaar.</p>
        </div>

        <div className="nm-card p-6 flex gap-8 bg-primary/5">
           <div className="text-center">
              <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest mb-1">On-Site Fleet</p>
              <p className="text-3xl font-black text-foreground">{listings.length}</p>
           </div>
           <div className="w-px h-10 bg-white/5"></div>
           <div className="text-center">
              <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest mb-1">Entry Price</p>
              <p className="text-3xl font-black text-primary">500</p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="nm-card h-[450px] animate-pulse"></div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="nm-inset p-40 text-center opacity-30 border-dashed border-2 border-zinc-800 rounded-[3rem]">
           <span className="material-symbols-outlined text-[80px] mb-6 text-primary">directions_car</span>
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">Event Fleet Deployment in Progress...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {listings.map((vehicle) => (
             <Link href={`/marketplace/${vehicle.id}`} key={vehicle.id} className="nm-card group relative overflow-hidden flex flex-col h-full hover:scale-[1.02] transition-all border-none">
                <div className="h-64 bg-zinc-900 relative">
                   {vehicle.images?.[0] ? (
                     <img src={vehicle.images[0]} className="w-full h-full object-cover transition-all duration-700" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-zinc-800">image_not_supported</span>
                     </div>
                   )}
                   <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                      IN SHOWGROUND
                   </div>
                   <div className="absolute bottom-4 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                      ZONE {vehicle.zone?.name || "A"}
                   </div>
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{vehicle.make} {vehicle.model}</p>
                         <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">{vehicle.regNumber}</h3>
                      </div>
                      <p className="text-2xl font-black text-primary tracking-tighter italic">KES {(vehicle.price || 0).toLocaleString()}</p>
                   </div>

                   <div className="flex-1 space-y-3">
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Exhibitor Node</p>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs">storefront</span>
                         </div>
                         <p className="text-sm font-black text-foreground uppercase tracking-tight">{vehicle.owner?.name}</p>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-zinc-500 text-sm">visibility</span>
                            <span className="text-[10px] font-black text-zinc-500">{vehicle.views?.length || 0}</span>
                         </div>
                      </div>
                      <span className="text-primary text-[10px] font-black uppercase tracking-widest">Inspect Asset</span>
                   </div>
                </div>
             </Link>
           ))}
        </div>
      )}
    </div>
  );
}
