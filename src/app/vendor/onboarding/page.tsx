"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessAddress: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("PASSWORD_MISMATCH: Authentication codes must be identical.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const phone = sessionStorage.getItem("vendor_phone");
      const res = await fetch("/api/vendor/auth/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, phone }),
      });

      if (res.ok) {
        router.push("/vendor/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "ONBOARDING_FAILURE");
      }
    } catch (err) {
      setError("COMMUNICATION_FAILURE: MAIN_FRAME_OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-lg space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Mission Profile Initialized</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">SECURE <br/> <span className="text-stroke italic">ONBOARDING.</span></h1>
        </div>

        <div className="nm-card p-10 space-y-10 backdrop-blur-xl bg-white/[0.02]">
           {/* Progress Bar */}
           <div className="flex gap-2 h-1.5">
              <div className={`flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-primary" : "bg-zinc-800"}`}></div>
              <div className={`flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-primary" : "bg-zinc-800"}`}></div>
           </div>

           <form onSubmit={handleComplete} className="space-y-8">
              {step === 1 && (
                <div className="space-y-8 animate-fade-in">
                   <div className="space-y-3">
                      <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Official Trade Email</label>
                      <div className="nm-inset">
                        <input
                          type="email"
                          required
                          placeholder="e.g. sales@diamondmotors.com"
                          className="w-full bg-transparent p-6 text-white font-black text-xl tracking-tighter outline-none placeholder:text-zinc-800 border-none"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Business Headquarters / Address</label>
                      <div className="nm-inset">
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5th Ave, Nairobi, Kenya"
                          className="w-full bg-transparent p-6 text-white font-black text-xl tracking-tighter outline-none placeholder:text-zinc-800 border-none"
                          value={formData.businessAddress}
                          onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                        />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Public Trade Name</label>
                      <div className="nm-inset">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Diamond Motors"
                          className="w-full bg-transparent p-6 text-white font-black text-xl tracking-tighter outline-none placeholder:text-zinc-800 border-none"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Unique Access Username</label>
                      <div className="nm-inset">
                        <input
                          type="text"
                          required
                          placeholder="e.g. diamond_alpha"
                          className="w-full bg-transparent p-6 text-white font-black text-xl tracking-tighter outline-none placeholder:text-zinc-800 border-none"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                        />
                      </div>
                      <p className="text-[8px] font-bold text-zinc-600 px-2">This will be your permanent login ID.</p>
                   </div>
                   <button 
                     type="button"
                     onClick={() => setStep(2)}
                     className="w-full nm-card bg-white text-black py-6 font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all border-none"
                   >
                     CONTINUE TO CREDENTIALS
                   </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                   <div className="space-y-3">
                      <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Set Security Password</label>
                      <div className="nm-inset">
                        <input
                          type="password"
                          required
                          className="w-full bg-transparent p-6 text-white font-black text-xl tracking-[0.3em] outline-none border-none"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Confirm Security Password</label>
                      <div className="nm-inset">
                        <input
                          type="password"
                          required
                          className="w-full bg-transparent p-6 text-white font-black text-xl tracking-[0.3em] outline-none border-none"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                      </div>
                   </div>

                   {error && (
                     <div className="nm-inset bg-primary/10 p-4 text-primary text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                       {error}
                     </div>
                   )}

                   <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="nm-card px-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border-none"
                      >
                        BACK
                      </button>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 nm-card bg-primary text-white py-8 font-black uppercase tracking-[0.4em] text-xs shadow-[0_20px_50px_rgba(230,0,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all border-none"
                      >
                        {loading ? "INITIALIZING..." : "FINALIZE COMMAND DECK"}
                      </button>
                   </div>
                </div>
              )}
           </form>
        </div>
      </div>
    </div>
  );
}
