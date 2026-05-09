"use client";

import { useEffect, useState } from "react";

export default function EventManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "500",
    capacity: "100",
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [eRes, zRes] = await Promise.all([
      fetch("/api/events"),
      fetch("/api/zones")
    ]);
    if (eRes.ok) setEvents(await eRes.json());
    if (zRes.ok) setZones(await zRes.json());
    setLoading(false);
  }

  async function handleCreateEvent() {
    setSaving(true);
    setFormError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          capacity: Number(formData.capacity),
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to create event");
      }

      setShowForm(false);
      setFormData({ name: "", location: "", price: "500", capacity: "100", isActive: true });
      await fetchData();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Event Command</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-foreground">
          EVENT <br /> <span className="text-stroke italic">MANAGER.</span>
        </h1>
        <p className="max-w-2xl text-zinc-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
          Manage live events, zones, and the pricing structure for each bazaar edition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="nm-card bg-[var(--surface)] border border-[var(--glass-border)] p-8 md:p-12">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Bazaar Lifecycle</h3>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-primary text-white px-6 py-3 font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all"
            >
              New Event
            </button>
          </div>

          {showForm && (
            <div className="mb-8 space-y-4 nm-inset p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Event name"
                  className="w-full bg-[var(--surface)] border border-[var(--glass-border)] px-4 py-3 text-foreground outline-none"
                />
                <input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Location"
                  className="w-full bg-[var(--surface)] border border-[var(--glass-border)] px-4 py-3 text-foreground outline-none"
                />
                <input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Base price"
                  className="w-full bg-[var(--surface)] border border-[var(--glass-border)] px-4 py-3 text-foreground outline-none"
                />
                <input
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Capacity"
                  className="w-full bg-[var(--surface)] border border-[var(--glass-border)] px-4 py-3 text-foreground outline-none"
                />
              </div>
              <div className="flex gap-4 items-center">
                <button
                  onClick={handleCreateEvent}
                  disabled={saving}
                  className="bg-primary text-white px-6 py-3 font-black uppercase text-[10px] tracking-widest disabled:opacity-60"
                >
                  {saving ? "Creating..." : "Create Event"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 font-black uppercase text-[10px] tracking-widest text-zinc-500"
                >
                  Cancel
                </button>
              </div>
              {formError && (
                <div className="text-primary text-[10px] font-black uppercase tracking-widest">
                  {formError}
                </div>
              )}
            </div>
          )}

          {events.find((event) => event.id === "meru-10th-2026") && (
            <div className="mb-8 nm-card bg-primary/5 border border-primary/20 p-6">
              {(() => {
                const tenth = events.find((event) => event.id === "meru-10th-2026");
                return (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Featured Event</p>
                        <h4 className="text-2xl font-black uppercase tracking-tight text-foreground">Meru Car Bazaar 10th Edition</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Vehicle count and pricing summary</p>
                      </div>
                      <div className="w-fit px-4 py-1 text-[9px] font-black uppercase tracking-widest bg-primary text-white">
                        Live
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-[var(--surface)] border border-[var(--glass-border)] p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Vehicles</p>
                        <p className="text-3xl font-black text-foreground">{tenth.vehicleCount || 0}</p>
                      </div>
                      <div className="bg-[var(--surface)] border border-[var(--glass-border)] p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Base Entry</p>
                        <p className="text-3xl font-black text-primary">KES 500</p>
                      </div>
                      <div className="bg-[var(--surface)] border border-[var(--glass-border)] p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Zone Pricing</p>
                        <div className="space-y-1">
                          {tenth.zonePrices?.slice(0, 3).map((zone: any) => (
                            <p key={zone.name} className="text-[10px] font-black uppercase tracking-widest text-foreground">
                              {zone.name}: KES {zone.price.toLocaleString()}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="space-y-4">
            {events.map((e) => (
              <div key={e.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 bg-[var(--sidebar)] border border-[var(--glass-border)]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Scheduled Date</p>
                  <p className="font-black uppercase text-foreground">
                    {new Date(e.createdAt || e.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className={`w-fit px-4 py-1 text-[9px] font-black uppercase tracking-widest ${e.isActive ? "bg-green-500/10 text-green-500" : "bg-zinc-500/10 text-zinc-500"}`}>
                    {e.isActive ? "LIVE" : "ARCHIVED"}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    {e.vehicleCount || 0} vehicles
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="nm-card bg-[var(--sidebar)] border border-[var(--glass-border)] p-8 md:p-12 text-foreground">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-10">Zonal Capacity Control</h3>
          <div className="space-y-6">
            {zones.map((z) => (
              <div key={z.id} className="bg-[var(--surface)] p-6 border border-[var(--glass-border)] space-y-5 relative overflow-hidden">
                {z.occupancy >= z.capacity && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest">
                    At Capacity
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Zone Name</p>
                    <h4 className="text-xl font-black uppercase tracking-tight text-foreground">{z.name}</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Entry Fee</p>
                    <p className="text-lg font-black text-primary">KES {z.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    <span>Occupancy Level</span>
                    <span>{z.occupancy} / {z.capacity}</span>
                  </div>
                  <div className="h-2 bg-black/5 dark:bg-white/5 w-full">
                    <div
                      className={`h-full transition-all duration-1000 ${z.occupancy >= z.capacity ? "bg-primary shadow-[0_0_15px_#E60000]" : "bg-primary"}`}
                      style={{ width: `${(z.occupancy / z.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
