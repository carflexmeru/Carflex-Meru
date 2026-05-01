"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AssetEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    price: "",
    description: "",
    features: [] as string[],
    newFeature: ""
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vendor/listings/${id}`);
        const data = await res.json();
        setVehicle(data);
        setFormData({
          price: data.price?.toString() || "",
          description: data.description || "",
          features: data.features || [],
          newFeature: ""
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleSave = async (promote: boolean = false) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/vendor/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: promote ? "active" : vehicle.status
        })
      });
      if (res.ok) router.push("/vendor/listings");
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (formData.newFeature && !formData.features.includes(formData.newFeature)) {
      setFormData({
        ...formData,
        features: [...formData.features, formData.newFeature],
        newFeature: ""
      });
    }
  };

  if (loading) return <div className="nm-card h-96 animate-pulse"></div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Asset Forge</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">{vehicle.regNumber} <br/> <span className="text-stroke italic">SPECIFICATION.</span></h1>
        </div>
        <button onClick={() => router.back()} className="nm-card px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border-none">
           CANCEL
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           {/* Basic Details */}
           <div className="nm-card p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Listing Price (KES)</label>
                    <div className="nm-inset">
                       <input 
                         type="number"
                         value={formData.price}
                         onChange={(e) => setFormData({...formData, price: e.target.value})}
                         className="w-full bg-transparent p-6 text-2xl font-black text-foreground outline-none border-none"
                         placeholder="e.g. 4,500,000"
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Asset Condition</label>
                    <div className="nm-inset p-6 text-zinc-400 font-bold uppercase tracking-widest text-xs">
                       {vehicle.isVerified ? "VERIFIED & INSPECTED" : "PENDING INSPECTION"}
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-2">Sales Narrative / Description</label>
                 <div className="nm-inset">
                    <textarea 
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-transparent p-6 text-lg font-bold text-foreground outline-none border-none resize-none"
                      placeholder="Describe the asset's history, condition, and value proposition..."
                    />
                 </div>
              </div>
           </div>

           {/* Feature Tags */}
           <div className="nm-card p-10 space-y-6">
              <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Technological Features</h3>
              <div className="flex flex-wrap gap-3">
                 {formData.features.map((feature, i) => (
                   <div key={i} className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-3 group">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{feature}</span>
                      <button onClick={() => setFormData({...formData, features: formData.features.filter((_, idx) => idx !== i)})} className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="material-symbols-outlined text-xs text-primary">close</span>
                      </button>
                   </div>
                 ))}
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 nm-inset">
                    <input 
                      type="text"
                      value={formData.newFeature}
                      onChange={(e) => setFormData({...formData, newFeature: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      className="w-full bg-transparent p-4 text-sm font-bold text-foreground outline-none border-none"
                      placeholder="e.g. Adaptive Cruise Control"
                    />
                 </div>
                 <button onClick={addFeature} className="nm-card px-6 bg-primary text-white font-black text-xs uppercase border-none">ADD</button>
              </div>
           </div>

           {/* Forensic Image Gallery */}
           <div className="nm-card p-10 space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Visual Asset Gallery</h3>
                 <button className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline">+ ADD NEW CAPTURE</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {vehicle.images?.map((img: string, i: number) => (
                   <div key={i} className="nm-inset aspect-square overflow-hidden rounded-2xl group relative">
                      <img src={img} alt="Asset" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="material-symbols-outlined text-white">delete</span>
                      </div>
                   </div>
                 ))}
                 {(!vehicle.images || vehicle.images.length === 0) && (
                   Array(4).fill(0).map((_, i) => (
                     <div key={i} className="nm-inset aspect-square rounded-2xl flex flex-col items-center justify-center text-zinc-800 border-2 border-dashed border-zinc-900">
                        <span className="material-symbols-outlined mb-2">add_a_photo</span>
                        <span className="text-[7px] font-black uppercase tracking-widest">Empty Slot</span>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
           {/* Asset Identity Card */}
           <div className="nm-card p-8 space-y-6 bg-primary/5 border border-primary/10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                 <span className="material-symbols-outlined text-primary">analytics</span>
              </div>
              <div>
                 <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest">Operational ID</p>
                 <p className="text-xl font-black text-foreground">{vehicle.id.substring(0, 12)}...</p>
              </div>
              <div>
                 <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest">Entry Zone</p>
                 <p className="text-xl font-black text-foreground uppercase tracking-tighter">{vehicle.zone?.name}</p>
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                 <button 
                   onClick={() => handleSave()}
                   disabled={saving}
                   className="w-full nm-inset p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                 >
                   {saving ? "SAVING..." : "SAVE DRAFT"}
                 </button>
                 <button 
                   onClick={() => handleSave(true)}
                   disabled={saving}
                   className="w-full nm-card bg-primary text-white p-5 text-[10px] font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(230,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-none"
                 >
                   {saving ? "PROCESSING..." : "LAUNCH TO MARKETPLACE"}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
