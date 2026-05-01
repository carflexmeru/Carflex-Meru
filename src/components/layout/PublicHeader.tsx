"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Navigation Registry
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-black/90 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        {/* Brand Node */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-sm shadow-[0_0_30px_rgba(230,0,0,0.3)] group-hover:scale-110 transition-all">
            <span className="material-symbols-outlined text-white font-black">shield</span>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">CARFLEX</span>
            <span className="text-[8px] font-bold tracking-[0.4em] text-zinc-500 uppercase">Mission_Control</span>
          </div>
        </Link>

        {/* Strategic Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group py-2 ${
                pathname === link.href ? "text-primary" : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-500 ${
                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          ))}
          
          <Link 
            href="/events"
            className="nm-card bg-zinc-900 px-6 py-2.5 rounded-full flex items-center gap-3 group hover:bg-primary transition-all border-none"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Events</span>
            <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-white animate-pulse"></div>
          </Link>
        </div>

        {/* Identity Sentinels */}
        <div className="flex items-center gap-6">
           <button 
             onClick={() => (window as any).toggleRoleModal?.()}
             className="nm-card bg-primary text-white px-8 py-3 font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-all border-none shadow-[0_10px_30px_rgba(230,0,0,0.3)]"
           >
             Login / Guest
           </button>
        </div>
      </nav>
    </header>
  );
}
