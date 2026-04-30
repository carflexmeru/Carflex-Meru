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

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("/api/vehicles?status=active");
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
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
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black text-white uppercase mb-2">Live Bazaar Gallery</h2>
          <p className="text-gray-400 font-medium">Real-time inventory from the Meru Showground.</p>
        </div>
        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Live Syncing
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <span className="material-symbols-outlined text-6xl text-white/20 mb-4">no_cars</span>
          <p className="text-gray-500 font-bold uppercase tracking-widest">No active vehicles found in the bazaar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all group shadow-2xl">
              <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-zinc-800">
                  <span className="material-symbols-outlined text-7xl">directions_car</span>
                </div>
                {/* Verification Badge */}
                {vehicle.isVerified && (
                  <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Verified</span>
                  </div>
                )}
                {/* Zone Badge */}
                {vehicle.zone && (
                  <div className="absolute top-4 right-4 z-10 bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest shadow-lg">
                    {vehicle.zone.name}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight uppercase">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                      {vehicle.regNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-black text-xl">
                      KES {(vehicle.price / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
                <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                  View Details
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
