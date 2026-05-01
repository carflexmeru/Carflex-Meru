"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
  icon: string;
}

interface StaffLayoutProps {
  children: React.ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [agentType, setAgentType] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Load persistence nodes
  useEffect(() => {
    const savedTheme = localStorage.getItem("staff_theme") as "light" | "dark";
    if (savedTheme) setTheme(savedTheme);
    
    const type = localStorage.getItem("carflex_staff_type");
    const name = localStorage.getItem("carflex_staff_name");
    setAgentType(type);
    setAgentName(name);

    if (!type && pathname !== "/staff/login") {
      router.push("/staff/login");
    }
  }, [pathname, router]);

  // Sync theme to local persistence
  useEffect(() => {
    localStorage.setItem("staff_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Navigation Logic based on Agent Type
  const getNavLinks = (): NavLink[] => {
    switch (agentType) {
      case "REGISTRATION_AGENT":
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Check-in", href: "/gate/check-in", icon: "stadium" },
          { label: "Fleet Manifest", href: "/gate/fleet", icon: "group_work" },
          { label: "Waitlist", href: "/staff/registration/waitlist", icon: "pending_actions" },
          { label: "Logs", href: "/staff/registration/logs", icon: "history" },
          { label: "Transactions", href: "/staff/registration/transactions", icon: "payments" },
        ];
      case "GATE_VERIFICATION_AGENT":
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Gate Command", href: "/staff/gate", icon: "verified_user" },
          { label: "Ground Intel", href: "/staff/ground", icon: "location_searching" },
          { label: "Logs", href: "/staff/gate/logs", icon: "history" },
          { label: "Transactions", href: "/staff/gate/transactions", icon: "receipt_long" },
        ];
      case "GROUND_VERIFICATION_AGENT":
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Ground Intel", href: "/staff/ground", icon: "location_searching" },
          { label: "Security", href: "/staff/security", icon: "security" },
          { label: "Logs", href: "/staff/ground/logs", icon: "history" },
          { label: "Transactions", href: "/staff/ground/transactions", icon: "account_balance_wallet" },
        ];
      default:
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Terminal", href: "/staff/login", icon: "terminal" }
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--background)] flex">
      {/* Desktop Command Rail */}
      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed left-0 top-0 h-full z-50 bg-[var(--sidebar)] border-r border-[var(--glass-border)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hidden md:flex flex-col items-center py-8 ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="mb-12">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)]">
            <span className="material-symbols-outlined text-white text-xl">dataset</span>
          </div>
        </div>

        <nav className="flex-1 w-full space-y-4 px-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                pathname === link.href ? "bg-primary text-white" : "text-zinc-500 hover:bg-[var(--sidebar-hover)] hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className={`font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Theme Toggle Button */}
        <div className="mt-auto px-4 w-full">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-zinc-500 hover:bg-[var(--sidebar-hover)] hover:text-white transition-all group"
          >
            <span className={`material-symbols-outlined transition-transform duration-500 ${theme === 'dark' ? 'rotate-0' : 'rotate-180'}`}>
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
            <span className={`font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all duration-300 ${
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            }`}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          <button 
            onClick={() => {
              localStorage.removeItem("carflex_staff_type");
              router.push("/staff/login");
            }}
            className="w-full flex items-center gap-4 p-3 mt-4 rounded-xl text-primary hover:bg-primary/10 transition-all group"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className={`font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all duration-300 ${
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            }`}>
              Terminate
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Command Header */}
      <header className="md:hidden fixed top-0 left-0 w-full z-40 bg-[var(--sidebar)] border-b border-[var(--glass-border)] p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">dataset</span>
          </div>
          <span className="font-black uppercase tracking-tighter text-sm">STAFF <span className="text-primary italic">TERMINAL</span></span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-white">
          <span className="material-symbols-outlined">{isMobileOpen ? "close" : "menu"}</span>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/90 backdrop-blur-xl pt-24 px-8 flex flex-col gap-8 animate-fade-in">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-6 p-4 rounded-2xl bg-[var(--sidebar-hover)] text-white"
            >
              <span className="material-symbols-outlined text-primary">{link.icon}</span>
              <span className="font-black uppercase tracking-widest text-xs">{link.label}</span>
            </Link>
          ))}
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-6 p-4 rounded-2xl bg-[var(--sidebar-hover)] text-white"
          >
            <span className="material-symbols-outlined text-primary">{theme === "dark" ? "light_mode" : "dark_mode"}</span>
            <span className="font-black uppercase tracking-widest text-xs">{theme === "dark" ? "Frost Mode" : "Obsidian Mode"}</span>
          </button>
        </div>
      )}

      {/* Main Mission Control */}
      <main className={`flex-1 min-h-screen transition-all duration-500 pt-20 md:pt-0 ${
        isExpanded ? "md:ml-64" : "md:ml-20"
      }`}>
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
