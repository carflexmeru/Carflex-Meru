"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EarlyExitModal from "@/components/EarlyExitModal";

interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  status: string;
  isVerified: boolean;
  isComplete: boolean;
  zone: { name: string } | null;
  offers: any[];
}

export default function MyShowroom() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleForExit, setSelectedVehicleForExit] = useState<Vehicle | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("carflex_phone") || "";
    setPhone(storedPhone);
    if (storedPhone) {
      fetchVehicles(storedPhone);
    } else {
      setLoading(false);
    }
  }, []);

  const [error, setError] = useState<string | null>(null);

  async function fetchVehicles(phoneNum: string) {
    try {
      setError(null);
      const res = await fetch(`/api/vendor/vehicles?phone=${phoneNum}`);
      const data = await res.json();
      
      if (res.ok && Array.isArray(data)) {
        setVehicles(data);
      } else {
        throw new Error(data.error || "SERVER_OFFLINE");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setVehicles([]); // Reset to empty array on error to prevent .map crashes
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans pb-32 relative overflow-hidden">
      {/* Liquid Background */}
      <div className="liquid-bg opacity-30">
        <div className="liquid-blob" style={{ top: '20%', left: '10%' }}></div>
      </div>

      {/* Header */}
      <div className="relative pt-40 pb-24 px-8 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">Vendor <br/> <span className="text-stroke italic text-primary">Vault.</span></h1>
            <div className="nm-inset inline-flex items-center gap-2 px-4 py-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]"></span>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Live Asset Management • Showground Terminal</p>
            </div>
          </div>
          <Link href="/gate/check-in" className="nm-card bg-primary text-white px-12 py-5 font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-all border-none">
            Deploy New Asset
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        {error ? (
          <div className="nm-card p-16 text-center border-primary/20">
            <h3 className="text-3xl font-black text-primary uppercase tracking-tighter mb-4">SYSTEM INTERRUPTION</h3>
            <p className="text-zinc-500 font-bold mb-10 uppercase text-[10px] tracking-widest leading-relaxed">
              The bazaar mainframe uplink has been severed. <br/> Error Log: {error}
            </p>
            <button 
              onClick={() => fetchVehicles(phone)}
              className="nm-card bg-primary text-white px-10 py-4 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all border-none"
            >
              Re-Sync Mainframe
            </button>
          </div>
        ) : !phone ? (
          <div className="nm-card p-16 text-center">
            <h3 className="text-3xl font-black text-primary uppercase tracking-tighter mb-4">UPLINK REQUIRED</h3>
            <p className="text-zinc-500 font-bold mb-8 uppercase text-[10px] tracking-widest">Connect your mobile node in the Inbox to access your private vault.</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="nm-card p-24 text-center border-dashed border-zinc-900">
            <span className="material-symbols-outlined text-7xl text-zinc-800 mb-8">inventory_2</span>
            <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">Your private vault is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {vehicles.map((v) => (
              <div key={v.id} className="nm-card group p-8 space-y-8 hover:scale-[1.02] transition-transform duration-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">{v.zone?.name || "RESERVED"}</p>
                    <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{v.regNumber}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="nm-inset px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      {v.status}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedVehicleForExit(v);
                        setShowExitModal(true);
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-primary transition-all"
                    >
                      Evacuate
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 nm-inset">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ground Verification</span>
                    <span className={`material-symbols-outlined text-sm ${v.isVerified ? 'text-green-500' : 'text-zinc-700'}`}>
                      {v.isVerified ? 'verified' : 'pending_actions'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 nm-inset">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Metadata Sync</span>
                    <span className={`material-symbols-outlined text-sm ${v.isComplete ? 'text-primary' : 'text-zinc-700'}`}>
                      {v.isComplete ? 'check_circle' : 'error'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4 pt-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Live Offers</span>
                    <span className="font-black text-white text-xl tracking-tighter">{v.offers.length}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  {!v.isComplete ? (
                    <Link 
                      href={`/showroom/complete/${v.id}`}
                      className="col-span-2 nm-card bg-white text-black py-5 text-center font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all border-none"
                    >
                      Sync Specifications
                    </Link>
                  ) : (
                    <>
                      <Link 
                        href={`/vehicles/${v.id}`}
                        className="nm-card bg-zinc-900/50 text-zinc-400 py-5 text-center font-black uppercase text-[9px] tracking-widest hover:text-white transition-all border-none"
                      >
                        Public Feed
                      </Link>
                      <Link 
                        href={`/showroom/offers/${v.id}`}
                        className="nm-card bg-zinc-900/50 text-primary py-5 font-black uppercase text-[9px] tracking-widest hover:bg-primary hover:text-white transition-all text-center border-none"
                      >
                        Offers Hub
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EarlyExitModal 
        isOpen={showExitModal} 
        onClose={() => setShowExitModal(false)} 
        vehicle={selectedVehicleForExit}
        onSuccess={() => fetchVehicles(phone)}
      />
    </div>
  );
}
