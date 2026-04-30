"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    { icon: "home", href: "/", label: "Home" },
    { icon: "chat_bubble", href: "/inbox", label: "Inbox" },
    { icon: "qr_code_scanner", href: "/gate/check-in", label: "Scan", isFab: true },
    { icon: "garage", href: "/showroom", label: "Garage" },
    { icon: "person", href: "/dashboard", label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-2xl border-t border-white/5 h-20 px-4">
      <div className="flex items-center justify-between h-full max-w-lg mx-auto relative">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          if (tab.isFab) {
            return (
              <Link 
                key={tab.href}
                href={tab.href}
                className="relative -top-10 w-20 h-20 bg-primary border-4 border-black rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(230,0,0,0.4)] animate-bounce-slow"
              >
                <span className="material-symbols-outlined text-4xl">{tab.icon}</span>
              </Link>
            );
          }

          return (
            <Link 
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 group"
            >
              <span className={`material-symbols-outlined text-2xl transition-all duration-300 ${
                isActive ? "text-primary scale-110" : "text-zinc-400 group-active:scale-90"
              }`}>
                {tab.icon}
              </span>
              <span className={`text-[8px] font-black uppercase tracking-widest ${
                isActive ? "text-primary" : "text-zinc-400"
              }`}>
                {tab.label}
              </span>
              {tab.label === "Inbox" && (
                <div className="absolute top-4 right-1/4 w-2 h-2 bg-primary rounded-full animate-pulse border border-white"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
