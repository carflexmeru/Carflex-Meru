"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StaffLogin() {
  const [type, setType] = useState("REGISTRATION_AGENT");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    syncTheme();
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

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
    } catch {
      setError("COMMUNICATION_ERROR: LINK SEVERED");
    } finally {
      setLoading(false);
    }
  };

  const mutedText = isDark ? "#a1a1a1" : "#6b5e54";
  const fieldBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.74)";
  const fieldBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const fieldText = isDark ? "#f5f5f5" : "#1f1a17";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="liquid-bg opacity-25">
        <div className="liquid-blob" style={{ top: "20%", left: "10%" }} />
        <div className="liquid-blob" style={{ bottom: "10%", right: "8%", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(230,0,0,0.05)" }} />
      </div>

      <div
        className="w-full max-w-lg relative z-10 animate-fade-in"
        style={{
          backgroundColor: isDark ? "rgba(15,15,15,0.92)" : "rgba(248,245,239,0.88)",
          color: "var(--foreground)",
          border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: isDark ? "0 28px 70px rgba(0,0,0,0.35)" : "0 28px 70px rgba(31,26,23,0.12)",
        }}
      >
        <div className="p-12 md:p-14">
          <div className="text-center mb-10 space-y-5">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(230,0,0,0.35)]">
              <span className="material-symbols-outlined text-white text-4xl">terminal</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ color: "var(--foreground)" }}>
                Staff <span className="text-primary italic">Terminal.</span>
              </h1>
              <p className="font-bold uppercase tracking-[0.35em] text-[9px]" style={{ color: mutedText }}>
                Authorized personnel only
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] transition-colors hover:text-primary"
                style={{ color: mutedText }}
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Home
              </Link>

              <button
                type="button"
                onClick={() => {
                  const nextTheme = isDark ? "light" : "dark";
                  document.documentElement.setAttribute("data-theme", nextTheme);
                  localStorage.setItem("carflex_theme", nextTheme);
                  setIsDark(nextTheme === "dark");
                  window.dispatchEvent(new Event("themechange"));
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.35em] transition-all border"
                style={{
                  color: isDark ? "white" : "#1f1a17",
                  backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.70)",
                  borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                }}
              >
                <span className="material-symbols-outlined text-sm">
                  {isDark ? "light_mode" : "dark_mode"}
                </span>
                {isDark ? "Light" : "Dark"}
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest px-2" style={{ color: mutedText }}>
                Operational Division
              </label>
              <div
                className="nm-inset"
                style={{
                  backgroundColor: fieldBg,
                  border: `1px solid ${fieldBorder}`,
                }}
              >
                <select
                  className="w-full bg-transparent p-5 md:p-6 font-black uppercase text-lg md:text-xl tracking-tighter outline-none cursor-pointer border-none"
                  style={{ color: fieldText }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="REGISTRATION_AGENT">REGISTRATION_AGENT</option>
                  <option value="GATE_VERIFICATION_AGENT">GATE_VERIFICATION_AGENT</option>
                  <option value="GROUND_VERIFICATION_AGENT">GROUND_VERIFICATION_AGENT</option>
                  <option value="EXIT_COMMAND_AGENT">EXIT_COMMAND_AGENT</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest px-2" style={{ color: mutedText }}>
                Access Frequency Code
              </label>
              <div
                className="nm-inset flex items-center pr-4 relative"
                style={{
                  backgroundColor: fieldBg,
                  border: `1px solid ${fieldBorder}`,
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD_REQUIRED"
                  className="staff-field w-full bg-transparent p-5 md:p-6 font-black uppercase text-lg md:text-xl tracking-[0.28em] outline-none border-none"
                  style={{ color: fieldText }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: isDark ? "rgba(245,245,245,0.52)" : "rgba(31,26,23,0.55)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E60000")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? "rgba(245,245,245,0.52)" : "rgba(31,26,23,0.55)")}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div
                className="nm-inset p-4 text-[9px] font-black uppercase tracking-widest text-center animate-pulse"
                style={{
                  backgroundColor: "rgba(230,0,0,0.10)",
                  color: "#E60000",
                  border: "1px solid rgba(230,0,0,0.18)",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full nm-card py-6 md:py-7 font-black uppercase tracking-[0.35em] text-xs transition-all border-none hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, #E60000 0%, #c80000 100%)",
                color: isDark ? "#ffffff" : "#ffffff",
                boxShadow: "0 18px 40px rgba(230,0,0,0.28)",
              }}
            >
              {loading ? "ESTABLISHING UPLINK..." : "INITIATE ACCESS"}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t text-center" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}>
            <p className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: mutedText }}>
              End-to-end encryption active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
