"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MeruEventLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const eventNav = [
    { name: "Overview", href: "/events/meru-2026" },
    { name: "The Yard", href: "/events/meru-2026/listings" },
    { name: "Exhibitors", href: "/events/meru-2026/exhibitors" },
    { name: "Tactical Map", href: "/events/meru-2026/map" },
    { name: "Program", href: "/events/meru-2026/schedule" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Event Specialized Navbar */}
      <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-5xl">
         <div className="nm-card bg-black/40 backdrop-blur-2xl border border-white/5 p-2 rounded-2xl flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
               {eventNav.map((item) => (
                 <Link 
                   key={item.href}
                   href={item.href}
                   className={`px-6 py-3 text-[8px] font-black uppercase tracking-widest transition-all rounded-xl ${
                     pathname === item.href ? "bg-primary text-white shadow-[0_10px_20px_rgba(230,0,0,0.3)]" : "text-zinc-500 hover:text-white"
                   }`}
                 >
                   {item.name}
                 </Link>
               ))}
            </div>
            
            <div className="hidden md:flex items-center gap-4 px-4 border-l border-white/5 ml-4">
               <p className="text-[7px] font-black uppercase tracking-tighter text-primary">ASK MERU SHOWGROUND</p>
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            </div>
         </div>
      </div>

      {/* Main Event Content */}
      <div className="pt-48 pb-20">
         {children}
      </div>
    </div>
  );
}
