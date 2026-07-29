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
  /** 0 = top of visible spine, 1 = bottom */
  y: number;
}[] = [
  { id: "services", label: "Services", short: "Surgeries & care pathways", icon: Stethoscope, y: 0.2 },
  { id: "credentials", label: "Credentials", short: "Dr. Amit Kumar Jha", icon: Award, y: 0.4 },
  { id: "stories", label: "Patient Stories", short: "Verified outcomes", icon: Star, y: 0.6 },
  { id: "recovery", label: "Recovery Plans", short: "6-stage continuum", icon: Activity, y: 0.8 },
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

/**
 * Spine illustration matching the provided artwork:
 * rear 3/4 silhouette, dumbbell-style vertebrae, soft green intervertebral discs.
 */
function SpineIllustration() {
  const stroke = "#1e4a4a";
  const vertebra = "#1a3d3d";
  const disc = "#86efac";

  // Dumbbell vertebra: two lobes + thin bridge (as in reference)
  const Vert = ({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) => {
    const rx = 9 * scale;
    const ry = 5.5 * scale;
    const gap = 11 * scale;
    return (
      <g>
        <ellipse cx={cx - gap / 2} cy={cy} rx={rx} ry={ry} fill={vertebra} />
        <ellipse cx={cx + gap / 2} cy={cy} rx={rx} ry={ry} fill={vertebra} />
        <rect x={cx - 3 * scale} y={cy - 2 * scale} width={6 * scale} height={4 * scale} rx={1} fill={vertebra} />
      </g>
    );
  };

  // Spine Y positions (cervical → lumbar), slight curve to the left like the art
  const spineYs = [95, 118, 141, 164, 187, 210, 233, 256, 279, 302, 325, 348, 370];
  const spineX = (i: number) => 108 + Math.sin(i * 0.35) * 3;

  return (
    <svg
      viewBox="0 0 220 420"
      className="w-full h-full"
      aria-hidden="true"
      fill="none"
    >
      {/* Outer silhouette — head, neck, shoulders, back, arms (rear 3/4, matching reference) */}
      <path
        d="
          M 95 28
          C 78 30, 68 48, 70 68
          C 71 82, 74 92, 78 100
          C 55 108, 32 128, 28 155
          C 26 170, 30 185, 36 198
          L 42 210
          C 38 240, 42 280, 52 320
          C 58 345, 68 375, 78 400
          L 95 400
          L 95 360
          C 95 340, 96 320, 98 300
          C 100 280, 102 260, 104 240
          C 106 220, 108 200, 110 180
          C 112 160, 114 140, 116 120
          C 118 110, 122 102, 130 98
          C 155 108, 178 130, 182 160
          C 184 175, 180 190, 174 202
          L 168 212
          C 172 245, 168 285, 158 325
          C 152 350, 142 380, 132 400
          L 115 400
          C 125 370, 135 340, 140 310
          C 145 280, 148 250, 148 220
          C 148 195, 146 175, 142 155
          C 138 130, 128 112, 118 102
          C 122 88, 124 72, 122 58
          C 120 40, 110 28, 95 28
          Z
        "
        stroke={stroke}
        strokeWidth="2.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        opacity="0.92"
      />

      {/* Inner back contour lines (subtle, like reference muscle lines) */}
      <path
        d="M 88 130 C 90 180, 92 240, 96 300 C 98 330, 100 360, 102 390"
        stroke={stroke}
        strokeWidth="1.25"
        opacity="0.25"
      />
      <path
        d="M 128 125 C 126 180, 124 240, 122 300 C 121 330, 120 360, 118 390"
        stroke={stroke}
        strokeWidth="1.25"
        opacity="0.25"
      />

      {/* Vertebrae (dumbbell) alternating with green discs */}
      {spineYs.map((y, i) => {
        const x = spineX(i);
        const isDisc = i % 2 === 1;
        if (isDisc) {
          return <circle key={`d-${i}`} cx={x} cy={y} r={4.2} fill={disc} opacity={0.95} />;
        }
        const scale = i < 2 ? 0.75 : i > 10 ? 0.85 : 1;
        return <Vert key={`v-${i}`} cx={x} cy={y} scale={scale} />;
      })}
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
      className="relative flex flex-col items-center justify-center min-h-[52vh] bg-gradient-to-b from-[#ffffff] via-[#fcfbf8] to-[#f5f2eb] text-[#1c1917] px-4 py-8 rounded-3xl border border-[#c89b2a]/30 shadow-[0_10px_35px_rgba(200,155,42,0.1)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial from-[#d4af37]/10 via-transparent to-transparent opacity-70 pointer-events-none" />

      <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest mb-3 font-semibold z-10">
        // CLINIC MODULES // SPINE MAP
      </Badge>

      <h2 className="text-2xl sm:text-3xl font-black text-center leading-tight mb-1 font-heading text-[#1c1917] z-10">
        Move Without <span className="gold-text-gradient">Pain.</span>
      </h2>
      <p className="text-stone-600 text-xs text-center max-w-sm mb-2 z-10">
        Tap a vertebra to open Services, Credentials, Stories, or Recovery.
      </p>

      {/* Illustration + hit targets */}
      <div className="relative w-full max-w-[260px] h-[360px] mx-auto z-10">
        <SpineIllustration />

        {MODULES.map((m) => {
          // Align markers over the illustrated spine column (slightly right of center)
          const topPct = `${18 + m.y * 62}%`;
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
              className="absolute left-[49%] -translate-x-1/2 z-20 flex flex-col items-center group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-full"
              style={{ top: topPct }}
            >
              <span
                className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  isHot
                    ? "w-10 h-10 bg-[#c89b2a] border-white shadow-[0_0_14px_rgba(200,155,42,0.55)] scale-110"
                    : "w-8 h-8 bg-[#1a3d3d] border-[#86efac]/80 hover:scale-105"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isHot ? "text-white" : "text-[#86efac]"}`} />
              </span>
              <span
                className={`mt-0.5 whitespace-nowrap text-[9px] font-bold px-1.5 py-0.5 rounded-md border shadow-sm transition-opacity ${
                  isHot
                    ? "bg-white border-[#c89b2a] text-stone-900 opacity-100"
                    : "bg-white/95 border-stone-200 text-stone-600 opacity-90"
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
        className="mt-3 rounded-xl px-6 py-2.5 text-sm font-bold gold-gradient-btn flex items-center gap-2 z-10"
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
