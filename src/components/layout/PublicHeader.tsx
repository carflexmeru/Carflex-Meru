"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Bazaar Gallery", href: "/" },
    { name: "Institute", href: "/college" },
    { name: "Garage", href: "/garage" },
    { name: "Imports", href: "/import-tracker" },
  ];

  return (
    <header className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 w-[95%] max-w-7xl px-8 h-20 nm-card border-none flex items-center justify-between ${
      isScrolled ? "bg-black/60 backdrop-blur-xl scale-95" : "bg-black/40 backdrop-blur-md"
    }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black italic text-white shadow-[0_0_15px_#E60000] group-hover:scale-110 transition-transform">CF</div>
          <span className="text-xl font-black uppercase tracking-tighter text-white">Car<span className="text-primary italic">flex.</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`px-6 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded-full ${
                pathname === link.href ? "nm-inset text-primary" : "text-zinc-500 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
           <Link 
            href="/dashboard"
            className="hidden md:block nm-inset px-6 py-2 text-zinc-500 font-black uppercase text-[9px] tracking-widest hover:text-white transition-all"
           >
            Command
           </Link>
           <Link 
            href="/showroom"
            className="nm-card bg-primary text-white px-8 py-2.5 font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-all shadow-[0_10px_20px_rgba(230,0,0,0.3)] border-none"
           >
            Deploy Asset
           </Link>
        </div>
    </header>
  );
}
