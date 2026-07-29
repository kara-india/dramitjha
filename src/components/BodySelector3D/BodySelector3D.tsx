// src/components/BodySelector3D/BodySelector3D.tsx
"use client";

import React, { useState, useCallback, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Stethoscope, ChevronRight, X, CheckCircle2, Sparkles } from "lucide-react";
import { BODY_PARTS, getBodyPart, type BodyPart } from "@/data/bodyParts";

interface BodySelectorProps {
  onSelect?: (part: BodyPart) => void;
  onBook?: (partId: string) => void;
}

export const BodySelector3D: FC<BodySelectorProps> = ({ onSelect, onBook }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>("knee"); // Default selected to Knee (Dr. Jha's core specialty)

  const selectedPart = getBodyPart(selectedId) || BODY_PARTS[7]; // Default to Knee
  const hoveredPart  = getBodyPart(hoveredId ?? "");

  const handlePartClick = useCallback(
    (id: string) => {
      setSelectedId(id);
      const part = getBodyPart(id);
      if (part && onSelect) onSelect(part);
    },
    [onSelect]
  );

  return (
    <section
      aria-label="Interactive 3D Body Selector"
      className="relative w-full min-h-[620px] bg-gradient-to-b from-[#0c1a18] via-[#091513] to-[#060e0d] rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl p-4 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8"
    >
      {/* ── LEFT / OVERLAY: ANATOMICAL VISUAL MAP ──────────────────────────── */}
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[520px] mx-auto flex items-center justify-center">
        {/* Ambient Glowing Background Aura */}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Floating Shadow Sprite */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-5 rounded-full bg-black/60 blur-md pointer-events-none" />

        {/* Anatomical Human Vector Outline */}
        <svg
          viewBox="0 0 200 500"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(45,212,191,0.15)]"
          aria-hidden="true"
        >
          {/* Head & Neck */}
          <ellipse cx="100" cy="35" rx="24" ry="28" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <rect x="91" y="60" width="18" height="18" rx="4" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          
          {/* Torso & Spine */}
          <rect x="68" y="78" width="64" height="110" rx="12" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <line x1="100" y1="84" x2="100" y2="182" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

          {/* Arms & Wrists */}
          <rect x="36" y="80" width="26" height="70" rx="10" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <rect x="138" y="80" width="26" height="70" rx="10" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <rect x="38" y="155" width="22" height="60" rx="9" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <rect x="140" y="155" width="22" height="60" rx="9" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <ellipse cx="49" cy="226" rx="14" ry="10" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <ellipse cx="151" cy="226" rx="14" ry="10" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />

          {/* Pelvis & Thighs */}
          <rect x="70" y="192" width="29" height="90" rx="10" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <rect x="101" y="192" width="29" height="90" rx="10" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />

          {/* Shins & Knees */}
          <rect x="72" y="286" width="25" height="80" rx="8" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <rect x="103" y="286" width="25" height="80" rx="8" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />

          {/* Feet & Ankles */}
          <ellipse cx="82" cy="374" rx="16" ry="10" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
          <ellipse cx="118" cy="374" rx="16" ry="10" fill="#142c29" stroke="#2dd4bf" strokeWidth="1.5" />
        </svg>

        {/* ── INTERACTIVE HOTSPOT BUTTONS ──────────────────────────────────── */}
        {BODY_PARTS.map((part) => {
          const isSelected = selectedId === part.id;
          const isHovered  = hoveredId  === part.id;

          return (
            <button
              key={part.id}
              type="button"
              aria-label={`Select ${part.label}`}
              aria-pressed={isSelected}
              onMouseEnter={() => setHoveredId(part.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(part.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePartClick(part.id)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c]"
              style={{ left: part.hotspotPos.x, top: part.hotspotPos.y }}
            >
              {/* Pulsating Ring */}
              <span
                className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                  isSelected
                    ? "bg-[#d5f14c]/40 animate-ping"
                    : isHovered
                    ? "bg-teal-400/40 animate-pulse"
                    : "opacity-0"
                }`}
              />

              {/* Hotspot Pill */}
              <span
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  isSelected
                    ? "w-6 h-6 bg-[#d5f14c] border-2 border-white shadow-[0_0_15px_#d5f14c]"
                    : isHovered
                    ? "w-5 h-5 bg-teal-400 border-2 border-white shadow-[0_0_10px_#2dd4bf]"
                    : "w-4 h-4 bg-teal-900/80 border border-teal-400/80 hover:scale-125"
                }`}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-[#102321]" />}
              </span>

              {/* Label Badge on Hover */}
              {isHovered && !isSelected && (
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-7 whitespace-nowrap bg-slate-900/95 border border-slate-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-lg pointer-events-none">
                  {part.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── RIGHT: FLOATING DETAILS & PROCEDURES POPUP CARD ─────────────────── */}
      <div className="w-full lg:w-1/2 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPart.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="glass-card bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-6"
          >
            {/* Header Badge & Title */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-700/60 text-teal-300 text-xs font-mono uppercase tracking-widest font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-[#d5f14c]" />
                  Treated Anatomy
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Ref: {selectedPart.subtitle}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                {selectedPart.label}
              </h3>
              <p className="text-sm text-teal-400 font-medium mt-1">
                {selectedPart.short}
              </p>
            </div>

            {/* Common Surgeries & Procedures by Dr. Amit Jha */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-[#d5f14c]" />
                Surgeries &amp; Procedures by Dr. Amit Jha
              </h4>
              <ul className="space-y-2">
                {selectedPart.procedures.map((proc) => (
                  <li
                    key={proc}
                    className="flex items-start gap-2.5 bg-[#0c1a18] border border-slate-800/80 rounded-xl p-3 text-xs sm:text-sm text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#d5f14c] shrink-0 mt-0.5" />
                    <span className="font-semibold text-white">{proc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treated Conditions Tags */}
            <div>
              <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                Treated Conditions
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPart.conditions.map((cond) => (
                  <span
                    key={cond}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Booking Action CTA */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onBook && onBook(selectedPart.id)}
                className="w-full py-3.5 px-6 rounded-xl bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Book OPD Consultation for {selectedPart.label}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BodySelector3D;
