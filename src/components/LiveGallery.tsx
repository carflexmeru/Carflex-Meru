"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
  isVerified: boolean;
  zone: { name: string } | null;
}

export default function LiveGallery() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    syncTheme();
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setError(null);
        const response = await fetch("/api/vehicles?status=active");
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setVehicles(data);
        } else {
          throw new Error(data.error || "Bazaar Offline");
        }
      } catch (error: any) {
        console.error("Failed to fetch vehicles:", error);
        setError(error.message);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <section className="py-24 px-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center justify-between mb-20 px-4 gap-8 flex-wrap">
        <div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4" style={{ color: "var(--foreground)" }}>
            Live <span className="text-primary italic">Inventory</span>
          </h2>
          <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: isDark ? "#8a8a8a" : "#6b5e54" }}>
            Real-time bazaar data from the Meru Showground mainframe.
          </p>
        </div>
        <div className="nm-inset flex items-center gap-3 px-6 py-3" style={{ backgroundColor: isDark ? undefined : "rgba(255,255,255,0.45)" }}>
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#E60000]" />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: isDark ? "#a1a1a1" : "#6b5e54" }}>
            Live Sync
          </span>
        </div>
      </div>

      {error ? (
        <div className="nm-card p-20 text-center border-primary/20">
          <span className="material-symbols-outlined text-6xl text-primary/40 mb-6">cloud_off</span>
          <p className="text-primary/70 font-black uppercase tracking-widest text-sm mb-6">
            The bazaar mainframe is currently offline
          </p>
          <button
            onClick={() => window.location.reload()}
            className="nm-card bg-primary text-white px-10 py-4 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
          >
            Attempt Re-Connection
          </button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="nm-card p-20 text-center">
          <span className="material-symbols-outlined text-6xl mb-6" style={{ color: isDark ? "#52525b" : "#8a8178" }}>
            no_cars
          </span>
          <p className="font-black uppercase tracking-widest text-sm" style={{ color: isDark ? "#8a8a8a" : "#6b5e54" }}>
            No active assets found in the current cycle.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="nm-card group p-4 hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
              style={{
                backgroundColor: isDark ? undefined : "rgba(255,255,255,0.65)",
              }}
            >
              <div className="aspect-[16/10] nm-inset relative overflow-hidden rounded-[1.5rem] mb-6">
                <img
                  src="/event assets/IMG-20260428-WA0002.jpg"
                  alt="Carflex Asset"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                <div className="absolute top-6 left-6 z-10 flex gap-2">
                  {vehicle.isVerified && (
                    <div
                      className="backdrop-blur-md px-4 py-1.5 rounded-full border flex items-center gap-2"
                      style={{
                        backgroundColor: isDark ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.70)",
                        borderColor: "rgba(34,197,94,0.30)",
                      }}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--foreground)" }}>
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {vehicle.zone && (
                  <div className="absolute top-6 right-6 z-10 nm-card bg-primary/90 px-4 py-1.5 border-none text-[9px] font-black uppercase text-white tracking-widest shadow-[0_5px_15px_rgba(230,0,0,0.3)]">
                    {vehicle.zone.name}
                  </div>
                )}
              </div>

              <div className="px-4 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black leading-tight uppercase tracking-tight" style={{ color: "var(--foreground)" }}>
                      {vehicle.year} {vehicle.make} <br />
                      <span style={{ color: isDark ? "#8a8a8a" : "#6b5e54", fontStyle: "italic" }}>{vehicle.model}</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-black text-2xl tracking-tighter">
                      {(vehicle.price / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: isDark ? "#737373" : "#7a6e63" }}>
                      KES Valuation
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 nm-card px-4 py-4 font-black uppercase text-[9px] tracking-widest transition-all"
                    style={{
                      backgroundColor: isDark ? "rgba(39,39,42,0.55)" : "rgba(255,255,255,0.72)",
                      color: isDark ? "#a1a1a1" : "#1f1a17",
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="w-14 nm-card flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: isDark ? "rgba(39,39,42,0.55)" : "rgba(255,255,255,0.72)",
                      color: isDark ? "#a1a1a1" : "#1f1a17",
                    }}
                  >
                    <span className="material-symbols-outlined text-lg">favorite</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
