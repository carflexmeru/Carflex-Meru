"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MarketplacePage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      const res = await fetch("/api/vehicles?status=active");
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-24 space-y-16">
      <div className="flex flex-col gap-2">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Global Inventory</p>
        <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
          THE <br/> <span className="text-stroke">MARKETPLACE.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-6">Verified premium assets from authorized vendors across the network.</p>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <Link 
              key={v.id}
              href={`/vehicles/${v.id}`}
              className="nm-card group overflow-hidden bg-black flex flex-col border-none hover:scale-[1.02] transition-all"
            >
              <div className="h-64 relative overflow-hidden bg-zinc-900">
                {v.images?.[0] ? (
                  <img src={v.images[0]} alt={v.make} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-zinc-800">directions_car</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/80 px-4 py-1 text-[8px] font-black uppercase tracking-widest text-primary rounded-full">
                  Verified
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                   <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{v.year}</p>
                   <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{v.make} {v.model}</h3>
                   <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{v.regNumber}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end">
                   <div>
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Asset Value</p>
                      <p className="text-xl font-black text-white">KES {v.price?.toLocaleString() || "P.O.A"}</p>
                   </div>
                   <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
