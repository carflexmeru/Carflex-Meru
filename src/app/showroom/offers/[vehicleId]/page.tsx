"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Offer {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  buyer: { phone: string; fullName: string | null } | null;
  vehicle: { regNumber: string; make: string; model: string } | null;
}

export default function OfferManager() {
  const { vehicleId } = useParams();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, [vehicleId]);

  async function fetchOffers() {
    const res = await fetch(`/api/vendor/offers/${vehicleId}`);
    if (res.ok) {
      const data = await res.json();
      setOffers(data);
    }
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#0A0A0A] font-sans pb-32">
      <div className="bg-[#0A0A0A] text-white pt-32 pb-24 px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Offer <span className="text-primary italic">Intelligence</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Managing bids for {offers[0]?.vehicle?.regNumber || "Asset"}</p>
          </div>
          <Link href="/showroom" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all underline underline-offset-8 decoration-primary">
            Back to Showroom
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-20">
        {offers.length === 0 ? (
          <div className="text-center py-32 border-4 border-dashed border-zinc-200">
            <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">No active offers for this asset yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white border-2 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-white px-3 py-1 font-black text-[9px] uppercase tracking-widest">{offer.status}</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">{new Date(offer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter">KES {offer.amount.toLocaleString()}</h3>
                  <p className="text-sm font-bold text-zinc-500 uppercase">From: {offer.buyer?.phone}</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                   <Link 
                    href={`/inbox/${offer.id}`}
                    className="flex-1 md:flex-none border-2 border-black px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all text-center"
                   >
                    Chat
                   </Link>
                   <button className="flex-1 md:flex-none bg-primary text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">
                    Accept Offer
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
