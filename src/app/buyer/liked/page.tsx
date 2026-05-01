"use client";

import { useState, useEffect } from "react";
import ListingCard from "@/app/components/cards/ListingCard";

export default function BuyerLiked() {
  const [likedAssets, setLikedAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      const phone = sessionStorage.getItem("guest_phone") || sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        const res = await fetch(`/api/buyer/liked?phone=${phone}`);
        const data = await res.json();
        setLikedAssets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch liked assets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col gap-2 px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Asset Watchlist Hub</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">LIKED <br/> <span className="text-stroke italic">ASSETS.</span></h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="nm-inset h-80 animate-pulse"></div>
          ))}
        </div>
      ) : likedAssets.length === 0 ? (
        <div className="nm-card p-20 text-center opacity-20">
          <span className="material-symbols-outlined text-[100px] mb-6">favorite_border</span>
          <p className="text-[10px] font-black uppercase tracking-widest">No Assets Saved in Watchlist...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {likedAssets.map((vehicle) => (
            <ListingCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
