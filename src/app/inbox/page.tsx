"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Offer {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  vehicle: { make: string; model: string; year: number; regNumber: string } | null;
  buyer: { phone: string } | null;
}

export default function BargainInbox() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneFilter, setPhoneFilter] = useState("");

  async function fetchOffers() {
    if (!phoneFilter) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/offers?phone=${phoneFilter}`);
      const data = await res.json();
      setOffers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#0A0A0A] font-sans">
      <div className="bg-[#0A0A0A] text-white pt-32 pb-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Bargain Inbox</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Track your negotiations in real-time.</p>
          
          <div className="mt-12 flex gap-4">
            <input
              type="tel"
              placeholder="ENTER YOUR PHONE NUMBER"
              className="bg-white/5 border border-white/10 px-6 py-4 rounded-none text-white font-bold tracking-widest outline-none focus:border-primary w-full max-w-md"
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
            />
            <button 
              onClick={fetchOffers}
              className="bg-primary text-white px-8 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              FETCH
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-20">
        {!phoneFilter ? (
          <div className="text-center py-20 border-4 border-dashed border-zinc-200 rounded-none">
            <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">Enter your phone number above to view active bargains.</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">No active negotiations found for this number.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Link 
                key={offer.id} 
                href={`/inbox/${offer.id}`}
                className="block bg-white border-2 border-zinc-100 p-8 hover:border-black transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-center relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{offer.status}</p>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">
                      {offer.vehicle?.year} {offer.vehicle?.make} {offer.vehicle?.model}
                    </h3>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{offer.vehicle?.regNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Your Offer</p>
                    <p className="text-2xl font-black tracking-tighter text-black">KES {(offer.amount / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary">forum</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
