"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DuplicateVehicleModal from "@/components/DuplicateVehicleModal";

export default function MarketplacePage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [duplicateModal, setDuplicateModal] = useState<{
    isOpen: boolean;
    vehicle: any | null;
  }>({ isOpen: false, vehicle: null });
  const [checkingDuplicate, setCheckingDuplicate] = useState<string | null>(null);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");

    syncTheme();
    window.addEventListener("themechange", syncTheme);

    async function fetchVehicles() {
      const res = await fetch("/api/vehicles?status=active");
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
      setLoading(false);
    }
    fetchVehicles();

    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  const handleListVehicle = async (vehicleId: string, regNumber: string) => {
    const vendorPhone = sessionStorage.getItem("vendor_phone");
    if (!vendorPhone) {
      // Redirect to login
      window.location.href = "/vendor/login";
      return;
    }

    setCheckingDuplicate(vehicleId);
    try {
      // Check for duplicates
      const checkRes = await fetch("/api/vehicles/check-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNumber })
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.isDuplicate) {
          // Show duplicate modal
          setDuplicateModal({
            isOpen: true,
            vehicle: checkData.existingVehicle
          });
        } else {
          // Proceed to seller dashboard
          window.location.href = "/vendor/dashboard";
        }
      }
    } catch (error) {
      console.error("Error checking duplicate:", error);
    } finally {
      setCheckingDuplicate(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-16" style={{ color: "var(--foreground)" }}>
      <div className="flex flex-col gap-2">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Global Inventory</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">
          THE <br className="hidden md:block" /> <span className="text-stroke">MARKETPLACE.</span>
        </h1>
        <p className="font-bold uppercase tracking-widest text-[10px] mt-6" style={{ color: isDark ? "#8a8a8a" : "#6b5e54" }}>
          Verified premium assets from authorized vendors across the network.
        </p>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="nm-card group overflow-hidden flex flex-col border-none hover:scale-[1.02] transition-all relative"
              style={{
                backgroundColor: isDark ? "#0f0f0f" : "#f8f5ef",
                boxShadow: isDark ? undefined : "0 18px 30px rgba(31,26,23,0.08)",
              }}
            >
              <Link 
                href={`/vehicles/${v.id}`}
                className="flex-1 flex flex-col"
              >
                <div className="h-64 relative overflow-hidden" style={{ backgroundColor: isDark ? "#121212" : "#ece6da" }}>
                  {v.images?.[0] ? (
                    <img src={v.images[0]} alt={v.make} className="w-full h-full object-cover transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl" style={{ color: isDark ? "#2f2f2f" : "#8a8178" }}>directions_car</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-4 py-1 text-[8px] font-black uppercase tracking-widest text-primary rounded-full" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.75)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
                    Verified
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{v.year}</p>
                    <h3 className="text-2xl font-black uppercase tracking-tighter" style={{ color: "var(--foreground)" }}>{v.make} {v.model}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isDark ? "#8a8a8a" : "#6b5e54" }}>{v.regNumber}</p>
                  </div>
                  
                  <div className="mt-8 pt-6 flex justify-between items-end" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)" }}>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: isDark ? "#737373" : "#7a6e63" }}>Asset Value</p>
                      <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>KES {v.price?.toLocaleString() || "P.O.A"}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </Link>

              {/* List Button */}
              <div className="p-4" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)", backgroundColor: isDark ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.55)" }}>
                <button
                  onClick={() => handleListVehicle(v.id, v.regNumber)}
                  disabled={checkingDuplicate === v.id}
                  className="w-full nm-card p-3 font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:scale-105 transition-all border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingDuplicate === v.id ? "CHECKING..." : "LIST"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Duplicate Vehicle Modal */}
      <DuplicateVehicleModal
        isOpen={duplicateModal.isOpen}
        vehicle={duplicateModal.vehicle}
        onClose={() => setDuplicateModal({ isOpen: false, vehicle: null })}
      />
    </div>
  );
}
