// src/components/BodySelector3D/PartDetailsPanel.tsx
// Slide-over panel that shows conditions for the selected body part.
// Focus is trapped inside while open; Escape closes it.

"use client";

import { useEffect, useRef, type FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import type { BodyPart } from "@/data/bodyParts";

interface Props {
  part: BodyPart | null;
  onClose:   () => void;
  onBook:    (partId: string) => void;
}

export const PartDetailsPanel: FC<Props> = ({ part, onClose, onBook }) => {
  const panelRef  = useRef<HTMLDivElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!part) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [part, onClose]);

  // Move focus to close button when panel opens
  useEffect(() => {
    if (part) closeRef.current?.focus();
  }, [part]);

  // Minimal focus trap — cycle Tab/Shift+Tab within panel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

  return (
    <AnimatePresence>
      {part && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
            onKeyDown={handleKeyDown}
            className={[
              "fixed right-0 top-0 h-full z-40 w-full max-w-sm",
              "bg-[#102321] border-l border-slate-800 shadow-2xl",
              "flex flex-col p-6 gap-6 overflow-y-auto",
            ].join(" ")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-1">
                  Selected Region
                </p>
                <h2
                  id="panel-title"
                  className="text-2xl font-black text-white leading-tight"
                >
                  {part.label}
                </h2>
                <p className="text-sm text-slate-400 mt-1">{part.subtitle}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close details panel"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conditions */}
            <div>
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                // Commonly Treated Conditions
              </h3>
              <ul className="space-y-2" role="list">
                {part.conditions.map((cond) => (
                  <li
                    key={cond}
                    className="flex items-start gap-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-sm text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                    {cond}
                  </li>
                ))}
              </ul>
            </div>

            {/* Book CTA */}
            <div className="mt-auto pt-4 border-t border-slate-800">
              <button
                type="button"
                id="panel-book-cta"
                onClick={() => onBook(part.id)}
                className={[
                  "w-full rounded-xl px-6 py-3.5 font-black text-sm",
                  "bg-[#d5f14c] text-[#102321] hover:bg-[#c4df3b]",
                  "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
                ].join(" ")}
                aria-label={`Book appointment for ${part.label} treatment`}
              >
                Book Appointment for {part.label}
              </button>
              <p className="text-xs text-slate-500 text-center mt-3">
                Same-day OPD slots available · 11 AM – 8:30 PM IST
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
