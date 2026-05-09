"use client";

import { useState } from "react";
import Link from "next/link";

interface DuplicateVehicleModalProps {
  isOpen: boolean;
  vehicle: {
    id: string;
    regNumber: string;
    make: string;
    model: string;
    year: number;
    price: number;
    status: string;
    owner: {
      id: string;
      name: string;
      phone: string;
    };
    createdAt: string;
  } | null;
  onClose: () => void;
  onProceed?: () => void;
}

export default function DuplicateVehicleModal({
  isOpen,
  vehicle,
  onClose,
  onProceed
}: DuplicateVehicleModalProps) {
  if (!isOpen || !vehicle) return null;

  const createdDate = new Date(vehicle.createdAt).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="nm-card max-w-md w-full p-8 space-y-6 border-2 border-yellow-500/50 bg-yellow-500/5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-yellow-400">warning</span>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              Duplicate Entry Detected
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
              This vehicle already exists in our system
            </p>
          </div>
        </div>

        {/* Existing Vehicle Details */}
        <div className="nm-inset p-6 space-y-4">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Existing Entry</p>
          
          <div className="space-y-3 text-[10px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">Registration:</span>
              <span className="text-white font-black">{vehicle.regNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Vehicle:</span>
              <span className="text-white font-black">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Price:</span>
              <span className="text-white font-black">KES {vehicle.price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status:</span>
              <span className={`font-black uppercase tracking-widest ${
                vehicle.status === "active" ? "text-green-400" : "text-yellow-400"
              }`}>
                {vehicle.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Listed By:</span>
              <span className="text-white font-black">{vehicle.owner.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Listed On:</span>
              <span className="text-white font-black">{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest leading-relaxed">
            To prevent duplicate listings, we only allow one entry per registration number. 
            If you believe this is an error, please contact support.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 nm-card p-4 font-black uppercase tracking-widest text-[9px] border-2 border-white/20 hover:border-white/40 transition-all"
          >
            Close
          </button>
          <Link
            href="/support/vendor-kb"
            className="flex-1 nm-card p-4 font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:scale-105 transition-all border-none text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
