"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const syncTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme !== "light");
    };

    syncTheme();
    window.addEventListener("themechange", syncTheme);

    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  const tabs = [
    { icon: "home", href: "/", label: "Home" },
    { icon: "chat_bubble", href: "/inbox", label: "Inbox" },
    { icon: "qr_code_scanner", href: "/gate/check-in", label: "Scan", isFab: true },
    { icon: "garage", href: "/showroom", label: "Garage" },
    { icon: "person", href: "/dashboard", label: "Profile" },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-2xl border-t h-20 px-4 transition-all duration-500"
      style={{
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex items-center justify-between h-full max-w-lg mx-auto relative">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          if (tab.isFab) {
            return (
              <Link 
                key={tab.href}
                href={tab.href}
                className="relative -top-10 w-20 h-20 bg-primary border-4 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(230,0,0,0.4)] animate-bounce-slow"
                style={{
                  borderColor: isDark ? 'black' : '#f5f1eb'
                }}
              >
                <span className="material-symbols-outlined text-4xl">{tab.icon}</span>
              </Link>
            );
          }

          return (
            <Link 
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 group transition-all duration-300"
              style={{
                color: isActive ? '#E60000' : isDark ? '#a1a1a1' : '#000000'
              }}
            >
              <span className="material-symbols-outlined text-2xl transition-all duration-300" style={{
                color: isActive ? '#E60000' : isDark ? '#a1a1a1' : '#000000',
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }}>
                {tab.icon}
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest">
                {tab.label}
              </span>
              {tab.label === "Inbox" && (
                <div 
                  className="absolute top-4 right-1/4 w-2 h-2 rounded-full animate-pulse border"
                  style={{
                    backgroundColor: '#E60000',
                    borderColor: isDark ? 'white' : '#2a2420'
                  }}
                ></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
