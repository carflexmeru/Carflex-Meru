"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StaffMember {
  id: string;
  email: string;
  name: string;
  type: string;
  lastLogin?: string;
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      // This would fetch from your Supabase staff_agents table
      // For now, showing the structure
      setStaff([]);
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (staffId: string) => {
    if (!newPassword) {
      setError("Password cannot be empty");
      return;
    }

    try {
      setError("");
      setMessage("");

      const res = await fetch("/api/admin/staff/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          staffId,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`Password updated for ${staffId}`);
        setEditingId(null);
        setNewPassword("");
      } else {
        setError(data.error || "Failed to update password");
      }
    } catch (err) {
      setError("Error updating password");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="border-b border-white/10 sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-black uppercase tracking-widest text-sm">Back</span>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Staff Management</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 font-bold">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-bold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 font-bold uppercase tracking-widest">Loading staff...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 font-bold uppercase tracking-widest">No staff members found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className="border border-white/10 rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">{member.name}</h3>
                    <p className="text-zinc-400 text-sm">{member.email}</p>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{member.type}</p>
                  </div>
                  <button
                    onClick={() => setEditingId(editingId === member.id ? null : member.id)}
                    className="px-4 py-2 bg-primary text-white font-black uppercase text-xs rounded hover:scale-105 transition-transform"
                  >
                    {editingId === member.id ? "Cancel" : "Edit Password"}
                  </button>
                </div>

                {editingId === member.id && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => handleUpdatePassword(member.id)}
                      className="w-full px-4 py-2 bg-primary text-white font-black uppercase text-xs rounded hover:scale-105 transition-transform"
                    >
                      Update Password
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
