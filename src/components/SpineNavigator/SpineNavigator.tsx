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

/** Clean 4-vertebra column (matches simple white-line spine icon). */
function FourVertebraSpine({
  active,
  hovered,
  onSelect,
  onHover,
}: {
  active: SpineModule | null;
  hovered: SpineModule | null;
  onSelect: (id: SpineModule) => void;
  onHover: (id: SpineModule | null) => void;
}) {
  // Four stacked vertebrae — y centers
  const verts = [
    { id: MODULES[0].id, cy: 48 },
    { id: MODULES[1].id, cy: 108 },
    { id: MODULES[2].id, cy: 168 },
    { id: MODULES[3].id, cy: 228 },
  ] as const;

  return (
    <svg viewBox="0 0 120 280" className="w-full max-w-[160px] h-auto mx-auto" aria-hidden="false">
      {verts.map((v, i) => {
        const isHot = active === v.id || hovered === v.id;
        const stroke = isHot ? "#c89b2a" : "#1a3d3d";
        const fill = isHot ? "#f5e8c7" : "#ffffff";
        const cx = 60;
        const cy = v.cy;
        const mod = MODULES[i];
        return (
          <g
            key={v.id}
            role="button"
            tabIndex={0}
            aria-label={mod.label}
            aria-pressed={active === v.id}
            className="cursor-pointer outline-none"
            onClick={() => onSelect(v.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(v.id);
              }
            }}
            onMouseEnter={() => onHover(v.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(v.id)}
            onBlur={() => onHover(null)}
          >
            {/* Hit target */}
            <rect x={10} y={cy - 28} width={100} height={56} fill="transparent" />

            {/* Vertebral body */}
            <path
              d={`
                M ${cx - 28} ${cy - 18}
                Q ${cx - 32} ${cy - 22}, ${cx - 22} ${cy - 24}
                L ${cx + 22} ${cy - 24}
                Q ${cx + 32} ${cy - 22}, ${cx + 28} ${cy - 18}
                L ${cx + 28} ${cy + 18}
                Q ${cx + 32} ${cy + 22}, ${cx + 22} ${cy + 24}
                L ${cx - 22} ${cy + 24}
                Q ${cx - 32} ${cy + 22}, ${cx - 28} ${cy + 18}
                Z
              `}
              fill={fill}
              stroke={stroke}
              strokeWidth={isHot ? 2.5 : 2}
              strokeLinejoin="round"
            />

            {/* Left transverse process */}
            <path
              d={`M ${cx - 28} ${cy - 6} L ${cx - 42} ${cy - 4} Q ${cx - 48} ${cy}, ${cx - 42} ${cy + 4} L ${cx - 28} ${cy + 6}`}
              fill={fill}
              stroke={stroke}
              strokeWidth={isHot ? 2.5 : 2}
              strokeLinejoin="round"
            />
            {/* Right transverse process */}
            <path
              d={`M ${cx + 28} ${cy - 6} L ${cx + 42} ${cy - 4} Q ${cx + 48} ${cy}, ${cx + 42} ${cy + 4} L ${cx + 28} ${cy + 6}`}
              fill={fill}
              stroke={stroke}
              strokeWidth={isHot ? 2.5 : 2}
              strokeLinejoin="round"
            />

            {/* Label to the right */}
            <text
              x={cx + 52}
              y={cy + 4}
              fontSize="11"
              fontWeight="700"
              fill={isHot ? "#96721b" : "#44403c"}
              className="select-none pointer-events-none"
            >
              {mod.label}
            </text>
          </g>
        );
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
      className="relative flex flex-col items-center justify-center min-h-[48vh] bg-gradient-to-b from-[#ffffff] via-[#fcfbf8] to-[#f5f2eb] text-[#1c1917] px-4 py-8 rounded-3xl border border-[#c89b2a]/30 shadow-[0_10px_35px_rgba(200,155,42,0.1)] overflow-hidden"
    >
      <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest mb-3 font-semibold z-10">
        // CLINIC MODULES // SPINE MAP
      </Badge>

      <h2 className="text-2xl sm:text-3xl font-black text-center leading-tight mb-1 font-heading text-[#1c1917] z-10">
        Move Without <span className="gold-text-gradient">Pain.</span>
      </h2>
      <p className="text-stone-600 text-xs text-center max-w-sm mb-4 z-10">
        Tap a vertebra — Services, Credentials, Stories, or Recovery.
      </p>

      <div className="relative w-full max-w-[280px] mx-auto z-10 py-2">
        <FourVertebraSpine
          active={active}
          hovered={hovered}
          onSelect={setActive}
          onHover={setHovered}
        />
      </div>

      <button
        type="button"
        onClick={onBook}
        className="mt-4 rounded-xl px-6 py-2.5 text-sm font-bold gold-gradient-btn flex items-center gap-2 z-10"
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
