"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegistrationTicketModal from "@/components/RegistrationTicketModal";
import SecurityAlertModal from "@/components/SecurityAlertModal";
import StaffLayout from "@/components/layout/StaffLayout";

interface Zone {
  id: string;
  name: string;
  price: number;
  capacity: number;
  occupancy: number;
}

interface VehicleInfo {
  regNumber: string;
  make: string;
  model: string;
  year: number;
}

interface WaitlistItem {
  id: string;
  vehicle?: {
    regNumber: string;
  };
  zone?: {
    name: string;
    price: number;
  };
}

export default function GateCheckIn() {
  const router = useRouter();
  const [activeEvent, setActiveEvent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("carflex_staff_event") || "meru-10th-2026";
    }
    return "meru-10th-2026";
  });
  const [zones, setZones] = useState<Zone[]>([]);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    plate: "",
    idNumber: "",
    phone: "",
    zone: "",
    name: "",
  });

  // Tactical Memory: Restore from LocalStorage
  const restoreSession = () => {
    const saved = localStorage.getItem("gate_checkin_cache");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  };

  // Tactical Memory: Auto-Save
  useEffect(() => {
    if (formData.plate || formData.phone) {
      localStorage.setItem("gate_checkin_cache", JSON.stringify(formData));
    }
  }, [formData]);

  const [status, setStatus] = useState<"idle" | "pushing" | "waiting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mpesa" | "paybill">("mpesa");
  const [accountNumberOverride, setAccountNumberOverride] = useState("");
  const [paymentProtocol, setPaymentProtocol] = useState<{ paybill: string; accountNumber: string }>({
    paybill: "4575623",
    accountNumber: "",
  });

  // AUTO-SYNC: Ensure Account Number matches Plate Number automatically
  useEffect(() => {
    if (formData.plate) {
      setAccountNumberOverride(formData.plate.toUpperCase());
    }
  }, [formData.plate]);

  // Account number override will be updated in the plate input onChange handler to avoid cascading renders.

  const [ticketModal, setTicketModal] = useState({
    isOpen: false,
    vehicleId: null as string | null,
    vehicleInfo: null as VehicleInfo | null,
  });

  useEffect(() => {
    const syncEvent = () => {
      setActiveEvent(localStorage.getItem("carflex_staff_event") || "");
    };

    window.addEventListener("staffeventchange", syncEvent);

    async function fetchZones() {
      try {
        const res = await fetch("/api/zones");
        const data = await res.json();
        if (Array.isArray(data)) {
          setZones(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, zone: data[0].id }));
          }
        } else {
          setZones([]);
        }
      } catch (err) {
        setZones([]);
      }
    }
    fetchZones();

    return () => window.removeEventListener("staffeventchange", syncEvent);
  }, []);

  useEffect(() => {
    async function fetchPaymentProtocol() {
      try {
        const res = await fetch("/api/admin/finance");
        if (!res.ok) return;
        const data = await res.json();
        setPaymentProtocol(prev => ({
          paybill: data.paymentProtocol?.paybill || prev.paybill,
          accountNumber: data.paymentProtocol?.accountNumber || prev.accountNumber,
        }));
      } catch (err) {
        console.error(err);
      }
    }

    fetchPaymentProtocol();
  }, []);

  const selectedZone = Array.isArray(zones) ? zones.find((z) => z.id === formData.zone) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.plate || !formData.phone || !formData.zone) {
      setErrorMessage("REQUIRED: PLATE, PHONE, AND ZONE MUST BE DEFINED.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    if (paymentMethod === "cash" || paymentMethod === "paybill") {
      setStatus("pushing");
      try {
        const res = await fetch("/api/gate/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            zoneId: formData.zone,
            paymentMethod: paymentMethod,
            paymentStatus: "paid",
            eventName: activeEvent || undefined,
            metadata: paymentMethod === "paybill" ? { accountNumber: accountNumberOverride } : undefined
          }),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.data?.ticketId) {
            router.push(`/gate/ticket/${result.data.ticketId}`);
          } else {
            setErrorMessage(result.warning || "SUBMISSION SUCCESSFUL BUT TICKET GENERATION FAILED. CHECK DATABASE SCHEMA.");
            setStatus("error");
          }
        } else {
          const data = await res.json();
          throw new Error(data.error || "Check-in failed");
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "An error occurred");
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    } else {
      // MPESA FLOW
      setStatus("pushing");
      try {
        const res = await fetch("/api/daraja/stk-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formData.phone,
            amount: selectedZone?.price || 0,
            regNumber: formData.plate.toUpperCase(),
            zoneId: formData.zone,
            idNumber: formData.idNumber,
            eventName: activeEvent || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "STK Push failed");

        setStatus("waiting");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "STK Push failed");
        setStatus("error");
        setIsLoading(false);
      }
    }
  };

  const checkPaymentStatus = async () => {
    if (status !== "waiting") return;
    
    try {
      const res = await fetch(`/api/gate/check-in-status?plate=${formData.plate}`);
      const data = await res.json();
      
      if (data.success) {
        if (data.data?.ticketId) {
          router.push(`/gate/ticket/${data.data.ticketId}`);
        } else {
          setErrorMessage(data.warning || "PAYMENT VERIFIED BUT TICKET NOT FOUND.");
          setStatus("error");
        }
      } else {
        setErrorMessage(data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | number | undefined;
    if (status === "waiting") {
      interval = setInterval(checkPaymentStatus, 3000);
    }
    return () => {
      if (interval) clearInterval(interval as unknown as number);
    };
  }, [status, formData.plate]);

  const handleDefer = async () => {
    if (!formData.plate || !formData.phone || !formData.zone) {
      setErrorMessage("REQUIRED: PLATE, PHONE, AND ZONE MUST BE DEFINED TO DEFER.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/gate/defer-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, eventName: activeEvent || undefined }),
      });

      if (res.ok) {
        setFormData({ plate: "", idNumber: "", phone: "", zone: zones[0]?.id || "", name: "" });
        setStatus("idle");
        fetchWaitlist();
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Deferral failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const fetchWaitlist = async () => {
    try {
      const res = await fetch("/api/gate/defer-payment");
      if (res.ok) {
        const data = await res.json();
        setWaitlist(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setWaitlist([]);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  return (
    <StaffLayout>
      <div className="space-y-16 animate-fade-in max-w-5xl mx-auto py-12 pb-40">
        {/* Page Header */}
        <div className="flex flex-col gap-3 px-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
            Active Event: {activeEvent || "None selected"}
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase leading-none">CHECK-IN <br/> <span className="text-primary italic">TICKET FLOW.</span></h2>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="nm-inset inline-flex items-center gap-2 px-4 py-1.5 w-fit">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]"></span>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Single Vehicle Check-In</span>
            </div>
            
            <button 
              onClick={() => router.push("/gate/fleet")}
              className="nm-card px-6 py-2 text-[10px] font-black text-foreground uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 border-none"
            >
              <span className="material-symbols-outlined text-sm">group_work</span>
              Open Fleet Manifest
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("carflex_staff_event");
                setActiveEvent("");
                window.dispatchEvent(new Event("staffeventchange"));
              }}
              className="nm-card px-6 py-2 text-[10px] font-black text-foreground uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 border-none"
            >
              <span className="material-symbols-outlined text-sm">event_busy</span>
              Clear Event
            </button>

            <button 
              onClick={restoreSession}
              className="nm-card px-6 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 border-none"
            >
              <span className="material-symbols-outlined text-sm">history</span>
              Restore Last Entry
            </button>
          </div>
        </div>

        {status === "success" ? (
          <div className="nm-card p-16 text-center animate-scale-up text-foreground border-green-500/10">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
              <span className="material-symbols-outlined text-white text-5xl">check_circle</span>
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">ENTRY AUTHORIZED</h3>
            <p className="text-zinc-400 font-bold mb-12 uppercase tracking-widest text-xs">Vehicle {formData.plate.toUpperCase()} deployed to {selectedZone?.name}.</p>
            <button 
              onClick={() => {
                setFormData({ plate: "", idNumber: "", phone: "", zone: zones[0]?.id || "", name: "" });
                setStatus("idle");
              }}
              className="nm-card bg-white text-black px-12 py-5 font-black tracking-widest uppercase hover:bg-primary hover:text-white transition-all border-none"
            >
              NEXT SUBJECT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Registration Details */}
            <div className="space-y-8">
              <div className="nm-card p-10 space-y-8 relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-2">
                   <span className="material-symbols-outlined text-primary text-xl">fingerprint</span>
                   <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Vehicle Details</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="flex flex-col gap-3">
                    <label htmlFor="plate-input" className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">Registration Number</label>
                    <div className="nm-inset">
                      <input
                        required
                        id="plate-input"
                        type="text"
                        placeholder="KCX 123A"
                        className="w-full bg-transparent p-6 text-foreground font-mono text-3xl uppercase tracking-[0.3em] focus:text-primary outline-none transition-all placeholder:text-foreground/20 border-none"
                        value={formData.plate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, plate: val });
                          setAccountNumberOverride(val.toUpperCase());
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label htmlFor="name-input" className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">Owner Name</label>
                    <div className="nm-inset">
                      <input
                        required
                        id="name-input"
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full bg-transparent p-6 text-foreground font-bold tracking-[0.1em] focus:text-primary outline-none transition-all placeholder:text-foreground/20 border-none"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label htmlFor="id-input" className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">ID Number</label>
                    <div className="nm-inset">
                      <input
                        required
                        id="id-input"
                        type="text"
                        placeholder="12345678"
                        className="w-full bg-transparent p-6 text-foreground font-bold tracking-[0.1em] focus:text-primary outline-none transition-all placeholder:text-foreground/20 border-none"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="nm-card p-10 space-y-8 relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-2">
                   <span className="material-symbols-outlined text-primary text-xl">payments</span>
                   <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Payment Method</h3>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label htmlFor="payment-method-select" className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">How is this ticket being paid for?</label>
                  <div className="nm-inset p-2 rounded-2xl relative">
                    <select 
                      id="payment-method-select"
                      title="Select Payment Method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as "cash" | "mpesa" | "paybill")}
                      className="w-full bg-transparent p-4 text-foreground font-black text-[10px] uppercase tracking-widest outline-none border-none appearance-none cursor-pointer"
                    >
                      <option value="mpesa" className="bg-zinc-800 text-white">M-Pesa STK Push</option>
                      <option value="cash" className="bg-zinc-800 text-white">Cash Payment</option>
                      <option value="paybill" className="bg-zinc-800 text-white">Manual Paybill</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="material-symbols-outlined text-zinc-500 text-sm">expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <label htmlFor="contact-phone" className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">Primary Contact Number</label>
                    <div className="nm-inset">
                      <input
                        required
                        id="contact-phone"
                        type="tel"
                        placeholder="0712345678"
                        className="w-full bg-transparent p-6 text-foreground font-bold tracking-[0.4em] focus:text-primary outline-none transition-all placeholder:text-foreground/20 border-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {paymentMethod === "mpesa" && (
                  <div className="flex flex-col gap-6 animate-fade-in mt-6">
                    <div className="nm-inset p-6 space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Payment Details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white/5 border border-white/5 p-4">
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Paybill</p>
                          <p className="text-lg font-black tracking-tight text-foreground">{paymentProtocol.paybill || "Not set"}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4">
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Plate Number</p>
                          <p className="text-lg font-black tracking-tight text-foreground">{paymentProtocol.accountNumber || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                    {status === "waiting" ? (
                      <div className="space-y-4">
                        <button
                          onClick={checkPaymentStatus}
                          className="nm-card w-full bg-green-500 text-white py-6 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-none"
                        >
                          VERIFY PAYMENT NOW
                        </button>
                        <div className="nm-inset p-6 flex items-center justify-center gap-4">
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]"></span>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Waiting for payment confirmation...</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                        disabled={isLoading}
                        className="nm-card w-full !bg-primary text-white py-6 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(230,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-none disabled:opacity-50"
                      >
                        {isLoading ? "PROCESSING..." : (status === "pushing" ? "PROCESSING..." : "START PAYMENT")}
                      </button>
                    )}
                  </div>
                )}

                {paymentMethod === "cash" && (
                  <button
                    onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                    disabled={isLoading}
                    className="nm-card w-full bg-white text-black py-6 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all border-none disabled:opacity-50"
                  >
                    {isLoading ? "PROCESSING..." : "CREATE CASH TICKET"}
                  </button>
                )}

                {paymentMethod === "paybill" && (
                  <div className="flex flex-col gap-6 animate-fade-in mt-6">
                    <div className="nm-inset p-6 space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Manual Payment Data</p>
                      <div className="space-y-4">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Paybill Number</p>
                          <p className="text-xl font-black tracking-tight text-primary">{paymentProtocol.paybill || "Not set"}</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <label htmlFor="account-override" className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Account Number (Editable)</label>
                          <input 
                            id="account-override"
                            type="text"
                            value={accountNumberOverride}
                            onChange={(e) => setAccountNumberOverride(e.target.value.toUpperCase())}
                            className="w-full bg-transparent text-xl font-black tracking-tight text-foreground outline-none border-none p-0"
                          />
                        </div>
                      </div>
                      <p className="text-[8px] text-zinc-500 italic uppercase">Verify payment on your phone before authorizing entry.</p>
                    </div>
                    <button
                      onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                      disabled={isLoading}
                      className="nm-card w-full !bg-primary text-white py-6 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(230,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-none disabled:opacity-50"
                    >
                      {isLoading ? "PROCESSING..." : "CREATE PAYBILL TICKET"}
                    </button>
                  </div>
                )}
              </div>

              {/* DEFER BUTTON */}
              <button 
                onClick={handleDefer}
                disabled={isLoading}
                className="nm-card w-full p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 border-none disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">history_toggle_off</span>
                {isLoading ? "PROCESSING..." : "Send to Ground Waitlist"}
              </button>
            </div>

            {/* Zone Selection & Summary */}
            <div className="space-y-8">
              <div className="nm-card p-10 space-y-8">
                <div className="flex items-center gap-4 mb-2">
                   <span className="material-symbols-outlined text-primary text-xl">grid_view</span>
                   <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Deployment Sectors</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {zones.length === 0 ? (
                    <div className="nm-inset p-10 text-center">
                       <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                          [ SYSTEM ERROR: SECTOR DATA MISSING ]
                       </p>
                       <p className="text-[8px] text-zinc-500 mt-2">
                          Synchronize your Supabase Mainframe using the Tactical SQL script.
                       </p>
                    </div>
                  ) : zones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, zone: zone.id })}
                      className={`flex justify-between items-center p-8 transition-all relative overflow-hidden border-none ${
                        formData.zone === zone.id
                          ? "nm-inset text-foreground"
                          : "nm-card opacity-60 hover:opacity-100"
                      }`}
                    >
                      {formData.zone === zone.id && <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_#E60000]"></div>}
                      <div className="text-left">
                        <p className={`font-black text-lg uppercase tracking-tight ${formData.zone === zone.id ? "text-primary" : "text-foreground"}`}>{zone.name}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] opacity-40 mt-1 font-bold">
                          Cap: {zone.occupancy}/{zone.capacity} Units
                        </p>
                      </div>
                      <p className="font-black text-xl text-foreground tracking-tighter">KES {zone.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="nm-card !bg-primary p-12 text-white relative overflow-hidden group border-none">
                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                   <span className="material-symbols-outlined text-[180px]">contactless</span>
                </div>
                
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Final Node Authorization</p>
                  <p className="text-6xl font-black tracking-tighter mb-8">KES {selectedZone?.price || 0}</p>
                  
                  {errorMessage && (
                    <div className="nm-inset bg-black/40 p-4 text-black text-[9px] font-black uppercase tracking-widest text-center">
                      CRITICAL ERROR: {errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Waitlist Section */}
        {waitlist.length > 0 && (
          <div className="nm-card p-10 mt-12">
             <div className="flex items-center gap-4 mb-10">
                <span className="material-symbols-outlined text-primary text-xl">pending</span>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                   Ground Waitlist <span className="text-zinc-600">[{waitlist.length}]</span>
                </h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {waitlist.map((item) => (
                  <div key={item.id} className="nm-inset p-8 flex justify-between items-center group hover:bg-white/5 transition-all">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Deferred Protocol</p>
                        <p className="text-2xl font-black text-foreground tracking-tighter mb-1">{item.vehicle?.regNumber}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.zone?.name} • KES {item.zone?.price}</p>
                     </div>
                     <button className="nm-card bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border-none">
                        Resolve
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}

      <SecurityAlertModal 
        isOpen={showSecurityAlert} 
        onClose={() => setShowSecurityAlert(false)} 
        regNumber={formData.plate} 
      />

      <RegistrationTicketModal
        isOpen={ticketModal.isOpen}
        vehicleId={ticketModal.vehicleId}
        vehicleInfo={ticketModal.vehicleInfo}
        autoGenerate
        onClose={() => setTicketModal({ isOpen: false, vehicleId: null, vehicleInfo: null })}
      />
    </div>
  </StaffLayout>
  );
}
