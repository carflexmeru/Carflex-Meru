"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLogin() {
  const [type, setType] = useState("REGISTRATION_AGENT");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("carflex_staff_type", type);
        localStorage.setItem("carflex_staff_name", data.agentName);
        router.push(data.redirectPath);
      } else {
        setError("AUTHENTICATION_FAILED: ACCESS DENIED");
      }
    } catch (err) {
      setError("COMMUNICATION_ERROR: LINK SEVERED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Liquid Background */}
      <div className="liquid-bg opacity-30">
        <div className="liquid-blob" style={{ top: '20%', left: '10%' }}></div>
      </div>

      <div className="nm-card w-full max-w-md p-12 relative z-10 animate-fade-in border-none">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_#E60000]">
            <span className="material-symbols-outlined text-white text-3xl">terminal</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">STAFF <br/> <span className="text-primary italic">TERMINAL.</span></h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[8px] mt-4">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Operational Division</label>
            <div className="nm-inset">
              <select 
                className="w-full bg-transparent p-6 text-foreground font-black uppercase text-xl tracking-tighter outline-none cursor-pointer border-none"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="REGISTRATION_AGENT" className="bg-black text-white">REGISTRATION_AGENT</option>
                <option value="GATE_VERIFICATION_AGENT" className="bg-black text-white">GATE_VERIFICATION_AGENT</option>
                <option value="GROUND_VERIFICATION_AGENT" className="bg-black text-white">GROUND_VERIFICATION_AGENT</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Access Frequency Code</label>
            <div className="nm-inset flex items-center pr-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD_REQUIRED"
                className="w-full bg-transparent p-6 text-foreground font-black uppercase text-xl tracking-[0.3em] outline-none placeholder:text-foreground/20 border-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="nm-inset bg-primary/10 p-4 text-primary text-[9px] font-black uppercase tracking-widest text-center animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full nm-card bg-primary text-white py-6 font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-95 transition-all border-none shadow-[0_15px_30px_rgba(230,0,0,0.3)] disabled:opacity-50"
          >
            {loading ? "ESTABLISHING UPLINK..." : "INITIATE ACCESS"}
          </button>
        </form>

        <div className="mt-12 text-center opacity-20">
           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">End-to-End Encryption Active</p>
        </div>
      </div>
    </div>
  );
}
