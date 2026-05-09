"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import VehicleQRModal from "@/components/VehicleQRModal";
import { useState, useEffect } from "react";

interface Vehicle {
  id: string;
  ticketId?: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  ownerName?: string;
  ownerPhone?: string;
  zoneName?: string;
  amountPaid?: number;
  owner?: { name: string; phone?: string };
  zone?: { name: string; price: number };
  price?: number;
  createdAt?: string;
}

export default function GateDashboard() {
  const [pending, setPending] = useState<Vehicle[]>([]);
  const [approved, setApproved] = useState<Vehicle[]>([]);
  const [recentTickets, setRecentTickets] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [qrModal, setQrModal] = useState({ isOpen: false, vehicle: null as Vehicle | null });

  useEffect(() => {
    const syncEvent = () => setActiveEvent(localStorage.getItem("carflex_staff_event") || "");
    syncEvent();
    window.addEventListener("staffeventchange", syncEvent);
    fetchData();
    return () => window.removeEventListener("staffeventchange", syncEvent);
  }, [activeEvent]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const qs = activeEvent ? `?eventName=${encodeURIComponent(activeEvent)}` : "";
      
      // Fetch pending vehicles
      const pendingRes = await fetch(`/api/vehicles/pending${qs}`);
      const pendingData = await pendingRes.json();
      if (Array.isArray(pendingData)) {
        setPending(pendingData);
      }

      // Fetch approved vehicles
      const approvedRes = await fetch(`/api/vehicles/approved${qs}`);
      const approvedData = await approvedRes.json();
      if (Array.isArray(approvedData)) {
        setApproved(approvedData);
      }

      const manifestRes = await fetch(`/api/gate/manifest?status=active${qs}`);
      const manifestData = await manifestRes.json();
      if (Array.isArray(manifestData)) {
        setRecentTickets(manifestData.slice(0, 6));
        if (pendingData.length === 0) {
          setPending(manifestData);
        }
      } else {
        setRecentTickets([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/vehicles/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowQR = (vehicle: Vehicle) => {
    const transformedVehicle = {
      ...vehicle,
      ownerName: vehicle.ownerName || vehicle.owner?.name || "INDIVIDUAL_OWNER",
      ownerPhone: vehicle.ownerPhone || vehicle.owner?.phone || "",
      zoneName: vehicle.zoneName || vehicle.zone?.name || "UNASSIGNED",
      amountPaid: vehicle.amountPaid || 0
    };
    setQrModal({ isOpen: true, vehicle: transformedVehicle as any });
  };

  return (
    <StaffLayout>
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col gap-3 md:gap-4 max-w-4xl">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
            Active Event: {activeEvent || "None selected"}
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(230,0,0,0.35)]" />
            Gate Verification • Pending: {pending.length} • Approved: {approved.length}
          </div>
          <h1 className="max-w-[10ch] text-[2.8rem] font-black uppercase tracking-tighter leading-[0.9] sm:text-5xl md:text-6xl">
            GATE <br /> <span className="text-stroke italic text-primary">MANIFEST.</span>
          </h1>
          <p className="max-w-[42ch] text-[9px] font-bold uppercase tracking-widest leading-relaxed text-zinc-500 md:text-[10px]">
            Authorizing asset entry and verifying operational clearance.
          </p>
        </div>

        <div className="nm-card p-6 sm:p-8 md:p-10 space-y-4 border border-primary/10">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Recent Registration Tickets
            </h3>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">
              Live Feed
            </span>
          </div>
          <div className="space-y-3">
            {recentTickets.length === 0 ? (
              <div className="nm-inset p-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                No recent tickets yet.
              </div>
            ) : (
              recentTickets.map((ticket) => (
                <div key={ticket.ticketId || ticket.id} className="nm-inset p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      {ticket.ownerName || "INDIVIDUAL_OWNER"}
                    </p>
                    <p className="text-sm font-black text-foreground break-words">
                      {ticket.ticketId || ticket.regNumber}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                      {ticket.zoneName || "UNASSIGNED"}
                    </p>
                    <p className="text-[8px] uppercase text-zinc-500 mt-1">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString() : "Recent"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-black uppercase tracking-widest text-[10px] border-b-2 transition-all ${
              activeTab === "pending"
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-foreground"
            }`}
          >
            Pending [{pending.length}]
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-3 font-black uppercase tracking-widest text-[10px] border-b-2 transition-all ${
              activeTab === "approved"
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-foreground"
            }`}
          >
            Approved [{approved.length}]
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr] md:gap-8">
          <div className="nm-card space-y-6 p-6 sm:p-8 md:space-y-8 md:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight sm:text-xl">
                <span className="material-symbols-outlined text-primary">
                  {activeTab === "pending" ? "pending_actions" : "verified_user"}
                </span>
                {activeTab === "pending" ? "Pending Authorization" : "Approved Vehicles"}
              </h3>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
                Live Queue
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="nm-inset p-10 text-center animate-pulse sm:p-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                    Syncing with Mainframe...
                  </p>
                </div>
              ) : activeTab === "pending" && pending.length === 0 ? (
                <div className="nm-inset p-10 text-center sm:p-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">
                    No assets currently in staging.
                  </p>
                </div>
              ) : activeTab === "approved" && approved.length === 0 ? (
                <div className="nm-inset p-10 text-center sm:p-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">
                    No approved vehicles yet.
                  </p>
                </div>
              ) : (
                (activeTab === "pending" ? pending : approved).map((v) => (
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
                          {v.ticketId || v.regNumber}
                        </p>
                        {v.ticketId && (
                          <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-primary">
                            Plate: {v.regNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                      <div className="text-left lg:text-right">
                        <p className="mb-1 text-[9px] font-black uppercase text-zinc-500">
                          Sector Assignment
                        </p>
                        <p className="text-lg font-black uppercase tracking-tight text-foreground sm:text-xl">
                          {v.zone?.name || "UNASSIGNED"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {activeTab === "pending" ? (
                          <button
                            onClick={() => handleVerify(v.id)}
                            className="nm-card w-full border-none bg-primary px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_10px_20px_rgba(230,0,0,0.3)] transition-all hover:scale-[1.02] active:scale-95 sm:w-auto sm:px-8"
                          >
                            Authorize Entry
                          </button>
                        ) : (
                          <button
                            onClick={() => handleShowQR(v)}
                            className="nm-card border-none bg-primary px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_10px_20px_rgba(230,0,0,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-sm">qr_code_2</span>
                            View QR
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="nm-card relative overflow-hidden border-none bg-primary/5 p-6 sm:p-8 md:p-10">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <span className="material-symbols-outlined text-[160px]">verified_user</span>
              </div>
              <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Gate Summary
              </h3>
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="nm-inset p-4">
                  <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    Pending
                  </p>
                  <p className="text-3xl font-black tracking-tighter text-foreground">
                    {pending.length}
                  </p>
                </div>
                <div className="nm-inset p-4">
                  <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    Approved
                  </p>
                  <p className="text-3xl font-black tracking-tighter text-primary">
                    {approved.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="nm-card space-y-4 p-6 sm:p-8 md:p-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Operator Notes
              </h3>
              <div className="space-y-3">
                <div className="nm-inset p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                    1. Verify plate and owner identity
                  </p>
                </div>
                <div className="nm-inset p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                    2. Confirm zone assignment before approval
                  </p>
                </div>
                <div className="nm-inset p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                    3. Authorize only after payment or clearance
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
