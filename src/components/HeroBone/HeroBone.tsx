"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface HeroBoneProps {
  onBook: () => void;
  onServices: () => void;
  onTestimonials: () => void;
  onDoctor: () => void;
}

const BoneSVG: FC = () => (
  <svg viewBox="0 0 120 200" aria-hidden="true" className="w-28 h-40 text-[#d5f14c]">
    <ellipse cx="60" cy="22" rx="22" ry="16" />
    <rect x="52" y="36" width="16" height="128" rx="8" />
    <ellipse cx="44" cy="172" rx="16" ry="12" />
    <ellipse cx="76" cy="172" rx="16" ry="12" />
  </svg>
);

export const HeroBone: FC<HeroBoneProps> = ({ onBook, onServices, onTestimonials, onDoctor }) => {
  const CTAS = [
    { id: "book", label: "Book Appointment", onClick: onBook, primary: true },
    { id: "services", label: "Services", onClick: onServices },
    { id: "testimonials", label: "Testimonials", onClick: onTestimonials },
    { id: "doctor", label: "Know Your Doctor", onClick: onDoctor },
  ];

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex flex-col items-center justify-center min-h-[56vh] bg-[#0b241f] text-white px-6 py-16"
    >
      <div className="mb-6 motion-safe:animate-fade-in">
        <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <BoneSVG />
        </motion.div>
      </div>

      <h1 id="hero-heading" className="text-3xl sm:text-5xl font-extrabold text-center leading-tight mb-3">
        Move Without <span className="text-teal-300">Pain.</span>
      </h1>
      <p className="text-slate-300 text-sm sm:text-base text-center max-w-xl mb-8">
        Fellowship-trained orthopaedic care — sports injuries, ACL repair, non-surgical rehab.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {CTAS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={c.onClick}
            aria-label={c.label}
            className={[
              "rounded-lg px-5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#d5f14c] transition",
              c.primary ? "bg-[#d5f14c] text-[#0b241f] shadow" : "border border-slate-700 text-slate-300 hover:bg-slate-800",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroBone;
