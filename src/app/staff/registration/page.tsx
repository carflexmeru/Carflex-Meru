"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RegistrationDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [approvedVehicles, setApprovedVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState("meru-10th-2026");

  useEffect(() => {
    const syncEvent = () => setActiveEvent(localStorage.getItem("carflex_staff_event") || "");
    syncEvent();
    window.addEventListener("staffeventchange", syncEvent);
    fetchPendingVehicles();
    fetchApprovedVehicles();
    const interval = setInterval(() => {
      fetchPendingVehicles();
      fetchApprovedVehicles();
    }, 15000);
    return () => {
      window.removeEventListener("staffeventchange", syncEvent);
      clearInterval(interval);
    };
  }, []);

  const fetchPendingVehicles = async () => {
    try {
      setLoading(true);
      const qs = activeEvent ? `?eventName=${encodeURIComponent(activeEvent)}` : "";
      const res = await fetch(`/api/vehicles/pending${qs}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setVehicles(data);
      } else {
        setVehicles([]);
        console.error("API Error:", data.error);
      }
    } catch (err) {
      console.error(err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedVehicles = async () => {
    try {
      const qs = activeEvent ? `?eventName=${encodeURIComponent(activeEvent)}` : "";
      const res = await fetch(`/api/vehicles/approved${qs}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setApprovedVehicles(data);
      } else {
        setApprovedVehicles([]);
      }
    } catch (err) {
      console.error(err);
      setApprovedVehicles([]);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
              Active Event: {activeEvent || "None selected"}
            </div>
            <h1 className="text-[2.7rem] sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.88] text-foreground max-w-[11ch]">
              REGISTRATION <br /> <span className="text-stroke italic">VAULT.</span>
            </h1>
            <p className="max-w-[28ch] text-zinc-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] leading-relaxed">
              Processing new entries into the bazaar mainframe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/events/meru-2026/registrations"
              className="nm-card inline-flex items-center justify-center gap-2 bg-primary px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] border-none"
            >
              <span className="material-symbols-outlined text-sm">confirmation_number</span>
              View Event Registrations
            </Link>
            <Link
              href="/events/meru-2026"
              className="nm-card inline-flex items-center justify-center gap-2 bg-[var(--surface)] px-5 py-4 text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:scale-[1.02] border border-[var(--glass-border)]"
            >
              <span className="material-symbols-outlined text-sm">event</span>
              Open Event Hub
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("carflex_staff_event");
                setActiveEvent("");
                window.dispatchEvent(new Event("staffeventchange"));
              }}
              className="nm-card inline-flex items-center justify-center gap-2 bg-[var(--surface)] px-5 py-4 text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:scale-[1.02] border border-[var(--glass-border)]"
            >
              <span className="material-symbols-outlined text-sm">event_busy</span>
              Exit Event
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           <div className="nm-card p-6 sm:p-8 md:p-10 space-y-6 md:space-y-8">
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">pending_actions</span>
                 Recent Intake Log
              </h3>
              <div className="space-y-3 md:space-y-4">
                 {vehicles.length === 0 ? (
                   <div className="nm-inset p-6 sm:p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                      No pending intakes detected.
                   </div>
                 ) : (
                   vehicles.slice(0, 5).map((v) => (
                     <div key={v.id} className="nm-inset p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                        <div>
                           <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">{v.make} {v.model}</p>
                           <p className="text-lg sm:text-xl font-black text-foreground break-words">{v.regNumber}</p>
                        </div>
                        <div className="text-left sm:text-right">
                           <p className="text-[9px] font-black text-primary uppercase">{v.status}</p>
                           <p className="text-[8px] text-zinc-600 uppercase mt-1">Ready for Sync</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="space-y-6 md:space-y-8">
              <div className="nm-card p-6 sm:p-8 md:p-10 bg-primary/5 border-none relative overflow-hidden group">
                 <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[150px]">verified</span>
                 </div>
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Approved Queue</h3>
                 <div className="relative z-10">
                    <p className="text-5xl sm:text-6xl font-black text-foreground tracking-tighter">{approvedVehicles.length}</p>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Visible to all staff after gate approval</p>
                 </div>
                 <div className="relative z-10 mt-6 space-y-2 max-h-64 overflow-y-auto pr-1">
                    {approvedVehicles.length === 0 ? (
                      <div className="nm-inset p-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        No approved vehicles yet.
                      </div>
                    ) : (
                      approvedVehicles.slice(0, 6).map((vehicle) => (
                        <div key={vehicle.id} className="nm-inset p-4 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                              {vehicle.owner?.name || "INDIVIDUAL_OWNER"}
                            </p>
                            <p className="text-sm font-black text-foreground break-words">{vehicle.regNumber}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                              {vehicle.zone?.name || "UNASSIGNED"}
                            </p>
                            <p className="text-[8px] uppercase text-zinc-500 mt-1">Approved</p>
                          </div>
                        </div>
                      ))
                    )}
                 </div>
              </div>

              <div className="nm-card p-6 sm:p-8 md:p-10 bg-primary/5 border-none relative overflow-hidden group">
                 <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[150px]">inventory_2</span>
                 </div>
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Division Stats</h3>
                 <div className="relative z-10">
                    <p className="text-5xl sm:text-6xl font-black text-foreground tracking-tighter">{vehicles.length}</p>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Active Intake Files</p>
                 </div>
              </div>

              <div className="nm-card p-6 sm:p-8 md:p-10 space-y-5 md:space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Quick Operations</h3>
                 <div className="grid grid-cols-1 gap-4">
                    <button className="nm-inset p-4 sm:p-6 text-left hover:text-primary transition-colors flex justify-between items-center group">
                       <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Generate Daily Report</span>
                       <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    </button>
                    <button className="nm-inset p-4 sm:p-6 text-left hover:text-primary transition-colors flex justify-between items-center group">
                       <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Sync with Ground Units</span>
                       <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">sync</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </StaffLayout>
  );
}
