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

  async function fetchVehicles(phoneNum: string) {
    try {
      const res = await fetch(`/api/vendor/vehicles?phone=${phoneNum}`);
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#0A0A0A] font-sans pb-32">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">My <span className="text-primary italic">Showroom</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Manage your bazaar assets and live offers.</p>
          </div>
          <Link href="/gate/check-in" className="bg-primary text-white px-10 py-4 font-black uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all">
            Add New Vehicle
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20">
        {!phone ? (
          <div className="bg-white border-4 border-primary p-12 text-center shadow-2xl">
            <h3 className="text-2xl font-black text-primary uppercase mb-4">Identity Verification Required</h3>
            <p className="text-zinc-500 font-bold mb-8 uppercase text-[10px] tracking-widest">Please enter your phone number in the Inbox to access your showroom.</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-32 border-4 border-dashed border-zinc-200">
            <span className="material-symbols-outlined text-6xl text-zinc-200 mb-4">directions_car</span>
            <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">You have no vehicles in the bazaar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-white border-4 border-black relative group shadow-[10px_10px_0px_rgba(0,0,0,0.05)] hover:shadow-[15px_15px_0px_#E60000] transition-all">
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{v.zone?.name || "UNZONED"}</p>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">{v.regNumber}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
                        v.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {v.status}
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedVehicleForExit(v);
                          setShowExitModal(true);
                        }}
                        className="text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-all"
                      >
                        Exit Bazaar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-zinc-100">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ground Verification</span>
                      <span className={`material-symbols-outlined text-sm ${v.isVerified ? 'text-green-500' : 'text-zinc-300'}`}>
                        {v.isVerified ? 'verified' : 'pending_actions'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-zinc-100">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Listing Details</span>
                      <span className={`material-symbols-outlined text-sm ${v.isComplete ? 'text-green-500' : 'text-zinc-300'}`}>
                        {v.isComplete ? 'check_circle' : 'error'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Offers</span>
                      <span className="font-black text-primary">{v.offers.length}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {!v.isComplete ? (
                      <Link 
                        href={`/showroom/complete/${v.id}`}
                        className="col-span-2 bg-[#0A0A0A] text-white py-4 text-center font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all"
                      >
                        Complete Listing
                      </Link>
                    ) : (
                      <>
                        <Link 
                          href={`/vehicles/${v.id}`}
                          className="bg-zinc-100 text-black py-4 text-center font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all"
                        >
                          View Public
                        </Link>
                        <Link 
                          href={`/showroom/offers/${v.id}`}
                          className="bg-black text-white py-4 font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all text-center"
                        >
                          Manage Offers
                        </Link>
                      </>
                    )}
                  </div>
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
