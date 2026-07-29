"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BodyPart } from "@/data/bodyParts";

interface PartDetailsPanelProps {
  open?: boolean;
  isOpen?: boolean;
  part: BodyPart | null;
  onClose: () => void;
  onBook: (partId: string) => void;
}

export function PartDetailsPanel({ open, isOpen, part, onClose, onBook }: PartDetailsPanelProps) {
  const isPanelOpen = open ?? isOpen ?? false;
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPanelOpen) {
      panelRef.current?.focus();
    }
  }, [isPanelOpen]);

  if (!isPanelOpen || !part) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop (click to close) */}
      <button
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <motion.aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="part-details-title"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="ml-auto w-full max-w-md h-full bg-white text-slate-900 shadow-xl p-6 overflow-y-auto"
      >
        <div className="flex items-start justify-between">
          <h2 id="part-details-title" className="text-xl font-semibold">
            {part.label}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="ml-3 rounded-md px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600">{part.short}</p>

        <section className="mt-4">
          <h3 className="font-semibold text-sm">Common conditions</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
            {part.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section className="mt-4">
          <h3 className="font-semibold text-sm">Recommended services</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
            {part.services?.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <div className="mt-6">
          <button
            onClick={() => onBook(part.id)}
            className="w-full rounded-lg bg-[#d5f14c] text-[#071211] font-semibold py-2.5 hover:bg-[#c4df3b]"
          >
            Book Appointment
          </button>
        </div>
      </motion.aside>
    </div>
  );
}

export default PartDetailsPanel;
