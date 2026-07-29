// src/components/SpineNavigator/SpineNavigator.tsx
"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X,
  Stethoscope,
  Award,
  Star,
  Activity,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type SpineModule = "services" | "credentials" | "stories" | "recovery";

interface SpineNavigatorProps {
  onBook: () => void;
}

const MODULES: {
  id: SpineModule;
  label: string;
  short: string;
  icon: typeof Stethoscope;
}[] = [
  { id: "services", label: "Services", short: "Surgeries & care pathways", icon: Stethoscope },
  { id: "credentials", label: "Credentials", short: "Dr. Amit Kumar Jha", icon: Award },
  { id: "stories", label: "Patient Stories", short: "Verified outcomes", icon: Star },
  { id: "recovery", label: "Recovery Plans", short: "6-stage continuum", icon: Activity },
];

const SERVICES_PREVIEW = [
  { title: "ACL & Multiligament Reconstruction", desc: "Anatomic single/double-bundle with 98.5% return-to-play." },
  { title: "Keyhole Arthroscopy", desc: "Knee & shoulder — 24-hour discharge protocol." },
  { title: "Joint Preservation (HTO/OATS)", desc: "Delay or avoid total joint replacement." },
  { title: "Sports Physiotherapy", desc: "Dedicated 30-min slots, 5-phase ACL rehab." },
];

const CREDENTIALS = [
  { title: "FNB Sports Medicine (Ganga Hospital)", desc: "National Board fellowship in high-volume sports surgery." },
  { title: "MS & DNB Orthopaedics", desc: "Post-graduate surgical qualification." },
  { title: "Keyhole Arthroscopy Specialist", desc: "Minimally invasive joint preservation." },
  { title: "5,000+ Surgeries", desc: "98.5% return-to-sport rate across ACL & arthroscopy." },
];

const STORIES = [
  {
    name: "Rajesh K. Verma",
    role: "State Level Footballer",
    type: "ACL Reconstruction",
    quote:
      "Dr. Amit Jha diagnosed my ACL tear instantly. The anatomic reconstruction and guided rehab got me back on the pitch in 6 months with 100% knee stability!",
  },
  {
    name: "Smt. Sunita Devi",
    role: "General Patient (Age 54)",
    type: "Knee Arthritis & Joint Preservation",
    quote:
      "I was struggling with severe knee pain for 3 years. Dr. Amit Jha's joint preservation checkup gave me back smooth, painless walking without knee replacement.",
  },
  {
    name: "Vikramaditya Singh",
    role: "Marathon Runner",
    type: "Meniscus Repair & Cartilage Care",
    quote:
      "The best sports injury specialist in Poorvanchal. Keyhole surgery, minimal scar, negligible pain, and a highly scientific return-to-running protocol.",
  },
];

const RECOVERY = [
  { stage: "01", name: "Symptom & Pain Assessment", desc: "Physical exam, ROM & joint stability testing." },
  { stage: "02", name: "Precision Bio-Imaging", desc: "High-resolution MRI & digital X-ray mapping." },
  { stage: "03", name: "Targeted Treatment Plan", desc: "Biological preservation or keyhole surgery." },
  { stage: "04", name: "Minimally Invasive Surgery", desc: "Arthroscopy with 24-hr discharge." },
  { stage: "05", name: "Guided 5-Phase Physiotherapy", desc: "Private 30-min slots & progressive loading." },
  { stage: "06", name: "Return to Sport Clearance", desc: "Biomechanical testing for field readiness." },
];

