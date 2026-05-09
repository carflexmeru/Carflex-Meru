"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegistrationTicketsPage() {
  const router = useRouter();
  const [activeEvent, setActiveEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    regNumber: "",
    ownerName: "",
    ownerPhone: "",
    ownerIdNumber: "",
    make: "",
    model: "",
    year: "",
    amountPaid: "",
    zoneName: "",
    processName: "Manual registration",
    notes: "",
  });

  useEffect(() => {
    const syncEvent = () => setActiveEvent(localStorage.getItem("carflex_staff_event") || "");
    syncEvent();
    window.addEventListener("staffeventchange", syncEvent);
    return () => window.removeEventListener("staffeventchange", syncEvent);
  }, []);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/staff/registration/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          eventName: activeEvent || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Ticket creation failed");

      setMessage(`Ticket ${data.ticket.ticketId} created successfully.`);
      router.push(`/gate/ticket/${data.ticket.ticketId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ticket creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
            Active Event: {activeEvent || "None selected"}
          </div>
          <h1 className="text-[2.7rem] sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.88] text-foreground max-w-[12ch]">
            TICKETS <br /> <span className="text-stroke italic">CREATOR.</span>
          </h1>
          <p className="max-w-[34ch] text-zinc-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] leading-relaxed">
            Manual ticket issuance for event entries using the same registration details and event process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
          <form onSubmit={handleSubmit} className="nm-card p-6 sm:p-8 md:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["regNumber", "Registration Number"],
                ["ownerName", "Owner Name"],
                ["ownerPhone", "Phone Number"],
                ["ownerIdNumber", "ID Number"],
                ["make", "Make"],
                ["model", "Model"],
                ["year", "Year"],
                ["amountPaid", "Amount Paid"],
                ["zoneName", "Zone Name"],
                ["processName", "Event Process"],
              ].map(([key, label]) => (
                <label key={key} className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full nm-inset bg-transparent px-4 py-3 text-sm font-bold outline-none"
                    placeholder={label}
                  />
                </label>
              ))}
              <label className="space-y-2 md:col-span-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="w-full nm-inset bg-transparent px-4 py-3 text-sm font-bold outline-none min-h-[120px]"
                  placeholder="Optional extra details about the ticket or event process"
                />
              </label>
            </div>

            {error && (
              <div className="nm-inset border border-primary/30 bg-primary/10 p-4 text-[10px] font-bold uppercase tracking-widest text-primary">
                {error}
              </div>
            )}
            {message && (
              <div className="nm-inset border border-emerald-500/30 bg-emerald-500/10 p-4 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                {message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="nm-card inline-flex items-center justify-center gap-2 bg-primary px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-sm">confirmation_number</span>
                {loading ? "CREATING..." : "CREATE TICKET"}
              </button>
              <Link
                href="/gate/tickets"
                className="nm-card inline-flex items-center justify-center gap-2 bg-[var(--surface)] px-5 py-4 text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:scale-[1.02] border border-[var(--glass-border)]"
              >
                <span className="material-symbols-outlined text-sm">view_list</span>
                View Tickets
              </Link>
            </div>
          </form>

          <div className="space-y-6">
            <div className="nm-card p-6 sm:p-8 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">What this page does</p>
              <p className="text-sm font-bold text-foreground leading-relaxed">
                It captures the same core details you use during check-in, adds the event process field, and writes a new registration ticket record.
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                After submission, you will be sent to the printable ticket view.
              </p>
            </div>

            <div className="nm-card p-6 sm:p-8 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Quick Links</p>
              <Link href="/gate/check-in" className="block nm-inset p-4 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                Open Check-In
              </Link>
              <Link href="/gate/tickets" className="block nm-inset p-4 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                Registered Tickets
              </Link>
              <Link href="/staff/registration/logs" className="block nm-inset p-4 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                Registration Logs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
