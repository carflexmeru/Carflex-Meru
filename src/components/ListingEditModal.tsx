"use client";

import { useState } from "react";

interface ListingEditProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
  onSuccess: () => void;
}

export default function ListingEditModal({ isOpen, onClose, vehicle, onSuccess }: ListingEditProps) {
  const [price, setPrice] = useState(vehicle?.price?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/vendor/complete-listing`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          price: parseFloat(price),
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <form onSubmit={handleUpdate} className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-black p-10 animate-scale-up shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Edit Listing</h3>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-10">Adjust DNA for {vehicle.regNumber}</p>

        <div className="space-y-6">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Price (KES)</label>
              <input
                required
                type="number"
                placeholder="e.g. 8700000"
                className="w-full bg-zinc-50 border-2 border-primary/20 p-5 text-2xl font-black outline-none focus:border-primary"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
           </div>
           
           <div className="pt-4 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                className="flex-2 bg-black text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
