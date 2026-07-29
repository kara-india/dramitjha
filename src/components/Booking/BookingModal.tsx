// src/components/Booking/BookingModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Clock, CheckCircle2 } from "lucide-react";
import { BODY_PARTS, getBodyPart } from "@/data/bodyParts";

interface BookingModalProps {
  isOpen: boolean;
  initialPartId?: string | null;
  onClose: () => void;
  onBook?: (partId: string, data: { name: string; phone: string; date: string; time: string }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  initialPartId,
  onClose,
  onBook,
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>(initialPartId || "knee");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialPartId) setSelectedPartId(initialPartId);
  }, [initialPartId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    try {
      await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partId: selectedPartId, name, phone, date, time }),
      });

      if (onBook) {
        onBook(selectedPartId, { name, phone, date, time });
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  if (!isOpen) return null;

  const part = getBodyPart(selectedPartId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative z-50 w-full max-w-lg bg-white border border-[#c89b2a]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
          <div>
            <h3 id="booking-modal-title" className="text-xl font-black text-stone-900 font-heading">
              Book OPD Appointment
            </h3>
            <p className="text-xs text-[#96721b] font-bold mt-0.5">
              Dr. Amit Kumar Jha Sports Medicine Clinic
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-10 space-y-4">
            <div className="h-16 w-16 bg-[#f5e8c7] text-[#c89b2a] rounded-full flex items-center justify-center mx-auto border border-[#c89b2a]/40 shadow-inner">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h4 className="text-2xl font-black text-stone-900 font-heading">Token Reserved!</h4>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Appointment request received for <strong className="text-stone-900">{name}</strong> ({part?.label || "General OPD"}). Our clinic receptionist will confirm your slot shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Body Region Selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-stone-700 uppercase tracking-wider mb-1">
                Anatomical Area / Joint
              </label>
              <select
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                className="w-full rounded-xl bg-[#fcfbf8] border border-[#c89b2a]/40 p-3 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#c89b2a]"
              >
                {BODY_PARTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} — {p.short}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Name */}
            <div>
              <label htmlFor="modal-name" className="block text-xs font-mono font-bold text-stone-700 uppercase tracking-wider mb-1">
                Patient Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl bg-[#fcfbf8] border border-[#c89b2a]/40 pl-10 pr-4 py-3 text-sm text-stone-900 placeholder-stone-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#c89b2a]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="modal-phone" className="block text-xs font-mono font-bold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                <input
                  id="modal-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl bg-[#fcfbf8] border border-[#c89b2a]/40 pl-10 pr-4 py-3 text-sm text-stone-900 placeholder-stone-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#c89b2a]"
                />
              </div>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl bg-[#fcfbf8] border border-[#c89b2a]/40 p-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#c89b2a]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl bg-[#fcfbf8] border border-[#c89b2a]/40 p-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#c89b2a]"
                >
                  <option value="10:00 AM">10:00 AM - Morning</option>
                  <option value="01:00 PM">01:00 PM - Afternoon</option>
                  <option value="05:00 PM">05:00 PM - Evening</option>
                  <option value="07:00 PM">07:00 PM - Evening</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-gradient-btn font-black text-sm uppercase tracking-wider shadow-lg"
              >
                Confirm OPD Appointment
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default BookingModal;
