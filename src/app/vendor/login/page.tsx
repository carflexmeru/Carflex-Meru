"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/vendor/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Cache identity for onboarding handshake
        sessionStorage.setItem("vendor_phone", phone);
        
        if (!data.onboardingCompleted) {
          router.push("/vendor/onboarding");
        } else {
          router.push("/vendor/dashboard");
        }
      } else {
        setError(data.error || "AUTHORIZATION_DENIED");
      }
    } catch (err) {
      setError("COMMUNICATION_FAILURE: MAIN_FRAME_OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">SELLER <br/> <span className="text-primary italic">COMMAND.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Access your bazaar digital storefront.</p>
        </div>

        <div className="nm-card p-10 space-y-8 backdrop-blur-xl bg-white/[0.02]">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-1.5 h-6 bg-primary"></div>
             <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Security Verification</h3>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Registered Phone Number</label>
              <div className="nm-inset">
                <input
                  type="tel"
                  required
                  placeholder="0712345678"
                  className="w-full bg-transparent p-6 text-white font-black uppercase text-xl tracking-tighter outline-none placeholder:text-zinc-800 border-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Access Code (ID Number)</label>
              <div className="nm-inset">
                <input
                  type="password"
                  required
                  placeholder="ID_NUMBER_REQUIRED"
                  className="w-full bg-transparent p-6 text-white font-black uppercase text-xl tracking-[0.3em] outline-none placeholder:text-zinc-800 border-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="nm-inset bg-primary/10 p-4 text-primary text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full nm-card bg-primary text-white py-8 font-black uppercase tracking-[0.4em] text-xs shadow-[0_20px_50px_rgba(230,0,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all border-none"
            >
              {loading ? "AUTHORIZING..." : "INITIALIZE DASHBOARD"}
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
              Need Assistance? Contact Bazaar Support
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-10 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-800">CARFLEX OPERATIONAL TERMINAL v2.0</p>
      </div>
    </div>
  );
}
