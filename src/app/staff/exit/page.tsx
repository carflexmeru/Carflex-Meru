"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import VehicleQRModal from "@/components/VehicleQRModal";
import { useState, useEffect } from "react";

interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  owner?: { name: string; phone: string };
  zone?: { name: string; price: number };
}

export default function ExitHubPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState("");
  const [qrModal, setQrModal] = useState({ isOpen: false, vehicle: null as Vehicle | null });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncEvent = () => setActiveEvent(localStorage.getItem("carflex_staff_event") || "");
    syncEvent();
    window.addEventListener("staffeventchange", syncEvent);
    fetchApprovedVehicles();
    return () => window.removeEventListener("staffeventchange", syncEvent);
  }, [activeEvent]);

  const fetchApprovedVehicles = async () => {
    try {
      setLoading(true);
      const qs = activeEvent ? `?eventName=${encodeURIComponent(activeEvent)}` : "";
      const res = await fetch(`/api/vehicles/approved${qs}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setVehicles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = (vehicle: Vehicle) => {
    setQrModal({ isOpen: true, vehicle });
  };

  const filteredVehicles = vehicles.filter(v =>
    v.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.owner?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
            Active Event: {activeEvent || "None selected"}
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(230,0,0,0.35)]" />
            Exit Command • Total: {vehicles.length}
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">EXIT <br/> <span className="text-primary italic">COMMAND.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Final gate clearance and departure authorization.</p>
        </div>

        <div className="nm-card p-10 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight sm:text-xl">
              <span className="material-symbols-outlined text-primary">exit_to_app</span>
              Approved Vehicles [{filteredVehicles.length}]
            </h3>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
              Ready for Exit
            </div>
          </div>

          {/* Search */}
          <div className="nm-inset p-1 flex items-center gap-3 pr-6">
            <div className="p-3 text-zinc-500">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              placeholder="SEARCH PLATE OR OWNER..."
              className="bg-transparent border-none outline-none w-full text-[10px] font-black uppercase tracking-widest py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Vehicles List */}
          <div className="space-y-4">
            {loading ? (
              <div className="nm-inset p-10 text-center animate-pulse sm:p-12">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                  Syncing with Mainframe...
                </p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="nm-inset p-10 text-center sm:p-12">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">
                  No vehicles available for exit.
                </p>
              </div>
            ) : (
              filteredVehicles.map((v) => (
                <div
                  key={v.id}
                  className="nm-inset group flex flex-col gap-5 p-5 transition-all hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-7"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
                    <div className="nm-card flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-lg font-black text-primary sm:h-16 sm:w-16 sm:text-xl">
                      {v.regNumber.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 truncate text-[9px] font-black uppercase text-zinc-500">
                        {v.owner?.name || "INDIVIDUAL_OWNER"}
                      </p>
                      <p className="break-words text-2xl font-black uppercase tracking-tighter text-foreground sm:text-3xl">
                        {v.regNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                    <div className="text-left lg:text-right">
                      <p className="mb-1 text-[9px] font-black uppercase text-zinc-500">
                        Zone
                      </p>
                      <p className="text-lg font-black uppercase tracking-tight text-foreground sm:text-xl">
                        {v.zone?.name || "UNASSIGNED"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleShowQR(v)}
                      className="nm-card border-none bg-primary px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_10px_20px_rgba(230,0,0,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">qr_code_2</span>
                      View QR
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <VehicleQRModal
        isOpen={qrModal.isOpen}
        vehicle={qrModal.vehicle}
        onClose={() => setQrModal({ isOpen: false, vehicle: null })}
      />
    </StaffLayout>
  );
}
