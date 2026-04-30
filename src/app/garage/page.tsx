"use client";

import { useState } from "react";

const SERVICES = [
  { id: "diagnostics", name: "Computer Diagnostics", price: "KES 2,500", icon: "terminal" },
  { id: "maintenance", name: "Full Service Maintenance", price: "KES 12,000", icon: "build" },
  { id: "suspension", name: "Suspension Overhaul", price: "KES 8,500", icon: "settings_input_component" },
  { id: "detailing", name: "Premium Detailing", price: "KES 5,000", icon: "auto_fix_high" },
];

export default function GarageService() {
  const [selectedService, setSelectedService] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate booking
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Service booking request sent! Our team will call you shortly.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-24">
      {/* Hero */}
      <div className="bg-[#0A0A0A] text-white pt-32 pb-24 px-8 text-center">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Carflex <span className="text-primary">Garage</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Precision Service for High-Performance Assets.</p>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Service Grid */}
        <div className="lg:col-span-2 space-y-12">
          <h2 className="text-3xl font-black uppercase tracking-tight">Select Service Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-8 border-2 text-left transition-all ${
                  selectedService === service.id 
                    ? "border-primary bg-zinc-50" 
                    : "border-[#0A0A0A] hover:bg-zinc-50"
                }`}
              >
                <span className="material-symbols-outlined text-4xl mb-4 text-[#0A0A0A]">{service.icon}</span>
                <h3 className="text-xl font-black uppercase mb-1">{service.name}</h3>
                <p className="text-primary font-bold">{service.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Booking Panel */}
        <div className="space-y-8">
          <form onSubmit={handleBook} className="bg-white border-4 border-[#0A0A0A] p-10 shadow-[20px_20px_0px_#0A0A0A]">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Book Appointment</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Scheduled Date</label>
                <input
                  required
                  type="date"
                  className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-primary"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone Number</label>
                <input
                  required
                  type="tel"
                  placeholder="0712345678"
                  className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <button
                disabled={isSubmitting || !selectedService}
                className="w-full bg-[#0A0A0A] text-white py-5 font-black uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>

          <div className="p-8 bg-zinc-50 border-2 border-dashed border-zinc-200">
            <h4 className="font-black uppercase text-xs mb-4">Why Carflex Service?</h4>
            <ul className="space-y-3 text-sm font-medium text-zinc-500">
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                Certified Master Technicians
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                Genuine OEM Spare Parts
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                Real-Time Job Tracking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
