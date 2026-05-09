"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
  images: string[];
  isVerified: boolean;
  isComplete: boolean;
  views: number;
  offers: number;
}

export default function VendorDashboard() {
  const [data, setData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "draft" | "active" | "sold">("all");

  useEffect(() => {
    const fetchStats = async () => {
      const phone = sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        // Fetch dashboard stats
        const statsRes = await fetch(`/api/vendor/stats?phone=${phone}`);
        const statsData = await statsRes.json();
        setData(statsData);

        // Fetch vendor's vehicles
        const vehiclesRes = await fetch(`/api/vendor/vehicles?phone=${phone}`);
        if (vehiclesRes.ok) {
          const vehiclesData = await vehiclesRes.json();
          setVehicles(vehiclesData);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const filteredVehicles = filter === "all" 
    ? vehicles 
    : vehicles.filter(v => v.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "sold":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

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
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">COMMAND <br className="hidden md:block" /> <span className="text-stroke italic">OVERVIEW.</span></h1>
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
        {/* Vehicles Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Your Vehicles</h3>
            <div className="flex gap-2 flex-wrap">
              {(["all", "draft", "active", "sold"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-full transition-all ${
                    filter === status
                      ? "bg-primary text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  {status === "all" ? "All" : status}
                </button>
              ))}
            </div>
          </div>

          {vehicles.length === 0 ? (
            <div className="nm-inset p-12 text-center opacity-50">
              <span className="material-symbols-outlined text-4xl mb-4 block">directions_car</span>
              <p className="text-[10px] font-black uppercase tracking-widest">No vehicles found</p>
              <Link href="/vendor/onboarding" className="text-primary text-[9px] font-black uppercase tracking-widest mt-4 inline-block hover:underline">
                Add your first vehicle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="nm-card overflow-hidden border-none hover:scale-[1.02] transition-all">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0 bg-zinc-900 rounded-lg overflow-hidden">
                      {vehicle.images?.[0] ? (
                        <img src={vehicle.images[0]} alt={vehicle.make} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-zinc-700">directions_car</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-primary text-[9px] font-black uppercase tracking-widest">{vehicle.year}</p>
                            <h4 className="text-lg font-black uppercase tracking-tighter text-white">
                              {vehicle.make} {vehicle.model}
                            </h4>
                            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">{vehicle.regNumber}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(vehicle.status)}`}>
                            {vehicle.status}
                          </div>
                        </div>
                        <p className="text-white text-[10px] font-black mt-2">KES {vehicle.price?.toLocaleString()}</p>
                      </div>

                      {/* Stats & Actions */}
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                        <div className="flex gap-4 text-[9px]">
                          <div className="flex items-center gap-1 text-zinc-400">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span>{vehicle.views} views</span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-400">
                            <span className="material-symbols-outlined text-sm">local_offer</span>
                            <span>{vehicle.offers} offers</span>
                          </div>
                        </div>
                        <button className="w-full nm-card p-3 font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:scale-105 transition-all border-none">
                          List Vehicle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Stream */}
        <div className="lg:col-span-1 space-y-8">
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

          {/* Quick Actions */}
          <div className="space-y-4 pt-8 border-t border-white/5">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Tactical Shortcuts</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/events/register" className="nm-card p-8 flex flex-col items-center justify-center gap-4 group hover:bg-primary transition-all border-none text-center">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-4xl">event</span>
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">Register Event</span>
              </Link>
              <button className="nm-card p-8 flex flex-col items-center justify-center gap-4 group hover:bg-primary transition-all border-none">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-4xl">add_a_photo</span>
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">Quick Upload</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
