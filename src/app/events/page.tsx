"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EventsDirectory() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    syncTheme();
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  const upcomingEvents = [
    {
      id: "meru-2026",
      name: "MERU CAR BAZAAR",
      location: "ASK Meru Showground",
      date: "May 03, 2026",
      status: "LIVE_RECORDS_ACTIVE",
      image: "/car_bazaar_bg.png",
      description: "One-day high-intensity exhibition of Kenya's finest automotive assets. Verified vendors and premium inventory."
    },
    {
      id: "meru-10th-2026",
      name: "MERU CAR BAZAAR 10TH",
      location: "ASK Meru Showground",
      date: "Sunday, May 10, 2026",
      status: "KSH_500_ENTRY",
      image: "/meru_10th_2026_card.jpg",
      description: "The 10th edition brings the updated KES 500 pricing, fresh branding, and a new generation of tactical car bazaar energy."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-24 space-y-16" style={{ color: "var(--foreground)" }}>
      <div className="flex flex-col gap-2">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Tactical Operations</p>
        <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
          BAZAAR <br/> <span className="text-stroke">MISSIONS.</span>
        </h1>
        <p className="font-bold uppercase tracking-widest text-[10px] mt-6" style={{ color: isDark ? "#8a8a8a" : "#5b5048" }}>
          Registry of active and upcoming tactical car bazaar deployments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {upcomingEvents.map((event) => (
          <Link 
            key={event.id}
            href={`/events/${event.id}`}
            className="nm-card group relative h-[550px] overflow-hidden flex flex-col border-none hover:scale-[1.02] transition-all"
            style={{ backgroundColor: isDark ? "#0f0f0f" : "#f8f5ef" }}
          >
             <div className="h-2/3 relative overflow-hidden">
                <img src={event.image} alt={event.name} className="w-full h-full object-cover transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute top-6 right-6 bg-primary text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg">
                   {event.status}
                </div>
                {event.id === "meru-10th-2026" && (
                  <div className="absolute top-6 left-6 bg-black/70 text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg">
                    10TH EDITION
                  </div>
                )}
             </div>

             <div
               className="p-8 flex-1 flex flex-col justify-between"
               style={{
                 backgroundColor: isDark ? "#0f0f0f" : "#f8f5ef",
                 color: "var(--foreground)",
               }}
             >
                <div className="space-y-2">
                   <p className="text-primary text-[9px] font-black uppercase tracking-widest">{event.date}</p>
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>{event.name}</h3>
                   <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isDark ? "#8a8a8a" : "#6b5e54" }}>{event.location}</p>
                </div>
                
                <p className="text-[10px] font-bold leading-relaxed uppercase tracking-wide line-clamp-2" style={{ color: isDark ? "#a1a1a1" : "#5b5048" }}>
                   {event.description}
                </p>

                <div className="pt-6 flex justify-between items-center" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)" }}>
                   <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--foreground)" }}>Launch Mission</span>
                   <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
             </div>
          </Link>
        ))}

        {/* Future Slots */}
        <div
          className="nm-inset border-dashed border-2 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center opacity-30"
          style={{ borderColor: isDark ? "#111111" : "rgba(0,0,0,0.12)" }}
        >
           <span className="material-symbols-outlined text-4xl mb-4">add_circle</span>
           <p className="text-[9px] font-black uppercase tracking-widest">Future Deployment Slots Open</p>
        </div>
      </div>
    </div>
  );
}
