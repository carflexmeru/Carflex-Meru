"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  stats: { offers: number; vehicles: number; saved: number };
  activity: { type: string; desc: string; time: string; status: string }[];
}

export default function UserDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("carflex_phone") || "";
    setPhone(storedPhone);
    if (storedPhone) {
      fetchData(storedPhone);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchData(phoneNum: string) {
    try {
      const res = await fetch(`/api/dashboard/stats?phone=${phoneNum}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  if (!phone) {
    return (
      <div className="bg-red-50 border-4 border-primary p-12 text-center">
        <h3 className="text-2xl font-black text-primary uppercase mb-4">Identity Required</h3>
        <p className="text-zinc-600 font-bold mb-8 uppercase text-xs">Please verify your phone number in the Inbox to view your dashboard.</p>
      </div>
    );
  }

  const STATS = [
    { label: "Active Bargains", value: data?.stats.offers || 0, icon: "forum", color: "text-primary" },
    { label: "My Inventory", value: data?.stats.vehicles || 0, icon: "directions_car", color: "text-black" },
    { label: "Saved Listings", value: data?.stats.saved || 0, icon: "bookmark", color: "text-zinc-400" },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#0A0A0A]">
            <div className="flex justify-between items-start mb-4">
              <span className={`material-symbols-outlined text-4xl ${stat.color}`}>{stat.icon}</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
            <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity */}
        <section className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-2 h-8 bg-primary"></span>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {data?.activity.length === 0 ? (
              <p className="text-zinc-400 text-xs font-bold uppercase py-8">No recent activity found.</p>
            ) : (
              data?.activity.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'NEW' ? 'bg-primary' : 'bg-black'}`}></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{activity.type}</p>
                      <p className="font-bold text-sm">{activity.desc}</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                    {new Date(activity.time).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Market Insights */}
        <section className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-2 h-8 bg-black"></span>
            Market Insights
          </h3>
          <div className="bg-[#0A0A0A] text-white p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">analytics</span>
            </div>
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Platform Status</p>
                <p className="text-2xl font-black uppercase">Live Bazaar Active</p>
              </div>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                The Meru Showground event is currently live. Real-time verification agents are on-site to approve your new listings.
              </p>
              <button className="text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                Check-in Status <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
