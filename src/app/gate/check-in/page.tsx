"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecurityAlertModal from "@/components/SecurityAlertModal";
import AgentLayout from "@/components/layout/AgentLayout";

interface Zone {
  id: string;
  name: string;
  price: number;
  capacity: number;
  occupancy: number;
}

export default function GateCheckIn() {
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
  const [status, setStatus] = useState<"idle" | "pushing" | "waiting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mpesa">("mpesa");

  useEffect(() => {
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

    if (paymentMethod === "cash") {
      setStatus("pushing");
      try {
        const res = await fetch("/api/gate/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            zoneId: formData.zone,
            paymentMethod: "cash",
            paymentStatus: "paid"
          }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          const data = await res.json();
          throw new Error(data.error || "Cash check-in failed");
        }
      } catch (err: any) {
        setErrorMessage(err.message);
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
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "STK Push failed");

        setStatus("waiting");
        
        // Simulate Callback for Demo/Testing
        setTimeout(async () => {
          try {
            const callbackRes = await fetch("/api/gate/check-in", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...formData,
                zoneId: formData.zone,
                paymentMethod: "mpesa",
                paymentStatus: "paid"
              }),
            });

            if (callbackRes.ok) {
              setStatus("success");
              setIsLoading(false);
            } else {
              throw new Error("Payment verification timed out");
            }
          } catch (callbackError: any) {
            setErrorMessage(callbackError.message);
            setStatus("error");
            setIsLoading(false);
          }
        }, 3000);

      } catch (error: any) {
        setErrorMessage(error.message);
        setStatus("error");
        setIsLoading(false);
      }
    }
  };

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
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ plate: "", idNumber: "", phone: "", zone: zones[0]?.id || "", name: "" });
        setStatus("idle");
        fetchWaitlist();
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [waitlist, setWaitlist] = useState<any[]>([]);
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
    <AgentLayout
      agentName="Agent 1 (Gate)"
      primaryAction={
        status === "pushing" ? "INITIATING UPLINK..." : 
        status === "waiting" ? "WAITING FOR PIN..." : 
        paymentMethod === "cash" ? "AUTHORIZE ENTRY (CASH)" : "INITIATE M-PESA LINK"
      }
      onAction={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
    >
      <div className="space-y-16 animate-fade-in max-w-5xl mx-auto py-12 pb-40">
        {/* Page Header */}
        <div className="flex flex-col gap-3 px-4">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">FAST-GATE <br/> <span className="text-primary italic">PROTOCOL.</span></h2>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="nm-inset inline-flex items-center gap-2 px-4 py-1.5 w-fit">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]"></span>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Single Vehicle Mode</span>
            </div>
            
            <button 
              onClick={() => router.push("/gate/fleet")}
              className="nm-card px-6 py-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 border-none"
            >
              <span className="material-symbols-outlined text-sm">group_work</span>
              Switch to Fleet Manifest
            </button>
          </div>
        </div>

        {status === "success" ? (
          <div className="nm-card p-16 text-center animate-scale-up text-white border-green-500/10">
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
                   <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Subject Identity</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">Plate Identification</label>
                    <div className="nm-inset">
                      <input
                        required
                        type="text"
                        placeholder="KCX 123A"
                        className="w-full bg-transparent p-6 text-white font-mono text-3xl uppercase tracking-[0.3em] focus:text-primary outline-none transition-all placeholder:text-white/5 border-none"
                        value={formData.plate}
                        onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">Official Name (As in ID)</label>
                    <div className="nm-inset">
                      <input
                        required
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full bg-transparent p-6 text-white font-bold tracking-[0.1em] focus:text-primary outline-none transition-all placeholder:text-white/5 border-none"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">National ID Archive</label>
                    <div className="nm-inset">
                      <input
                        required
                        type="text"
                        placeholder="12345678"
                        className="w-full bg-transparent p-6 text-white font-bold tracking-[0.1em] focus:text-primary outline-none transition-all placeholder:text-white/5 border-none"
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
                   <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Financial Node</h3>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">Payment Protocol</label>
                  <div className="flex gap-4 p-2 nm-inset rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mpesa")}
                      className={`flex-1 py-4 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        paymentMethod === "mpesa" ? "bg-primary text-white shadow-[0_0_20px_rgba(230,0,0,0.3)]" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      M-Pesa Push
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex-1 py-4 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        paymentMethod === "cash" ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      Physical Cash
                    </button>
                  </div>
                </div>

                {paymentMethod === "mpesa" && (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-2">M-Pesa Link Number</label>
                    <div className="nm-inset">
                      <input
                        required
                        type="tel"
                        placeholder="0712345678"
                        className="w-full bg-transparent p-6 text-white font-bold tracking-[0.4em] focus:text-primary outline-none transition-all placeholder:text-white/5 border-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* DEFER BUTTON */}
              <button 
                onClick={handleDefer}
                className="nm-card w-full p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 border-none"
              >
                <span className="material-symbols-outlined text-lg">history_toggle_off</span>
                Defer to Ground Waitlist
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
                          ? "nm-inset text-white"
                          : "nm-card opacity-60 hover:opacity-100"
                      }`}
                    >
                      {formData.zone === zone.id && <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_#E60000]"></div>}
                      <div className="text-left">
                        <p className={`font-black text-lg uppercase tracking-tight ${formData.zone === zone.id ? "text-primary" : "text-white"}`}>{zone.name}</p>
                        <p className="text-[9px] uppercase tracking-[0.2em] opacity-40 mt-1 font-bold">
                          Cap: {zone.occupancy}/{zone.capacity} Units
                        </p>
                      </div>
                      <p className="font-black text-xl text-white tracking-tighter">KES {zone.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="nm-card bg-primary p-12 text-white relative overflow-hidden group border-none">
                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                   <span className="material-symbols-outlined text-[180px]">contactless</span>
                </div>
                
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Final Node Authorization</p>
                  <p className="text-6xl font-black tracking-tighter mb-8">KES {selectedZone?.price || 0}</p>
                  
                  {errorMessage && (
                    <div className="nm-inset bg-black/20 p-4 text-white text-[9px] font-black uppercase tracking-widest text-center">
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
                <span className="material-symbols-outlined text-primary text-2xl">pending</span>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                   Ground Waitlist <span className="text-zinc-600">[{waitlist.length}]</span>
                </h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {waitlist.map((item) => (
                  <div key={item.id} className="nm-inset p-8 flex justify-between items-center group hover:bg-white/5 transition-all">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Deferred Protocol</p>
                        <p className="text-2xl font-black text-white tracking-tighter mb-1">{item.vehicle?.regNumber}</p>
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
      </div>
    </AgentLayout>
  );
}
