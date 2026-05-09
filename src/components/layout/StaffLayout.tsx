"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [agentType, setAgentType] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<string>("meru-10th-2026");
  const router = useRouter();
  const pathname = usePathname();

  // Initial state load (mount only)
  useEffect(() => {
    const savedTheme = localStorage.getItem("staff_theme") as "light" | "dark";
    if (savedTheme) setTheme(savedTheme);
    
    const type = localStorage.getItem("carflex_staff_type");
    const savedEvent = localStorage.getItem("carflex_staff_event");
    setAgentType(type);
    if (savedEvent) setActiveEvent(savedEvent);
    else localStorage.setItem("carflex_staff_event", "meru-10th-2026");
  }, []);

  // Auth check on route change
  useEffect(() => {
    const type = localStorage.getItem("carflex_staff_type");
    if (!type && pathname !== "/staff/login") {
      router.push("/staff/login");
    }
  }, [pathname, router]);

  // Sync theme to local persistence
  useEffect(() => {
    localStorage.setItem("staff_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("carflex_staff_event", activeEvent);
  }, [activeEvent]);

  useEffect(() => {
    window.dispatchEvent(new Event("staffeventchange"));
  }, [activeEvent]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const exitEvent = () => {
    setActiveEvent("");
    localStorage.removeItem("carflex_staff_event");
    window.dispatchEvent(new Event("staffeventchange"));
  };

  // Navigation Logic based on Agent Type
  const getNavLinks = (): NavLink[] => {
    switch (agentType) {
      case "REGISTRATION_AGENT":
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Check-in", href: "/gate/check-in", icon: "stadium" },
          { label: "Tickets", href: "/staff/registration/tickets", icon: "confirmation_number" },
          { label: "Scanner", href: "/staff/registration/scanner", icon: "qr_code_scanner" },
          { label: "Registered Tickets", href: "/gate/tickets", icon: "confirmation_number" },
          { label: "Fleet Manifest", href: "/gate/fleet", icon: "group_work" },
          { label: "Waitlist", href: "/staff/registration/waitlist", icon: "pending_actions" },
          { label: "Logs", href: "/staff/registration/logs", icon: "history" },
          { label: "Transactions", href: "/staff/registration/transactions", icon: "payments" },
        ];
      case "GATE_VERIFICATION_AGENT":
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Gate Command", href: "/staff/gate", icon: "verified_user" },
          { label: "Scanner", href: "/staff/gate/scanner", icon: "qr_code_scanner" },
          { label: "Ground Intel", href: "/staff/ground", icon: "location_searching" },
          { label: "Logs", href: "/staff/gate/logs", icon: "history" },
          { label: "Transactions", href: "/staff/gate/transactions", icon: "receipt_long" },
        ];
      case "GROUND_VERIFICATION_AGENT":
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Ground Intel", href: "/staff/ground", icon: "location_searching" },
          { label: "Scanner", href: "/staff/ground/scanner", icon: "qr_code_scanner" },
          { label: "Security", href: "/staff/security", icon: "security" },
          { label: "Logs", href: "/staff/ground/logs", icon: "history" },
          { label: "Transactions", href: "/staff/ground/transactions", icon: "account_balance_wallet" },
        ];
      case "EXIT_COMMAND_AGENT":
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Exit Command", href: "/staff/exit", icon: "door_open" },
          { label: "Scanner", href: "/staff/exit/scanner", icon: "qr_code_scanner" },
          { label: "Inside Manifest", href: "/staff/exit/manifest", icon: "format_list_bulleted" },
          { label: "Overtime Reconciliation", href: "/staff/exit/overtime", icon: "history_toggle_off" },
          { label: "Departure Logs", href: "/staff/exit/logs", icon: "history" },
          { label: "Exit Transactions", href: "/staff/exit/transactions", icon: "receipt_long" },
        ];
      default:
        // Path-based fallback for gate staff if agentType isn't loaded yet
        if (pathname.startsWith("/gate")) {
          return [
            { label: "Main Site", href: "/", icon: "home" },
            { label: "Check-in", href: "/gate/check-in", icon: "stadium" },
            { label: "Tickets", href: "/staff/registration/tickets", icon: "confirmation_number" },
            { label: "Scanner", href: "/staff/gate/scanner", icon: "qr_code_scanner" },
            { label: "Registered Tickets", href: "/gate/tickets", icon: "confirmation_number" },
          ];
        }
        return [
          { label: "Main Site", href: "/", icon: "home" },
          { label: "Terminal", href: "/staff/login", icon: "terminal" }
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--background)] flex">
      {/* Desktop Staff Rail */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full z-50 w-20 xl:w-64 bg-[var(--sidebar)] border-r border-[var(--glass-border)] transition-all duration-300 flex-col items-center xl:items-stretch py-8">
        <div className="mb-12 px-4 xl:px-6 flex items-center justify-center xl:justify-start">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
            <Image src="/logo.png" alt="CARFLEX" width={40} height={40} className="w-10 h-auto object-contain" />
          </div>
          <span className="hidden xl:inline ml-3 text-xl font-black uppercase tracking-tighter">
            Staff <span className="text-primary italic">Portal</span>
          </span>
        </div>

        <div className="hidden xl:block px-4 mb-6">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Active Event</p>
          <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)] p-3">
            <select
              aria-label="Active Event"
              value={activeEvent || ""}
              onChange={(e) => setActiveEvent(e.target.value)}
              className="w-full bg-transparent text-[10px] font-black uppercase tracking-widest outline-none text-[var(--foreground)]"
            >
              <option value="">Select Event</option>
              <option value="meru-2026">Meru Car Bazaar</option>
              <option value="meru-10th-2026">Meru Car Bazaar 10th</option>
            </select>
          </div>
        </div>

        <nav className="flex-1 w-full space-y-4 px-3 xl:px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                pathname === link.href ? "bg-primary text-white" : "text-zinc-500 hover:bg-[var(--sidebar-hover)] hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="hidden xl:inline font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-3 xl:px-4 w-full space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-zinc-500 hover:bg-[var(--sidebar-hover)] hover:text-white transition-all group"
          >
            <span className={`material-symbols-outlined transition-transform duration-500 ${theme === "dark" ? "rotate-0" : "rotate-180"}`}>
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
            <span className="hidden xl:inline font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          <button
            onClick={exitEvent}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-primary hover:bg-primary/10 transition-all group"
          >
            <span className="material-symbols-outlined">event_busy</span>
            <span className="hidden xl:inline font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
              Exit Event
            </span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("carflex_staff_type");
              router.push("/staff/login");
            }}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-zinc-500 hover:bg-[var(--sidebar-hover)] hover:text-white transition-all group"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="hidden xl:inline font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Command Header */}
      <header className="md:hidden fixed top-0 left-0 w-full z-40 bg-[var(--sidebar)] border-b border-[var(--glass-border)] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Image src="/logo.png" alt="CARFLEX" width={32} height={32} className="w-8 h-auto object-contain" />
          </div>
          <span className="min-w-0 font-black uppercase tracking-tighter text-[11px] leading-none">
            STAFF <span className="text-primary italic">PORTAL</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="shrink-0 rounded-full bg-[var(--sidebar-hover)] p-2 text-white"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          <span className="material-symbols-outlined">{isMobileOpen ? "close" : "menu"}</span>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-[var(--background)]/95 backdrop-blur-xl pt-24 px-8 flex flex-col gap-8 animate-fade-in">
          <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)] p-4">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Active Event</p>
            <select
              aria-label="Active Event"
              value={activeEvent || ""}
              onChange={(e) => setActiveEvent(e.target.value)}
              className="w-full bg-transparent text-[10px] font-black uppercase tracking-widest outline-none text-[var(--foreground)]"
            >
              <option value="">Select Event</option>
              <option value="meru-2026">Meru Car Bazaar</option>
              <option value="meru-10th-2026">Meru Car Bazaar 10th</option>
            </select>
          </div>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-6 p-4 rounded-2xl bg-[var(--sidebar-hover)] text-foreground border border-[var(--glass-border)]"
            >
              <span className="material-symbols-outlined text-primary">{link.icon}</span>
              <span className="font-black uppercase tracking-widest text-xs">{link.label}</span>
            </Link>
          ))}
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-6 p-4 rounded-2xl bg-[var(--sidebar-hover)] text-foreground border border-[var(--glass-border)]"
          >
            <span className="material-symbols-outlined text-primary">{theme === "dark" ? "light_mode" : "dark_mode"}</span>
            <span className="font-black uppercase tracking-widest text-xs">{theme === "dark" ? "Frost Mode" : "Obsidian Mode"}</span>
          </button>
          <button 
            onClick={exitEvent}
            className="flex items-center gap-6 p-4 rounded-2xl bg-[var(--sidebar-hover)] text-foreground border border-[var(--glass-border)]"
          >
            <span className="material-symbols-outlined text-primary">event_busy</span>
            <span className="font-black uppercase tracking-widest text-xs">Exit Event</span>
          </button>
        </div>
      )}

      {/* Main Mission Control */}
      <main className="flex-1 min-h-screen transition-all duration-500 pt-24 md:pt-0 md:ml-20 xl:ml-64">
        <div className="max-w-[1600px] mx-auto px-4 py-5 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
