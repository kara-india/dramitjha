// src/components/HeroBone/HeroBone.tsx
"use client";

import { motion } from "framer-motion";
import { type FC } from "react";

interface HeroBoneProps {
  onBook:         () => void;
  onServices:     () => void;
  onTestimonials: () => void;
  onDoctor:       () => void;
}

const BoneSVG: FC = () => (
  <svg
    viewBox="0 0 120 200"
    aria-hidden="true"
    className="w-24 h-36 text-[#d5f14c] drop-shadow-[0_0_15px_rgba(213,241,76,0.3)]"
    fill="currentColor"
  >
    <ellipse cx="60" cy="22" rx="22" ry="16" />
    <rect x="52" y="36" width="16" height="128" rx="8" />
    <ellipse cx="44" cy="172" rx="16" ry="12" />
    <ellipse cx="76" cy="172" rx="16" ry="12" />
  </svg>
);

export const HeroBone: FC<HeroBoneProps> = ({
  onBook,
  onServices,
  onTestimonials,
  onDoctor,
}) => {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[55vh] bg-[#102321] text-white px-6 py-16 overflow-hidden border-b border-slate-800/80"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 0.5px,transparent 0.5px)",
          backgroundSize: "5px 5px",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6"
      >
        <BoneSVG />
      </motion.div>

      <motion.h1
        id="hero-heading"
        className="text-4xl sm:text-6xl font-black tracking-tight text-center leading-tight mb-4 font-heading"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        Move Without <span className="text-teal-400">Pain.</span>
      </motion.h1>

      <motion.p
        className="text-slate-300 text-base sm:text-lg text-center max-w-lg mb-8 font-normal leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Fellowship-trained orthopaedic care — keyhole surgery, ACL reconstruction, sports rehab.
      </motion.p>

      <motion.div
        className="flex flex-wrap justify-center gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <button
          type="button"
          onClick={onBook}
          aria-label="Book Appointment"
          className="rounded-xl px-6 py-3 text-sm font-bold bg-[#d5f14c] text-[#102321] hover:bg-[#c4df3b] shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c]"
        >
          Book Appointment
        </button>

        <button
          type="button"
          onClick={onServices}
          aria-label="Services"
          className="rounded-xl px-6 py-3 text-sm font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c]"
        >
          Services
        </button>

        <button
          type="button"
          onClick={onTestimonials}
          aria-label="Testimonials"
          className="rounded-xl px-6 py-3 text-sm font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c]"
        >
          Testimonials
        </button>

        <button
          type="button"
          onClick={onDoctor}
          aria-label="Know Your Doctor"
          className="rounded-xl px-6 py-3 text-sm font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c]"
        >
          Know Your Doctor
        </button>
      </motion.div>
    </section>
  );
};

export default HeroBone;
