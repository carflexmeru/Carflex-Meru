"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Navigation Registry
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  useEffect(() => {
    const syncTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme !== "light");
    };

    syncTheme();
    window.addEventListener("themechange", syncTheme);

    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("carflex_theme", nextTheme);
    setIsDark(nextTheme === "dark");
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl border-b shadow-sm"
      style={{
        backgroundColor: isDark ? "rgba(10, 10, 10, 0.94)" : "rgba(248, 245, 239, 0.88)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)",
        boxShadow: isDark ? "0 12px 30px rgba(0,0,0,0.28)" : "0 12px 30px rgba(31,26,23,0.08)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Brand Node - Left */}
        <Link href="/" className="flex items-center justify-self-start">
          <img src="/logo.png" alt="CARFLEX" className="h-12 md:h-16 w-auto object-contain" />
        </Link>

        <button
          onClick={toggleTheme}
          className="md:hidden nm-card p-2 rounded-full transition-all border-none flex items-center justify-center justify-self-center"
          style={{
            backgroundColor: isDark ? "#27272a" : "rgba(255,255,255,0.78)",
            color: isDark ? "white" : "#1f1a17",
            boxShadow: isDark ? "0 8px 20px rgba(0,0,0,0.26)" : "0 8px 20px rgba(31,26,23,0.08)",
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-xl">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Strategic Links - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-10 justify-self-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group py-2 ${
                pathname === link.href 
                  ? "text-primary" 
                  : isDark ? "text-zinc-400 hover:text-white" : "text-[#5b5048] hover:text-primary"
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
            className="nm-card px-6 py-2.5 rounded-full flex items-center gap-3 group transition-all border-none"
            style={{
              backgroundColor: isDark ? "#18181b" : "rgba(255,255,255,0.7)",
              color: isDark ? "white" : "#1f1a17",
              boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.30)" : "0 8px 22px rgba(31,26,23,0.08)",
            }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Events</span>
            <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-white animate-pulse"></div>
          </Link>
        </div>

        {/* Right Side - Theme Toggle & Login Button */}
        <div className="flex items-center gap-3 md:gap-4 justify-self-end">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex nm-card p-2 md:p-3 rounded-full transition-all border-none items-center justify-center"
            style={{
              backgroundColor: isDark ? "#27272a" : "rgba(255,255,255,0.78)",
              color: isDark ? "white" : "#1f1a17",
              boxShadow: isDark ? "0 8px 20px rgba(0,0,0,0.26)" : "0 8px 20px rgba(31,26,23,0.08)",
            }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="material-symbols-outlined text-lg md:text-xl">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Login Button - Top Right */}
          <Link 
            href="/vendor/login"
            className="hidden md:inline-flex nm-card px-4 md:px-8 py-2 md:py-3 font-black uppercase tracking-widest text-[8px] md:text-[9px] hover:scale-105 transition-all border-none items-center gap-2 bg-primary"
            style={{
              boxShadow: "0 10px 24px rgba(230,0,0,0.24)",
            }}
          >
            <span className="hidden md:inline">Login</span>
            <span className="material-symbols-outlined text-sm md:text-base">login</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary hover:opacity-80 transition-all"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 px-4 pb-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="nm-card p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isDark ? "rgba(15,15,15,0.96)" : "rgba(248,245,239,0.96)",
              boxShadow: isDark ? "0 18px 40px rgba(0,0,0,0.35)" : "0 18px 40px rgba(31,26,23,0.10)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] transition-all"
                style={{
                  color: pathname === link.href ? "#E60000" : isDark ? "#f5f5f5" : "#1f1a17",
                  backgroundColor: pathname === link.href ? (isDark ? "rgba(230,0,0,0.10)" : "rgba(230,0,0,0.08)") : "transparent",
                }}
              >
                <span>{link.name}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            ))}

            <Link
              href="/events"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] transition-all"
              style={{
                color: isDark ? "#f5f5f5" : "#1f1a17",
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.65)",
              }}
              >
                <span>Events</span>
                <span className="material-symbols-outlined text-sm">event</span>
              </Link>

            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] transition-all"
              style={{
                color: isDark ? "#f5f5f5" : "#1f1a17",
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.65)",
              }}
            >
              <span>Explore Inventory</span>
              <span className="material-symbols-outlined text-sm">directions_car</span>
            </Link>

            <Link
              href="/staff/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] transition-all"
              style={{
                color: isDark ? "#f5f5f5" : "#1f1a17",
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.65)",
              }}
            >
              <span>Staff Login</span>
              <span className="material-symbols-outlined text-sm">terminal</span>
            </Link>

            <Link
              href="/vendor/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] transition-all"
              style={{
                color: "#ffffff",
                backgroundColor: "#E60000",
                boxShadow: "0 12px 24px rgba(230,0,0,0.24)",
              }}
            >
              <span>Login</span>
              <span className="material-symbols-outlined text-sm">login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
