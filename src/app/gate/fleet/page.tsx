"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StaffLayout from "@/components/layout/StaffLayout";

interface Zone {
  id: string;
  name: string;
  price: number;
}

interface FleetVehicle {
  plate: string;
  zoneId: string;
}

export default function FleetIntake() {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [orgData, setOrgData] = useState({ name: "", repName: "", repId: "", repPhone: "" });
  const [fleet, setFleet] = useState<FleetVehicle[]>([{ plate: "", zoneId: "" }]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mpesa">("mpesa");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  // Tactical Memory: Restore from LocalStorage
  const restoreSession = () => {
    const savedOrg = localStorage.getItem("fleet_org_cache");
    const savedFleet = localStorage.getItem("fleet_assets_cache");
    if (savedOrg) setOrgData(JSON.parse(savedOrg));
    if (savedFleet) setFleet(JSON.parse(savedFleet));
  };

  // Tactical Memory: Auto-Save
  useEffect(() => {
    if (orgData.name || fleet[0]?.plate) {
      localStorage.setItem("fleet_org_cache", JSON.stringify(orgData));
      localStorage.setItem("fleet_assets_cache", JSON.stringify(fleet));
    }
  }, [orgData, fleet]);

  useEffect(() => {
    async function fetchZones() {
      const res = await fetch("/api/zones");
      const data = await res.json();
      if (Array.isArray(data)) {
        setZones(data);
        setFleet([{ plate: "", zoneId: data[0]?.id || "" }]);
      }
    }
    fetchZones();
  }, []);

  const addVehicle = () => {
    setFleet([...fleet, { plate: "", zoneId: zones[0]?.id || "" }]);
  };

  const removeVehicle = (index: number) => {
    setFleet(fleet.filter((_, i) => i !== index));
  };

  const updateVehicle = (index: number, field: keyof FleetVehicle, value: string) => {
    const newFleet = [...fleet];
    newFleet[index][field] = value;
    setFleet(newFleet);
  };

  const totalAmount = fleet.reduce((sum, v) => {
    const zone = zones.find(z => z.id === v.zoneId);
    return sum + (zone?.price || 0);
  }, 0);

  const handleSubmit = async () => {
    if (!orgData.name || !orgData.repName || fleet.some(v => !v.plate)) {
      alert("CRITICAL: ALL ORGANIZATION AND VEHICLE FIELDS MUST BE DEFINED.");
      return;
    }

    setIsLoading(true);
    setStatus("processing");

    try {
      // 1. If M-Pesa, initiate STK Push first
      if (paymentMethod === "mpesa") {
        const stkRes = await fetch("/api/daraja/stk-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: orgData.repPhone,
            amount: totalAmount,
            regNumber: `FLEET-${orgData.name.substring(0, 5)}`,
            idNumber: orgData.repId
          }),
        });
        
        const stkData = await stkRes.json();
        if (!stkRes.ok) throw new Error(stkData.error || "STK Push failed");
      }

      // 2. Save Manifest to Database
      const res = await fetch("/api/gate/fleet-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: orgData,
          vehicles: fleet,
          paymentMethod,
          totalAmount
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        throw new Error("Fleet registration failed");
      }
    } catch (err: any) {
      alert(`FLEET ERROR: ${err.message}`);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-12 py-12 max-w-6xl mx-auto pb-40">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">FLEET <br/> <span className="text-primary italic">MANIFEST.</span></h1>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="nm-inset inline-flex items-center gap-2 px-4 py-1.5 w-fit">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]"></span>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Corporate Fleet Mode</span>
            </div>
            
            <button 
              onClick={() => router.push("/gate/check-in")}
              className="nm-card px-6 py-2 text-[10px] font-black text-foreground uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 border-none"
            >
              <span className="material-symbols-outlined text-sm">person</span>
              Switch to Single Entry
            </button>

            <button 
              onClick={restoreSession}
              className="nm-card px-6 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 border-none"
            >
              <span className="material-symbols-outlined text-sm">history</span>
              Reload Last Data
            </button>
          </div>
        </div>

        {status === "success" ? (
          <div className="nm-card p-20 text-center animate-scale-up">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(230,0,0,0.3)]">
               <span className="material-symbols-outlined text-white text-5xl">inventory</span>
            </div>
            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-4">FLEET DEPLOYED</h2>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-12">{fleet.length} vehicles authorized under {orgData.name}.</p>
            <button 
              onClick={() => window.location.reload()}
              className="nm-card bg-white text-black px-12 py-5 font-black tracking-widest uppercase hover:bg-primary hover:text-white transition-all border-none"
            >
              NEW FLEET MANIFEST
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 1. Organization Details */}
            <div className="space-y-8">
              <div className="nm-card p-10 space-y-8">
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">corporate_fare</span>
                  Organization Profile
                </h3>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">Entity Name</label>
                    <div className="nm-inset">
                      <input 
                        type="text" 
                        placeholder="e.g. Toyota Meru"
                        className="w-full bg-transparent p-4 text-foreground font-bold outline-none border-none"
                        value={orgData.name}
                        onChange={(e) => setOrgData({...orgData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">Rep Name</label>
                    <div className="nm-inset">
                      <input 
                        type="text" 
                        className="w-full bg-transparent p-4 text-foreground font-bold outline-none border-none"
                        value={orgData.repName}
                        onChange={(e) => setOrgData({...orgData, repName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">Rep National ID</label>
                    <div className="nm-inset">
                      <input 
                        type="text" 
                        className="w-full bg-transparent p-4 text-foreground font-bold outline-none border-none"
                        value={orgData.repId}
                        onChange={(e) => setOrgData({...orgData, repId: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">Rep Phone Number</label>
                    <div className="nm-inset">
                      <input 
                        type="tel" 
                        placeholder="0712345678"
                        className="w-full bg-transparent p-4 text-foreground font-bold outline-none border-none"
                        value={orgData.repPhone}
                        onChange={(e) => setOrgData({...orgData, repPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="nm-card p-10 space-y-8">
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">payments</span>
                  Consolidated Payment
                </h3>
                <div className="flex gap-4 p-2 nm-inset rounded-2xl">
                  <button
                    onClick={() => setPaymentMethod("mpesa")}
                    className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                      paymentMethod === "mpesa" ? "bg-primary text-white" : "text-zinc-500"
                    }`}
                  >
                    M-Pesa
                  </button>
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                      paymentMethod === "cash" ? "bg-white text-black" : "text-zinc-500"
                    }`}
                  >
                    Cash
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 border-none ${
                    status === "processing" ? "bg-zinc-800 text-zinc-500 cursor-wait" :
                    paymentMethod === "mpesa" ? "bg-primary text-white shadow-[0_10px_30px_rgba(230,0,0,0.3)]" : "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                  }`}
                >
                  {status === "processing" ? "DEPLOYING MANIFEST..." : `AUTHORIZE ${paymentMethod.toUpperCase()} PAYMENT`}
                </button>
              </div>
            </div>

            {/* 2. Vehicle Manifest */}
            <div className="lg:col-span-2 space-y-8">
              <div className="nm-card p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">directions_car</span>
                    Asset Manifest [{fleet.length}]
                  </h3>
                  <button 
                    onClick={addVehicle}
                    className="nm-card px-6 py-2 text-[9px] font-black text-primary hover:bg-primary hover:text-white transition-all border-none"
                  >
                    + ADD ASSET
                  </button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {fleet.map((v, index) => (
                    <div key={index} className="nm-inset p-6 flex flex-wrap md:flex-nowrap gap-6 items-end group animate-fade-in">
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-zinc-500 text-[8px] font-black uppercase">Plate Number</label>
                        <input 
                          type="text"
                          placeholder="KCX 123A"
                          className="bg-transparent border-b border-foreground/10 p-2 text-foreground font-mono text-xl uppercase outline-none focus:border-primary transition-colors"
                          value={v.plate}
                          onChange={(e) => updateVehicle(index, "plate", e.target.value)}
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-zinc-500 text-[8px] font-black uppercase">Sector Assignment</label>
                        <select 
                          className="bg-black/10 border-none p-3 text-foreground text-[10px] font-bold outline-none rounded-lg"
                          value={v.zoneId}
                          onChange={(e) => updateVehicle(index, "zoneId", e.target.value)}
                        >
                          {zones.map(z => (
                            <option key={z.id} value={z.id}>{z.name} - KES {z.price}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => removeVehicle(index)}
                        className="nm-card p-3 text-zinc-600 hover:text-primary transition-all opacity-0 group-hover:opacity-100 border-none"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Aggregate Liability</p>
                    <p className="text-5xl font-black text-foreground tracking-tighter">KES {totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Fleet Size</p>
                    <p className="text-3xl font-black text-primary tracking-tighter">{fleet.length} Units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
