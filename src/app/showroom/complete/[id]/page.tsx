"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ListingWizard() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchVehicle() {
      const res = await fetch(`/api/vehicles/${id}`);
      if (res.ok) {
        const data = await res.json();
        setVehicle(data);
        setMake(data.make || "");
        setModel(data.model || "");
        setYear(data.year?.toString() || "");
        setPrice(data.price?.toString() || "");
      }
      setLoading(false);
    }
    fetchVehicle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/vendor/complete-listing`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: id,
          make,
          model,
          year: parseInt(year),
          price: parseFloat(price),
        }),
      });

      if (res.ok) {
        router.push("/showroom");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans">
      <div className="max-w-4xl mx-auto py-24 px-8">
        <div className="mb-16">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Step 2 of 2</p>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Marketplace <span className="text-primary italic">DNA</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Associate technical specs with asset {vehicle?.regNumber}.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Media Section (Mocking for now as per image upload logic) */}
          <section className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-primary"></span>
              Visual Assets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-square bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all group">
                <span className="material-symbols-outlined text-zinc-300 group-hover:text-primary">add_a_photo</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mt-2">Add Photo</span>
              </div>
            </div>
          </section>

          {/* Technical Specs */}
          <section className="space-y-8">
             <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-black"></span>
              Technical Specs
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Manufacturer (Make)</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. TOYOTA"
                  className="bg-zinc-50 border-2 border-zinc-100 p-5 font-bold uppercase outline-none focus:border-primary"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Model Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. LAND CRUISER V8"
                  className="bg-zinc-50 border-2 border-zinc-100 p-5 font-bold uppercase outline-none focus:border-primary"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Manufacturing Year</label>
                <input
                  required
                  type="number"
                  placeholder="2024"
                  className="bg-zinc-50 border-2 border-zinc-100 p-5 font-bold outline-none focus:border-primary"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Listing Price (KES)</label>
                <input
                  required
                  type="number"
                  placeholder="8500000"
                  className="bg-zinc-50 border-2 border-primary/20 p-5 text-2xl font-black outline-none focus:border-primary"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </section>

          <div className="pt-12 border-t-4 border-black">
            <button
              disabled={isSubmitting}
              className="w-full bg-[#0A0A0A] text-white py-6 font-black uppercase tracking-widest text-sm hover:bg-primary transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            >
              {isSubmitting ? "SYNCING TO BAZAAR..." : "PUBLISH TO MARKETPLACE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
