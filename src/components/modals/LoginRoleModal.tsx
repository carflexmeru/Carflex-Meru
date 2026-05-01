"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRoleModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<"viewer" | "vendor" | null>(null);
  const [authMode, setAuthMode] = useState<"initial" | "permanent">("initial");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    idNumber: "",
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    
    // Primary Event Listener
    window.addEventListener('toggle-login-modal', handleToggle);
    
    // Redundant Global Function
    (window as any).toggleRoleModal = handleToggle;

    return () => {
      window.removeEventListener('toggle-login-modal', handleToggle);
      delete (window as any).toggleRoleModal;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (role === "viewer") {
        // Simple guest entry
        sessionStorage.setItem("guest_name", formData.name);
        sessionStorage.setItem("guest_phone", formData.phone);
        setIsOpen(false);
        router.push("/marketplace");
      } else {
        // Vendor login
        const payload = authMode === "initial" 
          ? { phone: formData.phone, password: formData.idNumber }
          : { phone: formData.username, password: formData.password };

        const res = await fetch("/api/vendor/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok) {
          sessionStorage.setItem("vendor_phone", formData.phone || formData.username);
          setIsOpen(false);
          router.push(data.onboardingCompleted ? "/vendor/dashboard" : "/vendor/onboarding");
        } else {
          setError(data.error || "AUTHORIZATION_FAILED");
        }
      }
    } catch (err) {
      setError("COMMUNICATION_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl nm-card p-12 relative overflow-hidden">
        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-all">
          <span className="material-symbols-outlined">close</span>
        </button>

        {!role ? (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Identity Clearance</h3>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic">CHOOSE YOUR <br/> <span className="text-stroke">PROTOCOL.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button 
                onClick={() => setRole("viewer")}
                className="nm-card p-10 flex flex-col items-center gap-6 group hover:bg-white/5 transition-all"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
                  <span className="material-symbols-outlined text-zinc-500 group-hover:text-white text-3xl">visibility</span>
                </div>
                <div className="text-center">
                   <h4 className="text-xl font-black uppercase tracking-tight italic">GUEST VIEWER</h4>
                   <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Explore the Bazaar</p>
                </div>
              </button>

              <button 
                onClick={() => setRole("vendor")}
                className="nm-card p-10 flex flex-col items-center gap-6 group hover:bg-primary transition-all"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-zinc-500 group-hover:text-white text-3xl">storefront</span>
                </div>
                <div className="text-center">
                   <h4 className="text-xl font-black uppercase tracking-tight italic">SELLER VENDOR</h4>
                   <h4 className="text-xl font-black uppercase tracking-tight italic">EXHIBITOR</h4>
                   <p className="text-[9px] font-bold text-zinc-500 group-hover:text-white/50 uppercase tracking-widest mt-2">Manage Storefront</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-10 animate-fade-in">
             <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setRole(null)} className="text-zinc-500 hover:text-white transition-all">
                   <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">{role === "viewer" ? "GUEST_CLEARANCE" : "VENDOR_AUTHORIZATION"}</h3>
             </div>

             {role === "vendor" && (
                <div className="flex nm-inset p-1 rounded-xl">
                   <button 
                    type="button"
                    onClick={() => setAuthMode("initial")}
                    className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${authMode === "initial" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}
                   >
                    First Time Entry
                   </button>
                   <button 
                    type="button"
                    onClick={() => setAuthMode("permanent")}
                    className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${authMode === "permanent" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}
                   >
                    Permanent Account
                   </button>
                </div>
             )}

             <div className="space-y-6">
                {role === "viewer" ? (
                  <>
                    <div className="space-y-2">
                       <label className="text-zinc-500 text-[9px] font-black uppercase px-2 tracking-widest">Full Name</label>
                       <div className="nm-inset">
                          <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent p-5 text-lg font-black uppercase outline-none" placeholder="COMMANDER NAME" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-zinc-500 text-[9px] font-black uppercase px-2 tracking-widest">Phone Number</label>
                       <div className="nm-inset">
                          <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent p-5 text-lg font-black uppercase outline-none" placeholder="07XXXXXXXX" />
                       </div>
                    </div>
                  </>
                ) : (
                  authMode === "initial" ? (
                    <>
                      <div className="space-y-2">
                         <label className="text-zinc-500 text-[9px] font-black uppercase px-2 tracking-widest">Gate-Registered Phone</label>
                         <div className="nm-inset">
                            <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent p-5 text-lg font-black uppercase outline-none" placeholder="07XXXXXXXX" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-zinc-500 text-[9px] font-black uppercase px-2 tracking-widest">Access Code (ID Number)</label>
                         <div className="nm-inset">
                            <input required type="password" value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})} className="w-full bg-transparent p-5 text-lg font-black uppercase outline-none" placeholder="ID_NUMBER" />
                         </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                         <label className="text-zinc-500 text-[9px] font-black uppercase px-2 tracking-widest">Account Username</label>
                         <div className="nm-inset">
                            <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-transparent p-5 text-lg font-black uppercase outline-none" placeholder="USERNAME" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-zinc-500 text-[9px] font-black uppercase px-2 tracking-widest">Security Password</label>
                         <div className="nm-inset">
                            <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-transparent p-5 text-lg font-black uppercase outline-none" placeholder="PASSWORD" />
                         </div>
                      </div>
                    </>
                  )
                )}
             </div>

             {error && <div className="text-primary text-[10px] font-black uppercase tracking-widest text-center animate-pulse">{error}</div>}

             <button 
               type="submit"
               disabled={loading}
               className="w-full nm-card bg-primary text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] shadow-[0_20px_50px_rgba(230,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-none"
             >
               {loading ? "PROCESSING..." : role === "viewer" ? "INITIALIZE GUEST ENTRY" : "AUTHORIZE COMMAND"}
             </button>
          </form>
        )}
      </div>
    </div>
  );
}
