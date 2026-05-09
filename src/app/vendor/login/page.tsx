"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VendorLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const theme = document.documentElement.getAttribute("data-theme");
    setIsDark(theme !== "light");
  }, []);

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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative transition-all duration-500"
      style={{
        backgroundColor: isDark ? 'var(--background)' : 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      {/* Background Ambience */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full"
        style={{
          backgroundColor: isDark ? 'rgba(230, 0, 0, 0.2)' : 'rgba(230, 0, 0, 0.1)'
        }}
      ></div>
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full"
        style={{
          backgroundColor: isDark ? 'rgba(230, 0, 0, 0.1)' : 'rgba(230, 0, 0, 0.05)'
        }}
      ></div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none" style={{ color: isDark ? 'white' : '#000000' }}>SELLER <br/> <span className="text-primary italic">COMMAND.</span></h1>
          <p className="font-bold uppercase tracking-[0.3em] text-[10px]" style={{ color: isDark ? '#a1a1a1' : 'rgba(0,0,0,0.7)' }}>Access your bazaar digital storefront.</p>
        </div>

        <div 
          className="nm-card p-10 space-y-8 backdrop-blur-xl"
          style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.45)',
            color: isDark ? 'white' : '#2a2420'
          }}
        >
          <div className="flex items-center gap-4 mb-6">
             <div className="w-1.5 h-6 bg-primary"></div>
             <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: isDark ? '#a1a1a1' : 'rgba(0,0,0,0.7)' }}>Security Verification</h3>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest px-2" style={{ color: isDark ? '#a1a1a1' : 'rgba(0,0,0,0.7)' }}>Registered Phone Number</label>
              <div 
                className="nm-inset"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'
                }}
              >
                <input
                  type="tel"
                  required
                  placeholder="0712345678"
                  className="w-full bg-transparent p-6 font-black uppercase text-xl tracking-tighter outline-none border-none"
                  style={{
                    color: isDark ? 'white' : '#000000',
                    placeholderColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)'
                  }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest px-2" style={{ color: isDark ? '#a1a1a1' : 'rgba(0,0,0,0.7)' }}>Access Code (ID Number)</label>
              <div 
                className="nm-inset"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'
                }}
              >
                <input
                  type="password"
                  required
                  placeholder="ID_NUMBER_REQUIRED"
                  className="w-full bg-transparent p-6 font-black uppercase text-xl tracking-[0.3em] outline-none border-none"
                  style={{
                    color: isDark ? 'white' : '#000000',
                    placeholderColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)'
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div 
                className="nm-inset p-4 text-[10px] font-black uppercase tracking-widest text-center animate-pulse"
                style={{
                  backgroundColor: 'rgba(230, 0, 0, 0.1)',
                  color: '#E60000'
                }}
              >
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
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: isDark ? '#666666' : 'rgba(0,0,0,0.55)' }}>
              Need Assistance? Contact Bazaar Support
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-10 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.8em]" style={{ color: isDark ? '#4a4a4a' : 'rgba(0,0,0,0.6)' }}>CARFLEX OPERATIONAL TERMINAL v2.0</p>
      </div>
    </div>
  );
}
