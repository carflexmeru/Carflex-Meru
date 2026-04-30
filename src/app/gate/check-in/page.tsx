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
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    plate: "",
    idNumber: "",
    phone: "",
    zone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "pushing" | "waiting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchZones() {
      const res = await fetch("/api/zones");
      const data = await res.json();
      setZones(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, zone: data[0].id }));
      }
    }
    fetchZones();
  }, []);

  const selectedZone = zones.find((z) => z.id === formData.zone);

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // 0. Robust Validation
    if (!formData.plate || !formData.phone || !formData.zone) {
      setErrorMessage("REQUIRED: PLATE, PHONE, AND ZONE MUST BE DEFINED.");
      return;
    }

    console.log("🚀 INITIATING GATE ENTRY:", formData);
    setIsLoading(true);
    setStatus("pushing");
    setErrorMessage("");

    try {
      // 1. Send STK Push
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
      console.log("📡 API RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.error || "STK Push failed");
      }

      // 2. Simulate waiting for PIN entry
      setStatus("waiting");
      
      // 3. Simulate Callback
      setTimeout(async () => {
        try {
          console.log("🔄 SIMULATING MPESA CALLBACK...");
          const callbackRes = await fetch("/api/daraja/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              checkoutRequestId: data.checkoutRequestId,
              regNumber: formData.plate.toUpperCase(),
              zoneId: formData.zone,
              phone: formData.phone,
            }),
          });

          if (callbackRes.ok) {
            console.log("✅ ENTRY GRANTED SUCCESSFULLY");
            setStatus("success");
            setIsLoading(false);
          } else {
            const errData = await callbackRes.json();
            throw new Error(errData.error || "Callback processing failed");
          }
        } catch (callbackError: any) {
          console.error("❌ CALLBACK ERROR:", callbackError);
          setErrorMessage(callbackError.message);
          setStatus("error");
          setIsLoading(false);
        }
      }, 3000);

    } catch (error: any) {
      console.error("❌ SUBMISSION ERROR:", error);
      setErrorMessage(error.message);
      setStatus("error");
      setIsLoading(false);
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
        setFormData({ plate: "", idNumber: "", phone: "", zone: zones[0]?.id || "" });
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
    const res = await fetch("/api/gate/defer-payment");
    if (res.ok) {
      const data = await res.json();
      setWaitlist(data);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  return (
    <AgentLayout
      agentName="Agent 1 (Gate)"
      primaryAction={status === "pushing" ? "SENDING PUSH..." : status === "waiting" ? "WAITING FOR PIN..." : "TRIGGER M-PESA"}
      onAction={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
    >
      <div className="space-y-12 animate-fade-in max-w-5xl mx-auto p-8 pt-12 pb-32">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">FAST-GATE <span className="text-primary italic">CHECK-IN</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Epoch 2: 30-Second Entry Protocol</p>
        </div>

        {status === "success" ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-none p-12 text-center animate-scale-up text-white">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
              <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
            </div>
            <h3 className="text-3xl font-black uppercase mb-2">ENTRY GRANTED</h3>
            <p className="font-bold mb-8">Vehicle {formData.plate.toUpperCase()} registered in {selectedZone?.name}.</p>
            <button 
              onClick={() => {
                setFormData({ plate: "", idNumber: "", phone: "", zone: zones[0]?.id || "" });
                setStatus("idle");
              }}
              className="bg-white text-black px-10 py-4 rounded-none font-black tracking-widest uppercase hover:bg-zinc-200 transition-all"
            >
              NEXT VEHICLE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Registration Details */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl p-8 space-y-6 border border-white/10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Vehicle Identity</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-white text-[10px] font-black uppercase tracking-widest">Plate Number</label>
                    <input
                      required
                      type="text"
                      placeholder="KCX 123A"
                      className="w-full bg-white/5 border border-white/10 p-5 text-white font-mono text-2xl uppercase tracking-[0.2em] focus:border-primary outline-none transition-all placeholder:text-white/10"
                      value={formData.plate}
                      onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white text-[10px] font-black uppercase tracking-widest">ID Number (Owner)</label>
                    <input
                      required
                      type="text"
                      placeholder="12345678"
                      className="w-full bg-white/5 border border-white/10 p-5 text-white font-bold focus:border-primary outline-none transition-all placeholder:text-white/10"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-8 space-y-6 border border-white/10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Payment Target</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-white text-[10px] font-black uppercase tracking-widest">M-Pesa Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="0712345678"
                    className="w-full bg-white/5 border border-white/10 p-5 text-white font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-white/10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* DEFER BUTTON */}
              <button 
                onClick={handleDefer}
                className="w-full border-2 border-white/10 p-5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">schedule</span>
                Defer to Ground Waitlist
              </button>
            </div>

            {/* Zone Selection & Summary */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl p-8 space-y-6 border border-white/10 shadow-2xl">
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Deployment Zone</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, zone: zone.id })}
                      className={`flex justify-between items-center p-6 border-2 transition-all ${
                        formData.zone === zone.id
                          ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(230,0,0,0.2)]"
                          : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/10"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-black text-sm uppercase tracking-tight text-white">{zone.name}</p>
                        <p className="text-[9px] uppercase tracking-widest opacity-50 mt-1">
                          Occupancy: {Math.round((zone.occupancy / zone.capacity) * 100)}%
                        </p>
                      </div>
                      <p className="font-black text-lg text-white">KES {zone.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-primary p-8 space-y-6 text-white shadow-[0_20px_50px_rgba(230,0,0,0.3)] relative overflow-hidden">
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Entry Fee Total</p>
                    <p className="text-5xl font-black tracking-tighter">KES {selectedZone?.price || 0}</p>
                  </div>
                  <div className="text-right">
                    <span className="material-symbols-outlined text-4xl opacity-40">nfc</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-black/40 border border-black/20 p-4 text-white text-[10px] font-black uppercase tracking-widest text-center">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Waitlist Section */}
        {waitlist.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl p-8 border border-white/10">
             <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-primary">group</span>
                Ground Waitlist ({waitlist.length})
             </h3>
             <div className="space-y-4">
                {waitlist.map((item) => (
                  <div key={item.id} className="bg-black/50 p-6 flex justify-between items-center border-l-8 border-primary shadow-2xl">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Waitlist Entry</p>
                        <p className="text-lg font-black text-white">{item.vehicle?.regNumber}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">{item.zone?.name} — Pending KES {item.zone?.price}</p>
                     </div>
                     <button className="bg-white text-black px-6 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                        Resolve Payment
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
