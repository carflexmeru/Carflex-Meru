"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ListingCardProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    status: string;
    regNumber: string;
    zone?: { name: string };
  };
}

export default function ListingCard({ vehicle }: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    syncTheme();
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  return (
    <div
      className="group nm-card transition-all duration-500 overflow-hidden relative border-none"
      style={{
        backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.64)",
        boxShadow: isDark ? undefined : "0 18px 30px rgba(31,26,23,0.08)",
      }}
    >
      {/* HUD Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-primary text-white text-[8px] font-black uppercase px-3 py-1 tracking-widest italic shadow-lg">
          {vehicle.status}
        </div>
        {vehicle.zone && (
          <div
            className="backdrop-blur-md text-[8px] font-black uppercase px-3 py-1 tracking-widest border"
            style={{
              backgroundColor: isDark ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.75)",
              color: "var(--foreground)",
              borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
            }}
          >
            Zone {vehicle.zone.name}
          </div>
        )}
      </div>

      {/* Action Tray */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button 
          onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
          className={`nm-card p-3 rounded-full backdrop-blur-md transition-all ${isLiked ? 'text-primary' : 'text-white hover:text-primary'}`}
        >
          <span className="material-symbols-outlined text-sm">{isLiked ? 'favorite' : 'favorite_border'}</span>
        </button>
      </div>

      {/* Image Frame */}
      <Link href={`/marketplace/${vehicle.id}`}>
        <div className="aspect-[4/3] overflow-hidden relative">
          <img 
            src={vehicle.images?.[0] || "/placeholder-car.jpg"} 
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Content Deck */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: isDark ? "#8a8a8a" : "#6b5e54" }}>{vehicle.year} {vehicle.make}</p>
              <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none" style={{ color: "var(--foreground)" }}>{vehicle.model}</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">List Price</p>
              <h3 className="text-xl font-black tracking-tight" style={{ color: "var(--foreground)" }}>KSh {vehicle.price?.toLocaleString()}</h3>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)" }}>
             <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs" style={{ color: isDark ? "#8a8a8a" : "#6b5e54" }}>license</span>
                <span className="text-[10px] font-bold uppercase" style={{ color: isDark ? "#8a8a8a" : "#6b5e54" }}>{vehicle.regNumber}</span>
             </div>
             <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:tracking-[0.2em] transition-all flex items-center gap-2">
                View Specs
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
             </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