function VertebraIcon({ hot }: { hot: boolean }) {
  const stroke = hot ? "#c89b2a" : "#1a3d3d";
  const fill = hot ? "#f5e8c7" : "#ffffff";
  return (
    <svg viewBox="0 0 72 48" className="w-14 h-10 sm:w-16 sm:h-11 shrink-0" aria-hidden="true">
      <path
        d="M 22 6 Q 18 4, 24 2 L 48 2 Q 54 4, 50 6 L 50 42 Q 54 44, 48 46 L 24 46 Q 18 44, 22 42 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={hot ? 2.4 : 2}
        strokeLinejoin="round"
      />
      <path
        d="M 22 18 L 8 16 Q 2 20, 8 24 L 22 22"
        fill={fill}
        stroke={stroke}
        strokeWidth={hot ? 2.4 : 2}
        strokeLinejoin="round"
      />
      <path
        d="M 50 18 L 64 16 Q 70 20, 64 24 L 50 22"
        fill={fill}
        stroke={stroke}
        strokeWidth={hot ? 2.4 : 2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SpineNavigator: FC<SpineNavigatorProps> = ({ onBook }) => {
  const [active, setActive] = useState<SpineModule | null>(null);
  const [hovered, setHovered] = useState<SpineModule | null>(null);
  const activeMeta = MODULES.find((m) => m.id === active);

  return (
    <section
      aria-label="Clinic modules along the spine"
      className="relative flex flex-col items-center justify-center min-h-[48vh] bg-gradient-to-b from-[#ffffff] via-[#fcfbf8] to-[#f5f2eb] text-[#1c1917] px-4 py-8 rounded-3xl border border-[#c89b2a]/30 shadow-[0_10px_35px_rgba(200,155,42,0.1)] overflow-hidden"
    >
      <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest mb-3 font-semibold z-10">
        // CLINIC MODULES // SPINE MAP
      </Badge>

      <h2 className="text-2xl sm:text-3xl font-black text-center leading-tight mb-1 font-heading text-[#1c1917] z-10">
        Move Without <span className="gold-text-gradient">Pain.</span>
      </h2>
      <p className="text-stone-600 text-xs text-center max-w-sm mb-5 z-10">
        Tap a vertebra — Services, Credentials, Stories, or Recovery.
      </p>

      {/* 4 stacked clickable vertebrae with full HTML labels */}
      <div className="relative z-10 flex flex-col items-stretch gap-3 w-full max-w-[260px] mx-auto">
        {MODULES.map((m) => {
          const isHot = active === m.id || hovered === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              aria-label={m.label}
              aria-pressed={active === m.id}
              onClick={() => setActive(m.id)}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(m.id)}
              onBlur={() => setHovered(null)}
              className={`flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] ${
                isHot ? "bg-[#f5e8c7]/60 scale-[1.02]" : "hover:bg-stone-100/80"
              }`}
            >
              <VertebraIcon hot={isHot} />
              <span className="flex flex-col min-w-0">
                <span
                  className={`text-sm font-bold leading-tight flex items-center gap-1.5 ${
                    isHot ? "text-[#96721b]" : "text-stone-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {m.label}
                </span>
                <span className="text-[10px] text-stone-500 truncate">{m.short}</span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBook}
        className="mt-5 rounded-xl px-6 py-2.5 text-sm font-bold gold-gradient-btn flex items-center gap-2 z-10"
      >
        <Calendar className="h-4 w-4" />
        Book Appointment
      </button>

      <AnimatePresence>
        {active && activeMeta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-[#c89b2a]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-800"
              role="dialog"
              aria-modal="true"
              aria-labelledby="spine-module-title"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                <div>
                  <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 text-[10px] font-mono mb-1">
                    {activeMeta.short}
                  </Badge>
                  <h3 id="spine-module-title" className="text-xl font-black text-stone-900 font-heading">
                    {activeMeta.label}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {active === "services" && (
                <div className="space-y-3">
                  {SERVICES_PREVIEW.map((s) => (
                    <div
                      key={s.title}
                      className="p-3 bg-[#fcfbf8] rounded-xl border border-[#c89b2a]/25 flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#c89b2a] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 text-sm block font-heading">{s.title}</strong>
                        <span className="text-xs text-stone-600">{s.desc}</span>
                      </div>
                    </div>
                  ))}
                  <Link href="/services" onClick={() => setActive(null)} className="block pt-2">
                    <Button className="w-full gold-gradient-btn font-bold gap-2">
                      Full services by sport &amp; body part
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}

              {active === "credentials" && (
                <div className="space-y-3">
                  {CREDENTIALS.map((c) => (
                    <div
                      key={c.title}
                      className="p-3 bg-[#fcfbf8] rounded-xl border border-[#c89b2a]/25 flex items-start gap-3"
                    >
                      <Award className="h-4 w-4 text-[#c89b2a] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 text-sm block font-heading">{c.title}</strong>
                        <span className="text-xs text-stone-600">{c.desc}</span>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      setActive(null);
                      onBook();
                    }}
                    className="w-full gold-gradient-btn font-bold mt-2"
                  >
                    Book with Dr. Amit Jha
                  </Button>
                </div>
              )}

              {active === "stories" && (
                <div className="space-y-3">
                  {STORIES.map((t) => (
                    <figure
                      key={t.name}
                      className="p-3 bg-[#fcfbf8] rounded-xl border border-[#c89b2a]/25 space-y-1"
                    >
                      <div className="flex gap-0.5 text-[#c89b2a] text-xs">★★★★★</div>
                      <blockquote className="text-xs text-stone-700 italic">&ldquo;{t.quote}&rdquo;</blockquote>
                      <figcaption className="text-[11px] font-bold text-[#96721b]">
                        — {t.name} ({t.role}) · {t.type}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}

              {active === "recovery" && (
                <ol className="space-y-2">
                  {RECOVERY.map((r) => (
                    <li
                      key={r.stage}
                      className="p-3 bg-[#fcfbf8] rounded-xl border border-[#c89b2a]/25 flex gap-3"
                    >
                      <span className="text-lg font-black gold-text-gradient font-heading leading-none shrink-0">
                        {r.stage}
                      </span>
                      <div>
                        <strong className="text-stone-900 text-sm block font-heading">{r.name}</strong>
                        <span className="text-xs text-stone-600">{r.desc}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setActive(null)} className="border-stone-300">
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setActive(null);
                    onBook();
                  }}
                  className="gold-gradient-btn font-bold"
                >
                  Book OPD
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SpineNavigator;
