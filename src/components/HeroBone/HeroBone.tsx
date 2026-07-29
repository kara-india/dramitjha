// src/components/HeroBone/HeroBone.tsx
"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, Stethoscope, Users, CheckCircle2, X, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeroBoneProps {
  onBook: () => void;
  onServices?: () => void;
  onTestimonials?: () => void;
  onDoctor?: () => void;
}

const BoneSVG: FC = () => (
  <svg
    viewBox="0 0 120 200"
    aria-hidden="true"
    className="w-28 h-40 text-[#d5f14c] drop-shadow-[0_0_20px_rgba(213,241,76,0.35)]"
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
  const [activeTab, setActiveTab] = useState<"services" | "testimonials" | "doctor" | null>(null);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex flex-col items-center justify-center min-h-[58vh] bg-[#102321] text-white px-6 py-16 border-b border-slate-800/80 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 0.5px,transparent 0.5px)",
          backgroundSize: "6px 6px",
        }}
        aria-hidden="true"
      />

      {/* Central Bone Graphic */}
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 cursor-pointer hover:scale-105 transition-transform"
        onClick={onBook}
        title="Click bone to book appointment"
      >
        <BoneSVG />
      </motion.div>

      <Badge className="bg-teal-900/40 text-teal-300 border-teal-700/50 px-3.5 py-1 text-xs font-mono uppercase tracking-widest mb-3">
        // ANATOMIC PRECISION // VARANASI OPD
      </Badge>

      <h1 id="hero-heading" className="text-4xl sm:text-6xl font-black text-center leading-tight mb-3 font-heading">
        Move Without <span className="text-teal-400">Pain.</span>
      </h1>
      
      <p className="text-slate-300 text-sm sm:text-base text-center max-w-xl mb-8 leading-relaxed">
        Fellowship-trained orthopaedic care by Dr. Amit Kumar Jha — keyhole arthroscopy, ACL reconstruction, and joint preservation.
      </p>

      {/* Four Primary Navigation CTAs */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={onBook}
          aria-label="Book OPD Appointment"
          className="rounded-xl px-6 py-3 text-sm font-bold bg-[#d5f14c] text-[#102321] hover:bg-[#c4df3b] shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Book Appointment
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("services"); if (onServices) onServices(); }}
          aria-label="Services & Surgeries"
          className="rounded-xl px-5 py-3 text-sm font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] flex items-center gap-2"
        >
          <Stethoscope className="h-4 w-4 text-teal-400" />
          Services &amp; Surgeries
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("testimonials"); if (onTestimonials) onTestimonials(); }}
          aria-label="Patient Stories & Outcomes"
          className="rounded-xl px-5 py-3 text-sm font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] flex items-center gap-2"
        >
          <Star className="h-4 w-4 text-amber-400" />
          Patient Stories
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("doctor"); if (onDoctor) onDoctor(); }}
          aria-label="Know Your Doctor"
          className="rounded-xl px-5 py-3 text-sm font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] flex items-center gap-2"
        >
          <Award className="h-4 w-4 text-[#d5f14c]" />
          Doctor Credentials
        </button>
      </div>

      {/* ── EXPANDABLE QUICK-INFO OVERLAY MODAL ────────────────────────────── */}
      <AnimatePresence>
        {activeTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTab(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 w-full max-w-xl bg-[#102321] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-xl font-black text-white font-heading">
                  {activeTab === "services" && "Clinical Services & Surgeries"}
                  {activeTab === "testimonials" && "Patient Stories & Verified Outcomes"}
                  {activeTab === "doctor" && "Dr. Amit Kumar Jha — Credentials"}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {activeTab === "services" && (
                <div className="space-y-3">
                  {[
                    { title: "Keyhole Arthroscopy", desc: "Minimally invasive joint preservation for knee & shoulder." },
                    { title: "Anatomic ACL Reconstruction", desc: "Fellowship-grade hamstring/patellar tendon graft reconstruction." },
                    { title: "Meniscus Repair", desc: "Arthroscopic meniscus suturing and partial meniscectomy." },
                    { title: "Sports Rehabilitation", desc: "6-stage instrumented return-to-sport protocol." },
                  ].map((s) => (
                    <div key={s.title} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#d5f14c] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white text-sm block font-heading">{s.title}</strong>
                        <span className="text-xs text-slate-400">{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "testimonials" && (
                <div className="space-y-3">
                  {[
                    { quote: "Returned to competitive cricket 6 months after ACL surgery with Dr. Jha.", name: "Rahul S.", sport: "State Cricketer" },
                    { quote: "No more knee pain! Minimally invasive arthroscopy made recovery so fast.", name: "Priya V.", sport: "Marathon Runner" },
                  ].map((t) => (
                    <div key={t.name} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex gap-1 text-amber-400 text-xs">★★★★★</div>
                      <p className="text-xs text-slate-300 italic">&ldquo;{t.quote}&rdquo;</p>
                      <span className="text-[11px] font-bold text-teal-400 block">— {t.name} ({t.sport})</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "doctor" && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <strong className="text-white text-sm block font-heading">FNB Sports Medicine (Ganga Hospital)</strong>
                    <span className="text-slate-400">National Board Fellowship trained in high-volume sports surgery.</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <strong className="text-white text-sm block font-heading">MS &amp; DNB Orthopaedics</strong>
                    <span className="text-slate-400">5,000+ surgeries performed with 98.5% return-to-sport rate.</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => { setActiveTab(null); onBook(); }}
                  className="rounded-xl px-5 py-2.5 font-black text-xs bg-[#d5f14c] text-[#102321] hover:bg-[#c4df3b]"
                >
                  Book OPD Appointment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroBone;
