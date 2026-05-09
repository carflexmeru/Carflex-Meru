"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface EventDay {
  id: string;
  date: string;
  day: string;
  capacity: number;
  registered: number;
  status: "available" | "full" | "past";
}

interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  registeredDays: string[];
}

export default function EventRegisterPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [eventDays, setEventDays] = useState<EventDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch vendor's vehicles and event days
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorPhone = sessionStorage.getItem("vendor_phone");
        if (!vendorPhone) {
          setMessage({ type: "error", text: "Please login as a vendor first" });
          setLoading(false);
          return;
        }

        // Fetch vendor's vehicles
        const vehiclesRes = await fetch(`/api/vendor/vehicles?phone=${vendorPhone}`);
        if (vehiclesRes.ok) {
          const vehiclesData = await vehiclesRes.json();
          setVehicles(vehiclesData);
        }

        // Fetch event days (mock data - in production, fetch from API)
        const mockEventDays: EventDay[] = [
          {
            id: "day-1",
            date: "2026-05-03",
            day: "Saturday",
            capacity: 50,
            registered: 32,
            status: "available"
          },
          {
            id: "day-2",
            date: "2026-05-04",
            day: "Sunday",
            capacity: 50,
            registered: 48,
            status: "available"
          },
          {
            id: "day-3",
            date: "2026-05-05",
            day: "Monday",
            capacity: 50,
            registered: 50,
            status: "full"
          }
        ];
        setEventDays(mockEventDays);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ type: "error", text: "Failed to load data" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDayToggle = (dayId: string) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleRegister = async () => {
    if (!selectedVehicle || selectedDays.length === 0) {
      setMessage({ type: "error", text: "Please select a vehicle and at least one day" });
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicle,
          days: selectedDays,
          eventName: "MERU_2026"
        })
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Vehicle registered successfully!" });
        setSelectedVehicle(null);
        setSelectedDays([]);
        // Refresh vehicles
        const vendorPhone = sessionStorage.getItem("vendor_phone");
        if (vendorPhone) {
          const vehiclesRes = await fetch(`/api/vendor/vehicles?phone=${vendorPhone}`);
          if (vehiclesRes.ok) {
            const vehiclesData = await vehiclesRes.json();
            setVehicles(vehiclesData);
          }
        }
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.message || "Registration failed" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({ type: "error", text: "An error occurred during registration" });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-900 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-zinc-900 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-16">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Event Operations</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">
          REGISTER <br className="hidden md:block" /> <span className="text-stroke">VEHICLES.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-6">
          Register your vehicles for the Meru Car Bazaar event across multiple days.
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`nm-card p-6 border-l-4 ${
          message.type === "success"
            ? "bg-green-500/10 border-green-500 text-green-400"
            : "bg-red-500/10 border-red-500 text-red-400"
        }`}>
          <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Vehicle Selection */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5 pb-4">
            Your Vehicles
          </h2>

          {vehicles.length === 0 ? (
            <div className="nm-inset p-12 text-center opacity-50">
              <span className="material-symbols-outlined text-4xl mb-4 block">directions_car</span>
              <p className="text-[10px] font-black uppercase tracking-widest">No vehicles found</p>
              <Link href="/vendor/dashboard" className="text-primary text-[9px] font-black uppercase tracking-widest mt-4 inline-block hover:underline">
                Add a vehicle first
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`nm-card p-6 cursor-pointer transition-all border-2 ${
                    selectedVehicle === vehicle.id
                      ? "border-primary bg-primary/10"
                      : "border-white/10 hover:border-primary/50"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
                      {vehicle.images?.[0] ? (
                        <img src={vehicle.images[0]} alt={vehicle.make} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-zinc-700">directions_car</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-primary text-[9px] font-black uppercase tracking-widest mb-1">{vehicle.year}</p>
                      <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-2">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-2">{vehicle.regNumber}</p>
                      <p className="text-white text-[10px] font-black">KES {vehicle.price?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Day Selection & Registration */}
        <div className="space-y-8">
          <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5 pb-4">
            Select Days
          </h2>

          <div className="space-y-4">
            {eventDays.map((day) => (
              <div
                key={day.id}
                onClick={() => day.status !== "full" && handleDayToggle(day.id)}
                className={`nm-card p-6 cursor-pointer transition-all border-2 ${
                  selectedDays.includes(day.id)
                    ? "border-primary bg-primary/10"
                    : day.status === "full"
                    ? "border-white/5 opacity-50 cursor-not-allowed"
                    : "border-white/10 hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-primary text-[9px] font-black uppercase tracking-widest">{day.day}</p>
                    <p className="text-white text-[10px] font-black">{day.date}</p>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedDays.includes(day.id)
                      ? "border-primary bg-primary"
                      : "border-white/30"
                  }`}>
                    {selectedDays.includes(day.id) && (
                      <span className="material-symbols-outlined text-white text-sm">check</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-zinc-500 font-bold uppercase">
                    {day.registered}/{day.capacity} Registered
                  </span>
                  <span className={`font-black uppercase tracking-widest ${
                    day.status === "full" ? "text-red-400" : "text-green-400"
                  }`}>
                    {day.status === "full" ? "FULL" : "AVAILABLE"}
                  </span>
                </div>
                <div className="mt-3 w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(day.registered / day.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={!selectedVehicle || selectedDays.length === 0 || registering}
            className={`w-full nm-card p-6 font-black uppercase tracking-widest text-[10px] transition-all border-none ${
              !selectedVehicle || selectedDays.length === 0 || registering
                ? "bg-zinc-900 text-zinc-500 cursor-not-allowed opacity-50"
                : "bg-primary text-white hover:scale-105 shadow-[0_10px_30px_rgba(230,0,0,0.3)]"
            }`}
          >
            {registering ? "REGISTERING..." : "REGISTER VEHICLE"}
          </button>

          {/* Summary */}
          {selectedVehicle && selectedDays.length > 0 && (
            <div className="nm-inset p-6 space-y-3">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Registration Summary</p>
              <div className="space-y-2 text-[10px]">
                <p className="text-white">
                  <span className="text-zinc-500">Vehicle:</span> {vehicles.find(v => v.id === selectedVehicle)?.make} {vehicles.find(v => v.id === selectedVehicle)?.model}
                </p>
                <p className="text-white">
                  <span className="text-zinc-500">Days:</span> {selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""}
                </p>
                <p className="text-primary font-black">
                  Total: KES {(selectedDays.length * 5000).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
