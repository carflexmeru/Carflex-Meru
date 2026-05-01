"use client";

import Link from "next/link";

export default function EventsDirectory() {
  const upcomingEvents = [
    {
      id: "meru-2026",
      name: "MERU CAR BAZAAR",
      location: "ASK Meru Showground",
      date: "May 03, 2026",
      status: "LIVE_RECORDS_ACTIVE",
      image: "/meru_bazaar_hero_1777632277515.png",
      description: "One-day high-intensity exhibition of Kenya's finest automotive assets. Verified vendors and premium inventory."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-24 space-y-16">
      <div className="flex flex-col gap-2">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Tactical Operations</p>
        <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
          BAZAAR <br/> <span className="text-stroke">MISSIONS.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-6">Registry of active and upcoming tactical car bazaar deployments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {upcomingEvents.map((event) => (
          <Link 
            key={event.id}
            href={`/events/${event.id}`}
            className="nm-card group relative h-[550px] overflow-hidden flex flex-col border-none hover:scale-[1.02] transition-all"
          >
             <div className="h-2/3 relative overflow-hidden">
                <img src={event.image} alt={event.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute top-6 right-6 bg-primary text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg">
                   {event.status}
                </div>
             </div>

             <div className="p-8 flex-1 flex flex-col justify-between bg-black">
                <div className="space-y-2">
                   <p className="text-primary text-[9px] font-black uppercase tracking-widest">{event.date}</p>
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">{event.name}</h3>
                   <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{event.location}</p>
                </div>
                
                <p className="text-zinc-400 text-[10px] font-bold leading-relaxed uppercase tracking-wide line-clamp-2">
                   {event.description}
                </p>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                   <span className="text-white text-[9px] font-black uppercase tracking-widest">Launch Mission</span>
                   <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
             </div>
          </Link>
        ))}

        {/* Future Slots */}
        <div className="nm-inset border-dashed border-2 border-zinc-900 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center opacity-30">
           <span className="material-symbols-outlined text-4xl mb-4">add_circle</span>
           <p className="text-[9px] font-black uppercase tracking-widest">Future Deployment Slots Open</p>
        </div>
      </div>
    </div>
  );
}
