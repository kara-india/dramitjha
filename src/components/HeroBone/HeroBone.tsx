// src/components/HeroBone/HeroBone.tsx
"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, Stethoscope, Users, CheckCircle2, X, Calendar, Sparkles } from "lucide-react";
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
    className="w-28 h-40 text-[#c89b2a] drop-shadow-[0_0_25px_rgba(200,155,42,0.4)]"
    fill="currentColor"
  >
    <defs>
      <linearGradient id="gold-bone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#c89b2a" />
        <stop offset="100%" stopColor="#b8860b" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="22" rx="22" ry="16" fill="url(#gold-bone-grad)" />
    <rect x="52" y="36" width="16" height="128" rx="8" fill="url(#gold-bone-grad)" />
    <ellipse cx="44" cy="172" rx="16" ry="12" fill="url(#gold-bone-grad)" />
    <ellipse cx="76" cy="172" rx="16" ry="12" fill="url(#gold-bone-grad)" />
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
      className="relative flex flex-col items-center justify-center min-h-[52vh] bg-gradient-to-b from-[#ffffff] via-[#fcfbf8] to-[#f5f2eb] text-[#1c1917] px-6 py-12 rounded-3xl border border-[#c89b2a]/30 shadow-[0_10px_35px_rgba(200,155,42,0.1)] overflow-hidden"
    >
      {/* Background Radial Gold Glow */}
      <div className="absolute inset-0 bg-radial from-[#d4af37]/15 via-transparent to-transparent opacity-70 pointer-events-none" />

      {/* Central Bone Graphic */}
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-5 cursor-pointer hover:scale-105 transition-transform"
        onClick={onBook}
        title="Click bone graphic to book appointment"
      >
        <BoneSVG />
      </motion.div>

      <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest mb-3 font-semibold">
        // GOLD STANDARD CARE // VARANASI OPD
      </Badge>

      <h2 id="hero-heading" className="text-3xl sm:text-4xl font-black text-center leading-tight mb-2 font-heading text-[#1c1917]">
        Move Without <span className="gold-text-gradient">Pain.</span>
      </h2>
      
      <p className="text-stone-600 text-xs sm:text-sm text-center max-w-md mb-6 leading-relaxed font-medium">
        Fellowship-trained orthopaedic care by Dr. Amit Kumar Jha — keyhole arthroscopy, ACL reconstruction, and joint preservation.
      </p>

      {/* Four Primary Navigation CTAs */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        <button
          type="button"
          onClick={onBook}
          aria-label="Book OPD Appointment"
          className="rounded-xl px-5 py-2.5 text-xs font-bold gold-gradient-btn flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Book Appointment
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("services"); if (onServices) onServices(); }}
          aria-label="Services & Surgeries"
          className="rounded-xl px-4 py-2.5 text-xs font-bold bg-white border border-[#c89b2a]/40 text-[#1c1917] hover:bg-[#f5e8c7]/50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Stethoscope className="h-4 w-4 text-[#c89b2a]" />
          Services
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("testimonials"); if (onTestimonials) onTestimonials(); }}
          aria-label="Patient Stories & Outcomes"
          className="rounded-xl px-4 py-2.5 text-xs font-bold bg-white border border-[#c89b2a]/40 text-[#1c1917] hover:bg-[#f5e8c7]/50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Star className="h-4 w-4 text-[#c89b2a]" />
          Stories
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("doctor"); if (onDoctor) onDoctor(); }}
          aria-label="Know Your Doctor"
          className="rounded-xl px-4 py-2.5 text-xs font-bold bg-white border border-[#c89b2a]/40 text-[#1c1917] hover:bg-[#f5e8c7]/50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Award className="h-4 w-4 text-[#c89b2a]" />
          Credentials
        </button>
      </div>

      {/* ── EXPANDABLE QUICK-INFO OVERLAY MODAL ────────────────────────────── */}
      <AnimatePresence>
        {activeTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTab(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 w-full max-w-xl bg-white border border-[#c89b2a]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-800"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                <h3 className="text-xl font-black text-stone-900 font-heading">
                  {activeTab === "services" && "Clinical Services & Surgeries"}
                  {activeTab === "testimonials" && "Patient Stories & Verified Outcomes"}
                  {activeTab === "doctor" && "Dr. Amit Kumar Jha — Credentials"}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab(null)}
                  className="p-1 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100"
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
                    <div key={s.title} className="p-3 bg-[#fcfbf8] rounded-xl border border-[#c89b2a]/30 flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#c89b2a] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 text-sm block font-heading">{s.title}</strong>
                        <span className="text-xs text-stone-600">{s.desc}</span>
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
                    <div key={t.name} className="p-3 bg-[#fcfbf8] rounded-xl border border-[#c89b2a]/30 space-y-1">
                      <div className="flex gap-1 text-[#c89b2a] text-xs">★★★★★</div>
                      <p className="text-xs text-stone-700 italic">&ldquo;{t.quote}&rdquo;</p>
                      <span className="text-[11px] font-bold text-[#96721b] block">— {t.name} ({t.sport})</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "doctor" && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 bg-[#fcfbf8] rounded-xl border border-[#c89b2a]/30">
                    <strong className="text-stone-900 text-sm block font-heading">FNB Sports Medicine (Ganga Hospital)</strong>
                    <span className="text-stone-600">National Board Fellowship trained in high-volume sports surgery.</span>
                  </div>
                  <div className="p-3 bg-[#fcfbf8] rounded-xl border border-[#c89b2a]/30">
                    <strong className="text-stone-900 text-sm block font-heading">MS &amp; DNB Orthopaedics</strong>
                    <span className="text-stone-600">5,000+ surgeries performed with 98.5% return-to-sport rate.</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => { setActiveTab(null); onBook(); }}
                  className="rounded-xl px-5 py-2.5 font-black text-xs gold-gradient-btn"
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
