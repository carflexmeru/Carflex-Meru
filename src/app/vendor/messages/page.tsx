"use client";

import { useState, useEffect } from "react";

export default function VendorMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const phone = sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        const res = await fetch(`/api/vendor/messages?phone=${phone}`);
        const result = await res.json();
        setMessages(result);
        if (result.length > 0) setSelectedThread(result[0]);
      } catch (err) {
        console.error("Messages fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply) return;
    setSending(true);

    try {
      const phone = sessionStorage.getItem("vendor_phone");
      const res = await fetch("/api/vendor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderPhone: phone,
          receiverId: selectedThread.senderId === phone ? selectedThread.receiverId : selectedThread.senderId,
          content: reply
        }),
      });

      if (res.ok) {
        setReply("");
        // In a real app, we'd refetch or add to state
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col space-y-12">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Secure Comm-Link</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">LEAD <br/> <span className="text-stroke italic">CHANNELS.</span></h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
         {/* Threads List */}
         <div className="lg:col-span-1 nm-card p-6 flex flex-col h-full overflow-hidden">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 px-2">Active Inquiries</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {loading ? (
                  Array(5).fill(0).map((_, i) => <div key={i} className="nm-inset h-20 animate-pulse"></div>)
               ) : messages.length === 0 ? (
                  <p className="text-[10px] font-black text-zinc-700 text-center py-10 uppercase tracking-widest">No Active Communication</p>
               ) : (
                  messages.map((m) => (
                    <button 
                      key={m.id} 
                      onClick={() => setSelectedThread(m)}
                      className={`w-full text-left nm-inset p-4 transition-all hover:bg-white/5 ${selectedThread?.id === m.id ? 'bg-primary/5 border border-primary/20' : ''}`}
                    >
                       <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">{new Date(m.createdAt).toLocaleDateString()}</p>
                       <p className="text-sm font-black text-foreground uppercase tracking-tight">{m.sender?.name || m.sender?.phone}</p>
                       <p className="text-[10px] text-zinc-500 truncate mt-1">{m.content}</p>
                    </button>
                  ))
               )}
            </div>
         </div>

         {/* Chat Deck */}
         <div className="lg:col-span-2 nm-card flex flex-col h-full overflow-hidden border-none bg-white/[0.01]">
            {!selectedThread ? (
               <div className="flex-1 flex flex-col items-center justify-center opacity-20 text-center p-20">
                  <span className="material-symbols-outlined text-[100px] mb-6">chat_bubble_outline</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">Initialize Comms Node...</p>
               </div>
            ) : (
               <>
                  {/* Chat Header */}
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                     <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Subject Identity</p>
                        <h4 className="text-2xl font-black text-foreground uppercase tracking-tighter">{selectedThread.sender?.name || selectedThread.sender?.phone}</h4>
                     </div>
                     <div className="flex gap-4">
                        <button className="nm-card p-4 hover:text-primary transition-all">
                           <span className="material-symbols-outlined text-sm">call</span>
                        </button>
                        <button className="nm-card p-4 hover:text-primary transition-all">
                           <span className="material-symbols-outlined text-sm">more_vert</span>
                        </button>
                     </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-10 space-y-8">
                     <div className="flex flex-col gap-2 max-w-[80%]">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-4">Subject Lead</p>
                        <div className="nm-inset p-6 text-foreground font-bold text-lg leading-relaxed rounded-tr-3xl">
                           {selectedThread.content}
                        </div>
                     </div>

                     {/* Sample Reply to show layout */}
                     <div className="flex flex-col gap-2 max-w-[80%] ml-auto items-end">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest px-4">Vendor Response</p>
                        <div className="nm-card bg-primary p-6 text-white font-bold text-lg leading-relaxed rounded-tl-3xl shadow-[0_15px_30px_rgba(230,0,0,0.2)]">
                           Thank you for your inquiry. The asset is available for inspection at Zone {selectedThread.vehicle?.zone?.name || 'A'}.
                        </div>
                     </div>
                  </div>

                  {/* Input Deck */}
                  <form onSubmit={handleSend} className="p-8 border-t border-white/5 bg-black/20 flex gap-6">
                     <div className="flex-1 nm-inset">
                        <input 
                           type="text"
                           value={reply}
                           onChange={(e) => setReply(e.target.value)}
                           placeholder="Type secure transmission..."
                           className="w-full bg-transparent p-6 text-foreground font-bold outline-none border-none"
                        />
                     </div>
                     <button 
                        type="submit"
                        disabled={sending}
                        className="nm-card bg-primary text-white px-10 font-black uppercase tracking-widest text-xs shadow-[0_15px_30px_rgba(230,0,0,0.3)] hover:scale-105 active:scale-95 transition-all border-none"
                     >
                        {sending ? "SENDING..." : "SEND"}
                     </button>
                  </form>
               </>
            )}
         </div>
      </div>
    </div>
  );
}
