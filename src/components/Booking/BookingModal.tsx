"use client";

import React, { useEffect, useRef, useState } from "react";

interface BookingModalProps {
  open?: boolean;
  isOpen?: boolean;
  partId?: string | null;
  initialPartId?: string | null;
  onClose: () => void;
  onBook?: (partId: string, data?: any) => void;
}

export function BookingModal({ open, isOpen, partId, initialPartId, onClose, onBook }: BookingModalProps) {
  const isModalOpen = open ?? isOpen ?? false;
  const activePartId = partId ?? initialPartId ?? null;

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setIsSubmitted(false);
      dialogRef.current?.focus();
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, phone, date, time };
    if (onBook && activePartId) {
      onBook(activePartId, payload);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-slate-900"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h2 id="booking-title" className="text-lg font-bold text-slate-900">
            Book Appointment
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="h-12 w-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-lg font-bold text-slate-900">Booking Requested</h3>
            <p className="text-xs text-slate-600">
              Thank you {name}. We have recorded your request for {activePartId || "consultation"}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 rounded-xl px-4 py-2.5 font-bold text-sm bg-[#d5f14c] text-[#071211] hover:bg-[#c4df3b]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Full name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Phone *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                inputMode="tel"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5 pt-2 border-t border-slate-100">
              <button type="submit" className="flex-1 rounded-xl bg-[#d5f14c] text-[#071211] px-4 py-2.5 font-bold text-sm hover:bg-[#c4df3b]">
                Confirm Booking
              </button>
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
