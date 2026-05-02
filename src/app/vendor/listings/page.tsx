"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VendorListings() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const phone = sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        const res = await fetch(`/api/vendor/listings?phone=${phone}`);
        const result = await res.json();
        // Ensure result is an array before setting state
        setVehicles(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Listings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [syncing]);

  const handleSyncAssets = async () => {
    const phone = sessionStorage.getItem("vendor_phone");
    if (!phone) return;
    
    setSyncing(true);
    try {
      const res = await fetch("/api/vendor/sync-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        const result = await res.json();
        alert(`ASSET SYNC COMPLETE: ${result.assetsMoved || 0} vehicles recovered from shadow profile.`);
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Asset Management</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">MY <br/> <span className="text-stroke italic">INVENTORY.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Forensic log of all assets currently in-bounds.</p>
        </div>
        
        <div className="nm-card p-6 flex gap-8">
           <div className="text-center">
              <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest mb-1">Live Listings</p>
              <p className="text-2xl font-black text-foreground">{vehicles.filter(v => v.status === 'active').length}</p>
           </div>
           <div className="w-px h-10 bg-white/5"></div>
           <div className="text-center">
              <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest mb-1">Pending Sync</p>
              <p className="text-2xl font-black text-primary">{vehicles.filter(v => v.status === 'draft').length}</p>
           </div>
        </div>
      </div>

      {/* Asset Recovery Protocol */}
      <div className="flex justify-end">
         <button 
            onClick={handleSyncAssets} 
            disabled={syncing}
            className="nm-card px-8 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all disabled:opacity-50"
         >
            <span className={`material-symbols-outlined text-sm ${syncing ? 'animate-spin text-primary' : ''}`}>sync</span>
            {syncing ? 'RUNNING ASSET RECOVERY...' : 'SYNC GATED ASSETS'}
         </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="nm-card h-[400px] animate-pulse"></div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="nm-inset p-40 text-center opacity-30 border-dashed border-2 border-zinc-800">
           <span className="material-symbols-outlined text-[80px] mb-6">no_accounts</span>
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Assets Found Under This Identity Node.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {vehicles.map((vehicle) => (
             <div key={vehicle.id} className="nm-card group relative overflow-hidden flex flex-col h-full hover:scale-[1.02] transition-all border-none">
                {/* Visual Status Indicator */}
                <div className={`absolute top-0 left-0 w-1 h-full ${vehicle.status === 'active' ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-primary shadow-[0_0_20px_rgba(230,0,0,0.5)]'}`}></div>
                
                <div className="p-8 space-y-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{vehicle.make} {vehicle.model}</p>
                         <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">{vehicle.regNumber}</h3>
                      </div>
                      <span className={`nm-inset px-4 py-2 text-[8px] font-black uppercase tracking-widest ${vehicle.status === 'active' ? 'text-green-500' : 'text-primary animate-pulse'}`}>
                        {vehicle.status}
                      </span>
                   </div>

                   <div className="nm-inset p-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                         <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Market Price</p>
                         <p className="text-lg font-black text-foreground">KES {(vehicle.price || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Views</p>
                         <p className="text-lg font-black text-foreground">{vehicle.views?.length || 0}</p>
                      </div>
                   </div>

                   <div className="flex-1 space-y-3">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Asset Specifications</p>
                      <div className="flex flex-wrap gap-2">
                         <span className="bg-white/5 px-3 py-1.5 rounded-lg text-[8px] font-black text-zinc-400 uppercase tracking-widest">{vehicle.year} MODEL</span>
                         <span className="bg-white/5 px-3 py-1.5 rounded-lg text-[8px] font-black text-zinc-400 uppercase tracking-widest">{vehicle.zone?.name}</span>
                         {vehicle.isVerified && <span className="bg-green-500/10 px-3 py-1.5 rounded-lg text-[8px] font-black text-green-500 uppercase tracking-widest">VERIFIED</span>}
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/5">
                      <button 
                        onClick={() => router.push(`/vendor/listings/${vehicle.id}`)}
                        className={`w-full p-6 font-black uppercase tracking-[0.3em] text-[10px] transition-all rounded-2xl flex items-center justify-center gap-3 ${vehicle.status === 'draft' ? 'nm-card bg-primary text-white hover:shadow-[0_15px_30px_rgba(230,0,0,0.3)]' : 'nm-inset text-foreground hover:bg-white/5'}`}
                      >
                        <span className="material-symbols-outlined text-sm">{vehicle.status === 'draft' ? 'publish' : 'edit'}</span>
                        {vehicle.status === 'draft' ? 'INITIALIZE LISTING' : 'MANAGE ASSET'}
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
