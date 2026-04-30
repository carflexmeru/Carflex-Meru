"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import CounterOfferModal from "@/components/CounterOfferModal";
import AcceptOfferModal from "@/components/AcceptOfferModal";
import WithdrawOfferModal from "@/components/WithdrawOfferModal";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: { phone: string; role: string } | null;
}

interface Offer {
  id: string;
  amount: number;
  status: string;
  vehicle: { 
    make: string; 
    model: string; 
    year: number; 
    regNumber: string;
    owner: { phone: string } | null;
  } | null;
  buyer: { id: string; phone: string } | null;
  messages: Message[];
}

export default function ChatRoom() {
  const { id } = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [myPhone, setMyPhone] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, we'd get this from session/cookies
    const storedPhone = localStorage.getItem("carflex_phone") || "";
    setMyPhone(storedPhone);
    fetchOffer();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [offer?.messages]);

  async function fetchOffer() {
    const res = await fetch(`/api/offers/${id}`);
    if (res.ok) {
      const data = await res.json();
      setOffer(data);
    }
    setLoading(false);
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !myPhone) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: id,
          senderPhone: myPhone,
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage("");
        fetchOffer();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;
  if (!offer) return <div className="min-h-screen bg-white flex items-center justify-center text-black">Bargain not found</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Action Header for Vendor */}
      {offer?.vehicle?.owner?.phone === myPhone && offer?.status === 'pending' && (
        <div className="bg-zinc-50 border-b-2 border-black px-12 py-6 flex justify-between items-center">
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Offer Actions</p>
              <p className="font-bold">Deal for {offer.vehicle.regNumber}</p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setShowCounterModal(true)}
                className="px-6 py-2 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all"
              >
                Counter
              </button>
              <button 
                onClick={() => setShowAcceptModal(true)}
                className="bg-green-500 text-white px-6 py-2 font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all"
              >
                Accept & Sold
              </button>
           </div>
        </div>
      )}

      {/* Action Header for Buyer */}
      {offer?.buyer?.phone === myPhone && offer?.status === 'pending' && (
        <div className="bg-zinc-50 border-b-2 border-black px-12 py-6 flex justify-between items-center">
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Offer Controls</p>
              <p className="font-bold">Your proposal for {offer.vehicle?.regNumber}</p>
           </div>
           <button 
            onClick={() => setShowWithdrawModal(true)}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-all underline underline-offset-8"
           >
            Withdraw Offer
           </button>
        </div>
      )}

      {/* Messages */}
      <div className="bg-[#0A0A0A] text-white p-6 shadow-2xl flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">
              {offer.vehicle?.year} {offer.vehicle?.make} {offer.vehicle?.model}
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{offer.vehicle?.regNumber} — KES {offer.amount.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Status</p>
          <p className="text-xs font-bold uppercase tracking-widest">{offer.status}</p>
        </div>
      </div>

      {/* Chat Canvas */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8F8F8]">
        {offer.messages.map((msg) => {
          const isMe = msg.sender?.phone === myPhone;
          const isSeller = msg.sender?.role === "vendor" || msg.sender?.role === "admin";
          
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-6 shadow-xl ${
                isMe 
                  ? "bg-primary text-white" 
                  : "bg-black text-white"
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                <p className={`text-[9px] font-black uppercase tracking-widest mt-2 opacity-50 ${isMe ? "text-white" : "text-zinc-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-6 bg-white border-t-2 border-zinc-100 z-20">
        {!myPhone ? (
          <div className="flex gap-4">
            <input 
              type="tel" 
              placeholder="IDENTIFY YOUR PHONE NUMBER TO CHAT" 
              className="flex-1 bg-zinc-50 border-2 border-zinc-100 px-6 py-4 font-bold tracking-widest outline-none focus:border-black"
              onBlur={(e) => {
                localStorage.setItem("carflex_phone", e.target.value);
                setMyPhone(e.target.value);
              }}
            />
          </div>
        ) : (
          <>
            <div className="bg-white border-t-2 border-black flex items-center gap-4">
              <input
                type="text"
                placeholder="TYPE MESSAGE..."
                className="flex-1 bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-primary uppercase text-sm"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                className="bg-black text-white px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary transition-all disabled:opacity-50"
              >
                Send
              </button>
            </div>

            <CounterOfferModal 
              isOpen={showCounterModal} 
              onClose={() => setShowCounterModal(false)} 
              offer={offer}
              onSuccess={fetchOffer}
            />

            <AcceptOfferModal 
              isOpen={showAcceptModal} 
              onClose={() => setShowAcceptModal(false)} 
              offer={offer}
              onSuccess={fetchOffer}
            />

            <WithdrawOfferModal 
              isOpen={showWithdrawModal} 
              onClose={() => setShowWithdrawModal(false)} 
              offerId={offer.id}
              onSuccess={fetchOffer}
            />
          </>
        )}
      </div>
    </div>
  );
}
