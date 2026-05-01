"use client";

import { useState, useEffect } from "react";

export default function BuyerMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const phone = sessionStorage.getItem("guest_phone") || sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        const res = await fetch(`/api/vendor/messages?phone=${phone}`);
        const result = await res.json();
        const validatedMessages = Array.isArray(result) ? result : [];
        setMessages(validatedMessages);
        if (validatedMessages.length > 0 && !selectedThread) setSelectedThread(validatedMessages[0]);
      } catch (err) {
        console.error("Messages fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedThread]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply || !selectedThread) return;
    setSending(true);

    try {
      const phone = sessionStorage.getItem("guest_phone") || sessionStorage.getItem("vendor_phone");
      const res = await fetch("/api/vendor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderPhone: phone,
          receiverId: selectedThread.senderId === phone ? selectedThread.receiverId : selectedThread.senderId,
          content: reply,
          vehicleId: selectedThread.vehicleId
        }),
      });

      if (res.ok) {
        setReply("");
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col space-y-8 md:space-y-12 animate-fade-in">
      <div className="flex flex-col gap-2 px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Inquiry Transmission Hub</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">SECURE <br/> <span className="text-stroke italic">COMM-LINK.</span></h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0 relative">
         {/* Threads List */}
         <div className={`lg:col-span-1 nm-card p-6 flex flex-col h-full overflow-hidden ${selectedThread ? 'hidden lg:flex' : 'flex'}`}>
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 px-2">Active Inquiries</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
               {loading ? (
                  Array(5).fill(0).map((_, i) => <div key={i} className="nm-inset h-20 animate-pulse"></div>)
               ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 opacity-20">
                     <span className="material-symbols-outlined text-4xl mb-4">mail_lock</span>
                     <p className="text-[10px] font-black text-center uppercase tracking-widest">No Active Inquiries</p>
                  </div>
               ) : (
                  messages.map((m) => (
                    <button 
                      key={m.id} 
                      onClick={() => setSelectedThread(m)}
                      className={`w-full text-left nm-inset p-4 transition-all hover:bg-white/5 border-none ${selectedThread?.id === m.id ? 'bg-primary/5 shadow-[0_0_15px_rgba(230,0,0,0.1)]' : ''}`}
                    >
                       <div className="flex justify-between items-start mb-1">
                          <p className="text-[8px] font-black text-zinc-500 uppercase">{new Date(m.createdAt).toLocaleDateString()}</p>
                          {selectedThread?.id === m.id && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>}
                       </div>
                       <p className="text-sm font-black text-foreground uppercase tracking-tight truncate">{m.receiver?.name || m.receiver?.phone || 'Seller Node'}</p>
                       <p className="text-[10px] text-zinc-500 truncate mt-1 italic">Re: {m.vehicle?.make} {m.vehicle?.model}</p>
                    </button>
                  ))
               )}
            </div>
         </div>

         {/* Chat Deck */}
         <div className={`lg:col-span-2 nm-card flex flex-col h-full overflow-hidden border-none bg-white/[0.01] ${!selectedThread ? 'hidden lg:flex' : 'flex'}`}>
            {!selectedThread ? (
               <div className="flex-1 flex flex-col items-center justify-center opacity-20 text-center p-10 md:p-20">
                  <span className="material-symbols-outlined text-[100px] mb-6 animate-pulse">chat_bubble_outline</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">Initialize Comm-Node...</p>
               </div>
            ) : (
               <>
                  <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-xl">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedThread(null)} className="lg:hidden nm-card p-3 text-zinc-400"><span className="material-symbols-outlined text-sm">arrow_back</span></button>
                        <div>
                           <p className="text-[10px] font-black text-primary uppercase tracking-widest">Seller Authority</p>
                           <h4 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tighter">{selectedThread.receiver?.name || selectedThread.receiver?.phone}</h4>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
                     <div className="flex flex-col gap-2 max-w-[90%] md:max-w-[80%] ml-auto items-end">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest px-4">My Inquiry</p>
                        <div className="nm-card bg-primary p-5 md:p-6 text-white font-bold text-sm md:text-lg leading-relaxed rounded-tl-3xl rounded-bl-3xl border-none">
                           {selectedThread.content}
                        </div>
                     </div>
                  </div>

                  <form onSubmit={handleSend} className="p-6 md:p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl flex gap-4 md:gap-6">
                     <div className="flex-1 nm-inset">
                        <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type secure transmission..." className="w-full bg-transparent p-4 md:p-6 text-foreground font-bold outline-none border-none text-sm md:text-base" />
                     </div>
                     <button type="submit" disabled={sending} className="nm-card bg-primary text-white px-6 md:px-10 font-black uppercase tracking-widest text-[10px] md:text-xs border-none">
                        {sending ? "..." : "SEND"}
                     </button>
                  </form>
               </>
            )}
         </div>
      </div>
    </div>
  );
}
