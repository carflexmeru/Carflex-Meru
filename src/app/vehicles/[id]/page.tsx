"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ShareCardModal from "@/components/ShareCardModal";

interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  price: number;
  isVerified: boolean;
  owner: { name: string; phone: string } | null;
  zone: { name: string } | null;
}

export default function VehicleProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchVehicle() {
      const res = await fetch(`/api/vehicles/${id}`);
      if (res.ok) {
        const data = await res.json();
        setVehicle(data);
      }
      setLoading(false);
    }
    fetchVehicle();
  }, [id]);

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/offers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: id,
          buyerPhone,
          amount: offerAmount,
        }),
      });

      if (res.ok) {
        setShowOfferModal(false);
        alert("Offer sent! You can now track this in your Bargain Inbox.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;
  if (!vehicle) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Vehicle not found</div>;

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-32">
      {/* Dark Header/Gallery Section */}
      <div className="bg-[#0A0A0A] pt-32 pb-24 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center relative z-10">
          <div className="flex-1 w-full aspect-[16/10] bg-zinc-900 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
             <span className="material-symbols-outlined text-9xl text-white/10">directions_car</span>
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              {vehicle.isVerified && (
                <span className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Verified Asset</span>
              )}
              <span className="bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{vehicle.zone?.name}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              {vehicle.year} <br/>
              <span className="text-primary">{vehicle.make}</span> {vehicle.model}
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xl">{vehicle.regNumber}</p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-20">
        <div className="md:col-span-2 space-y-12">
          <section className="space-y-6">
            <h3 className="text-3xl font-black uppercase tracking-tight">Vehicle Specifications</h3>
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Transmission", value: "Automatic" },
                { label: "Fuel Type", value: "Petrol" },
                { label: "Engine", value: "V8 4.5L" },
                { label: "Mileage", value: "45,000 KM" },
              ].map((spec) => (
                <div key={spec.label} className="border-b border-zinc-200 pb-4">
                  <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">{spec.label}</p>
                  <p className="text-xl font-bold">{spec.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-3xl font-black uppercase tracking-tight">Vendor Information</h3>
            <div className="flex items-center gap-4 bg-zinc-50 p-6 rounded-3xl border-2 border-zinc-100">
              <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">person</span>
              </div>
              <div>
                <p className="font-black uppercase text-lg">{vehicle.owner?.name || "Verified Vendor"}</p>
                <p className="text-zinc-500 text-sm font-medium">Bazaar Platinum Member</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0A0A0A] text-white p-8 rounded-3xl shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Bazaar Listing Price</p>
            <p className="text-5xl font-black tracking-tighter mb-8">
              KES {(vehicle.price / 1000000).toFixed(1)}M
            </p>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-4">
                <span className="text-zinc-500">Negotiable</span>
                <span>Yes</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-4">
                <span className="text-zinc-500">Exchange</span>
                <span>Considered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-6 z-40 shadow-[0_-10px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="hidden md:block">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Viewing now</p>
            <p className="font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
          </div>
          <div className="flex gap-4 flex-1 md:flex-none">
            <button 
              onClick={() => setShowShareModal(true)}
              className="px-8 py-5 border-2 border-black font-black text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-all"
            >
              Share Listing
            </button>
            <button 
              onClick={() => setShowOfferModal(true)}
              className="flex-1 md:flex-none bg-primary text-white px-12 py-5 rounded-none font-black text-sm tracking-widest uppercase hover:bg-black transition-all shadow-[0_0_30px_rgba(230,0,0,0.3)]"
            >
              Make an Offer
            </button>
          </div>
        </div>
      </div>

      <ShareCardModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        vehicle={vehicle} 
      />

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOfferModal(false)}></div>
          <form onSubmit={handleOffer} className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-primary p-10 animate-scale-up shadow-2xl">
            <div className="mb-8">
              <h3 className="text-3xl font-black uppercase tracking-tighter">Bargain Proposal</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Submit your best price to the vendor.</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Offer Amount (KES)</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 8500000"
                  className="w-full bg-zinc-50 border-2 border-primary/20 rounded-none px-6 py-4 text-2xl font-black outline-none focus:border-primary transition-all"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Phone Number</label>
                <input
                  required
                  type="tel"
                  placeholder="0712345678"
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-none px-6 py-4 font-bold outline-none focus:border-black transition-all"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                />
              </div>

              <button
                disabled={isSubmitting}
                className="w-full bg-black text-white py-5 font-black uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Submit Proposal"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
