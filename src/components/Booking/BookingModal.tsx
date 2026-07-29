// src/components/Booking/BookingModal.tsx
"use client";

import { useEffect, useRef, useState, type FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { BODY_PARTS } from "@/data/bodyParts";

interface BookingModalProps {
  isOpen: boolean;
  initialPartId?: string | null;
  onClose: () => void;
}

export const BookingModal: FC<BookingModalProps> = ({
  isOpen,
  initialPartId,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [selectedPart, setSelectedPart] = useState(initialPartId || "knee");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialPartId) {
      setSelectedPart(initialPartId);
    }
  }, [initialPartId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleTrapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusables = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onKeyDown={handleTrapTab}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative z-50 w-full max-w-lg bg-[#102321] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest block">
                  OPD APPOINTMENT
                </span>
                <h2 id="booking-modal-title" className="text-xl font-bold text-white font-heading">
                  Quick OPD Booking
                </h2>
              </div>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                type="button"
                aria-label="Close booking modal"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="h-16 w-16 bg-teal-500/20 text-[#d5f14c] rounded-full flex items-center justify-center mx-auto border border-teal-500/40">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Token Reserved!</h3>
                <p className="text-sm text-slate-300">
                  Thank you <strong className="text-white">{name}</strong>. Your consultation request for{" "}
                  <span className="text-teal-400 font-semibold uppercase">{selectedPart}</span> care is recorded.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full mt-4 rounded-xl px-6 py-3 font-black text-sm bg-[#d5f14c] text-[#102321] hover:bg-[#c4df3b]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="modal-part" className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                    Treatment Area
                  </label>
                  <select
                    id="modal-part"
                    value={selectedPart}
                    onChange={(e) => setSelectedPart(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0c1a18] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  >
                    {BODY_PARTS.map((bp) => (
                      <option key={bp.id} value={bp.id}>
                        {bp.label} — {bp.subtitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-name" className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    id="modal-name"
                    required
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0c1a18] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="modal-phone" className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    id="modal-phone"
                    required
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0c1a18] border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full rounded-xl px-6 py-3.5 font-black text-sm bg-[#d5f14c] text-[#102321] hover:bg-[#c4df3b] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
