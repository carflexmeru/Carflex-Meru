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
  owner?: { name: string };
  zone?: { name: string; price: number };
}

export default function GroundDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState("");
  const [qrModal, setQrModal] = useState({ isOpen: false, vehicle: null as Vehicle | null });

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
            Ground Verification • Total: {vehicles.length}
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">GROUND <br/> <span className="text-stroke italic text-primary">INTEL.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Verifying asset specifications and marking physical verification nodes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="nm-card p-10 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">location_on</span>
                 Approved Assets [{vehicles.length}]
              </h3>
              
              <div className="space-y-4">
                 {loading ? (
                   <div className="nm-inset p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                      Syncing with Mainframe...
                   </div>
                 ) : vehicles.length === 0 ? (
                   <div className="nm-inset p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                      No approved assets in this sector.
                   </div>
                 ) : (
                   vehicles.map((v) => (
                     <div key={v.id} className="nm-inset p-8 space-y-6">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">{v.make} {v.model}</p>
                              <p className="text-3xl font-black text-white tracking-tighter">{v.regNumber}</p>
                           </div>
                           <div className="px-3 py-1 nm-card bg-primary/20 border-none text-[8px] font-black text-primary uppercase">
                              Approved
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="nm-inset p-3 text-center">
                              <p className="text-[8px] font-bold text-zinc-600 uppercase">Zone</p>
                              <p className="text-[10px] font-black text-white">{v.zone?.name || "TBA"}</p>
                           </div>
                           <div className="nm-inset p-3 text-center">
                              <p className="text-[8px] font-bold text-zinc-600 uppercase">Owner</p>
                              <p className="text-[10px] font-black text-white">{v.owner?.name || "N/A"}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleShowQR(v)}
                          className="w-full nm-card bg-primary text-white py-4 font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all border-none flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined">qr_code_2</span>
                          View QR Code
                        </button>
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="space-y-8">
              <div className="nm-card p-10 bg-primary/5 border-none relative overflow-hidden group">
                 <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:-rotate-12 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[150px]">qr_code_scanner</span>
                 </div>
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Ground Summary</h3>
                 <div className="relative z-10">
                    <p className="text-6xl font-black text-white tracking-tighter">{vehicles.length}</p>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Approved Assets</p>
                 </div>
              </div>

              <div className="nm-card p-10 space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Verification Steps</h3>
                 <div className="space-y-3">
                    <div className="nm-inset p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        1. Scan QR code to verify vehicle
                      </p>
                    </div>
                    <div className="nm-inset p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        2. Download ticket for records
                      </p>
                    </div>
                    <div className="nm-inset p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        3. Confirm ground placement
                      </p>
                    </div>
                 </div>
              </div>
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
