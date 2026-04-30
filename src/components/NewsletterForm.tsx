"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing! Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ENTER YOUR EMAIL"
          className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white text-xs font-bold tracking-widest placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all pr-32"
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-dark text-white px-6 rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-lg disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "JOINING..." : "SUBSCRIBE"}
        </button>
      </form>
      
      {status === "success" && (
        <p className="mt-4 text-green-500 text-[10px] font-black uppercase tracking-widest animate-bounce">
          {message}
        </p>
      )}
      
      {status === "error" && (
        <p className="mt-4 text-primary text-[10px] font-black uppercase tracking-widest">
          {message}
        </p>
      )}
    </div>
  );
}
