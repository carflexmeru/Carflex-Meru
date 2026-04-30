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
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl" : "bg-black"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary flex items-center justify-center font-black italic text-white transform group-hover:rotate-12 transition-transform">CF</div>
          <span className="text-2xl font-black uppercase tracking-tighter text-white">Car<span className="text-primary italic">flex.</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="relative group text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors py-2"
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${
                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
           <Link 
            href="/dashboard"
            className="hidden md:block px-6 py-2 border-2 border-white text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
           >
            Sign In
           </Link>
           <Link 
            href="/showroom"
            className="bg-primary text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(230,0,0,0.3)]"
           >
            Sell Car
           </Link>
        </div>
      </div>
    </header>
  );
}
