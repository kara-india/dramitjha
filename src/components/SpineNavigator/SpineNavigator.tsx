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
  /** Approximate Y position along the spine (0 = top cervical, 1 = bottom sacral) */
  y: number;
}[] = [
  { id: "services", label: "Services", short: "Surgeries & care pathways", icon: Stethoscope, y: 0.18 },
  { id: "credentials", label: "Credentials", short: "Dr. Amit Kumar Jha", icon: Award, y: 0.38 },
  { id: "stories", label: "Patient Stories", short: "Verified outcomes", icon: Star, y: 0.58 },
  { id: "recovery", label: "Recovery Plans", short: "6-stage continuum", icon: Activity, y: 0.78 },
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
    quote: "Dr. Amit Jha diagnosed my ACL tear instantly. The anatomic reconstruction and guided rehab got me back on the pitch in 6 months with 100% knee stability!",
  },
  {
    name: "Smt. Sunita Devi",
    role: "General Patient (Age 54)",
    type: "Knee Arthritis & Joint Preservation",
    quote: "I was struggling with severe knee pain for 3 years. Dr. Amit Jha's joint preservation checkup gave me back smooth, painless walking without knee replacement.",
  },
  {
    name: "Vikramaditya Singh",
    role: "Marathon Runner",
    type: "Meniscus Repair & Cartilage Care",
    quote: "The best sports injury specialist in Poorvanchal. Keyhole surgery, minimal scar, negligible pain, and a highly scientific return-to-running protocol.",
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

/** Decorative vertebra shapes along the spine path */
function VertebraShape({ cx, cy, major }: { cx: number; cy: number; major?: boolean }) {
  const w = major ? 14 : 10;
  const h = major ? 8 : 6;
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={w}
      ry={h}
      fill={major ? "#1e3a3a" : "#2d4a4a"}
      stroke={major ? "#c89b2a" : "#3d5a5a"}
      strokeWidth={major ? 1.5 : 1}
    />
  );
}

export const SpineNavigator: FC<SpineNavigatorProps> = ({ onBook }) => {
  const [active, setActive] = useState<SpineModule | null>(null);
  const [hovered, setHovered] = useState<SpineModule | null>(null);

  const activeMeta = MODULES.find((m) => m.id === active);

  return (
    <section
      aria-label="Clinic modules along the spine"
      className="relative flex flex-col items-center justify-center min-h-[52vh] bg-gradient-to-b from-[#ffffff] via-[#fcfbf8] to-[#f5f2eb] text-[#1c1917] px-4 py-8 rounded-3xl border border-[#c89b2a]/30 shadow-[0_10px_35px_rgba(200,155,42,0.1)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial from-[#d4af37]/10 via-transparent to-transparent opacity-70 pointer-events-none" />

      <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest mb-4 font-semibold z-10">
        // CLINIC MODULES // SPINE MAP
      </Badge>

      <h2 className="text-2xl sm:text-3xl font-black text-center leading-tight mb-1 font-heading text-[#1c1917] z-10">
        Move Without <span className="gold-text-gradient">Pain.</span>
      </h2>
      <p className="text-stone-600 text-xs text-center max-w-sm mb-4 z-10">
        Tap a vertebra to open Services, Credentials, Stories, or Recovery — content lives here, not duplicated on the page.
      </p>

      {/* Spine illustration */}
      <div className="relative w-full max-w-[280px] h-[340px] mx-auto z-10">
        <svg viewBox="0 0 200 420" className="w-full h-full" aria-hidden="true">
          {/* Silhouette torso outline (simplified from reference) */}
          <path
            d="M100 20
               C70 25 55 55 52 90
               C48 120 42 150 38 175
               C35 200 40 230 48 260
               C55 290 65 320 78 350
               C88 370 95 390 100 410
               C105 390 112 370 122 350
               C135 320 145 290 152 260
               C160 230 165 200 162 175
               C158 150 152 120 148 90
               C145 55 130 25 100 20 Z"
            fill="none"
            stroke="#1e3a3a"
            strokeWidth="2.5"
            opacity="0.85"
          />
          {/* Shoulder lines */}
          <path d="M52 95 C30 100 18 130 22 165" fill="none" stroke="#1e3a3a" strokeWidth="2" opacity="0.7" />
          <path d="M148 95 C170 100 182 130 178 165" fill="none" stroke="#1e3a3a" strokeWidth="2" opacity="0.7" />

          {/* Spine curve path */}
          <path
            id="spine-path"
            d="M100 70 C98 110 102 150 100 190 C98 230 102 270 100 310 C99 340 100 370 100 395"
            fill="none"
            stroke="#1e3a3a"
            strokeWidth="3"
            opacity="0.4"
          />

          {/* Decorative minor vertebrae */}
          {[0.08, 0.28, 0.48, 0.68, 0.88].map((t, i) => {
            const y = 70 + t * 325;
            return <VertebraShape key={`minor-${i}`} cx={100} cy={y} />;
          })}

          {/* Soft intervertebral discs (green dots from reference) */}
          {[0.13, 0.23, 0.33, 0.43, 0.53, 0.63, 0.73, 0.83].map((t, i) => {
            const y = 70 + t * 325;
            return <circle key={`disc-${i}`} cx={100} cy={y} r={3.5} fill="#86efac" opacity={0.9} />;
          })}
        </svg>

        {/* Clickable major vertebrae overlays */}
        {MODULES.map((m) => {
          const topPct = `${12 + m.y * 72}%`;
          const isHot = hovered === m.id || active === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              aria-label={`Open ${m.label}`}
              aria-pressed={active === m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(m.id)}
              onBlur={() => setHovered(null)}
              onClick={() => setActive(m.id)}
              className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-full"
              style={{ top: topPct }}
            >
              <span
                className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  isHot
                    ? "w-11 h-11 bg-[#c89b2a] border-white shadow-[0_0_16px_rgba(200,155,42,0.55)] scale-110"
                    : "w-9 h-9 bg-[#1e3a3a] border-[#c89b2a]/60 hover:scale-105"
                }`}
              >
                <Icon className={`h-4 w-4 ${isHot ? "text-white" : "text-[#86efac]"}`} />
              </span>
              <span
                className={`mt-1 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-sm transition-opacity ${
                  isHot
                    ? "bg-white border-[#c89b2a] text-stone-900 opacity-100"
                    : "bg-white/90 border-stone-200 text-stone-600 opacity-80"
                }`}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBook}
        className="mt-4 rounded-xl px-6 py-2.5 text-sm font-bold gold-gradient-btn flex items-center gap-2 z-10"
      >
        <Calendar className="h-4 w-4" />
        Book Appointment
      </button>

      {/* Module panel */}
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
