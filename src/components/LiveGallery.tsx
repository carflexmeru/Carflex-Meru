"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
  isVerified: boolean;
  zone: { name: string } | null;
}

export default function LiveGallery() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setError(null);
        const response = await fetch("/api/vehicles?status=active");
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          setVehicles(data);
        } else {
          throw new Error(data.error || "Bazaar Offline");
        }
      } catch (error: any) {
        console.error("Failed to fetch vehicles:", error);
        setError(error.message);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-24 px-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center justify-between mb-20 px-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Live <span className="text-primary italic">Inventory</span></h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Real-time bazaar data from the Meru Showground mainframe.</p>
        </div>
        <div className="nm-inset flex items-center gap-3 px-6 py-3">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Sync</span>
        </div>
      </div>

      {error ? (
        <div className="nm-card p-20 text-center border-primary/20">
          <span className="material-symbols-outlined text-6xl text-primary/40 mb-6">cloud_off</span>
          <p className="text-primary/60 font-black uppercase tracking-widest text-sm mb-6">The bazaar mainframe is currently offline</p>
          <button 
            onClick={() => window.location.reload()}
            className="nm-card bg-primary text-white px-10 py-4 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
          >
            Attempt Re-Connection
          </button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="nm-card p-20 text-center">
          <span className="material-symbols-outlined text-6xl text-zinc-800 mb-6">no_cars</span>
          <p className="text-zinc-600 font-black uppercase tracking-widest text-sm">No active assets found in the current cycle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="nm-card group p-4 hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
              <div className="aspect-[16/10] nm-inset relative overflow-hidden rounded-[1.5rem] mb-6">
                <div className="absolute inset-0 flex items-center justify-center text-zinc-900">
                  <span className="material-symbols-outlined text-8xl opacity-10">directions_car</span>
                </div>
                
                {/* Status Badges */}
                <div className="absolute top-6 left-6 z-10 flex gap-2">
                   {vehicle.isVerified && (
                     <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-green-500/30 flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
                       <span className="text-[9px] font-black uppercase text-white tracking-widest">Verified</span>
                     </div>
                   )}
                </div>
                
                {vehicle.zone && (
                  <div className="absolute top-6 right-6 z-10 nm-card bg-primary/90 px-4 py-1.5 border-none text-[9px] font-black uppercase text-white tracking-widest shadow-[0_5px_15px_rgba(230,0,0,0.3)]">
                    {vehicle.zone.name}
                  </div>
                )}
              </div>

              <div className="px-4 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">
                      {vehicle.year} {vehicle.make} <br/>
                      <span className="text-zinc-500 italic">{vehicle.model}</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-black text-2xl tracking-tighter">
                      {(vehicle.price / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">KES Valuation</p>
                  </div>
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 nm-card bg-zinc-900/50 hover:bg-primary hover:text-white text-zinc-400 py-4 font-black uppercase text-[9px] tracking-widest transition-all">
                      View Details
                   </button>
                   <button className="w-14 nm-card bg-zinc-900/50 hover:bg-white hover:text-black text-zinc-400 flex items-center justify-center transition-all">
                      <span className="material-symbols-outlined text-lg">favorite</span>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
