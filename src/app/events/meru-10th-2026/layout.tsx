"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Meru10thLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  const eventNav = [
    { name: "Overview", href: "/events/meru-10th-2026" },
    { name: "The Yard", href: "/events/meru-10th-2026/listings" },
    { name: "Exhibitors", href: "/events/meru-10th-2026/exhibitors" },
    { name: "Registrations", href: "/events/meru-10th-2026/registrations" },
    { name: "Tactical Map", href: "/events/meru-10th-2026/map" },
    { name: "Program", href: "/events/meru-10th-2026/schedule" },
  ];

  useEffect(() => {
    const readTheme = () => {
      setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    };

    readTheme();
    window.addEventListener("themechange", readTheme);
    window.addEventListener("storage", readTheme);

    return () => {
      window.removeEventListener("themechange", readTheme);
      window.removeEventListener("storage", readTheme);
    };
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: isDark ? "var(--background)" : "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-5xl">
        <div
          className="backdrop-blur-2xl p-2 rounded-2xl flex items-center justify-between overflow-x-auto transition-colors duration-300"
          style={{
            background: isDark ? "rgba(10,10,10,0.76)" : "rgba(255,255,255,0.86)",
            border: "1px solid var(--glass-border)",
            boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.35)" : "0 18px 40px rgba(17,24,39,0.08)",
          }}
        >
          <div className="flex items-center gap-1 min-w-max">
            {eventNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-3 text-[8px] font-black uppercase tracking-widest transition-all rounded-xl ${
                  pathname === item.href
                    ? "bg-primary text-white shadow-[0_10px_20px_rgba(230,0,0,0.3)]"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 px-4 border-l ml-4" style={{ borderColor: "var(--glass-border)" }}>
            <p className="text-[7px] font-black uppercase tracking-tighter text-primary">ASK MERU SHOWGROUND</p>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>

      <div className="pt-48 pb-20">
        {children}
      </div>
    </div>
  );
}
