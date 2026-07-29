// src/app/services/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  Bone,
  CheckCircle2,
  Compass,
  Dumbbell,
  Flame,
  ShieldAlert,
  Stethoscope,
  Target,
  Trophy,
  Users,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BODY_PARTS } from "@/data/bodyParts";

type NavMode = "sport" | "body";

const SPORTS = [
  {
    id: "cricket",
    sport: "Cricket",
    icon: Trophy,
    injuries: "Rotator Cuff Tears, ACL Twists, Lumbar Stress Fractures",
    approach: "Fast-bowling biomechanics review & shoulder labral repair.",
    relatedParts: ["shoulder", "knee", "spine"],
  },
  {
    id: "football",
    sport: "Football",
    icon: Flame,
    injuries: "ACL/PCL Tears, Meniscus Injuries, Hamstring Pulls",
    approach: "High-impact pivot stabilization & anatomic autograft reconstruction.",
    relatedParts: ["knee", "ankle", "hip"],
  },
  {
    id: "running",
    sport: "Running & Marathons",
    icon: Activity,
    injuries: "Runner's Knee, IT Band Syndrome, Achilles Tendonitis",
    approach: "Gait bio-feedback, footwear alignment & tendon shockwave care.",
    relatedParts: ["knee", "ankle", "hip"],
  },
  {
    id: "gym",
    sport: "Gym & CrossFit",
    icon: Dumbbell,
    injuries: "Shoulder Impingement, Meniscus Flaps, Lower Back Strain",
    approach: "Joint-sparing lifting protocols & arthroscopic repairs.",
    relatedParts: ["shoulder", "knee", "spine"],
  },
  {
    id: "racquet",
    sport: "Badminton & Tennis",
    icon: Zap,
    injuries: "Tennis Elbow, Shoulder SLAP Tears, Ankle Sprains",
    approach: "Overhead racquet arm biomechanics & ligament bracing.",
    relatedParts: ["elbow", "shoulder", "ankle", "wrist"],
  },
  {
    id: "cycling",
    sport: "Cycling",
    icon: Compass,
    injuries: "Patellofemoral Pain, Collarbone Fractures, Hip Bursitis",
    approach: "Saddle-height joint mechanics & trauma fracture fixation.",
    relatedParts: ["knee", "hip", "shoulder"],
  },
];

const CLINICAL_SERVICES = [
  {
    id: "general-checkup",
    type: "general",
    badge: "General Patient Care",
    title: "General Orthopedic Checkup & Joint Consultation",
    desc: "Comprehensive evaluation of joint health, arthritis risk assessment, bone density review, and personalized non-surgical or surgical care plans.",
    stats: "Same-Day OPD Appointment",
    icon: Stethoscope,
    sports: [] as string[],
    parts: [] as string[],
  },
  {
    id: "acl-reconstruction",
    type: "sports",
    badge: "Sports Medicine",
    title: "ACL & Multiligament Reconstruction",
    desc: "Anatomic single and double-bundle ACL & PCL reconstruction using biological autografts engineered for elite athletes and active individuals.",
    stats: "98.5% Return-to-Play Rate",
    icon: Flame,
    sports: ["football", "cricket", "running", "gym"],
    parts: ["knee"],
  },
  {
    id: "arthroscopy",
    type: "sports",
    badge: "Minimally Invasive Keyhole",
    title: "Knee & Shoulder Arthroscopy",
    desc: "Ultra-precise keyhole procedures for meniscus repair, cartilage restoration, Bankart repair, and shoulder stabilization with minimal tissue trauma.",
    stats: "24-Hour Hospital Discharge",
    icon: Zap,
    sports: ["football", "cricket", "gym", "racquet"],
    parts: ["knee", "shoulder"],
  },
  {
    id: "trauma-fractures",
    type: "general",
    badge: "Emergency Trauma",
    title: "Emergency Fracture & Trauma Management",
    desc: "Urgent emergency triage for bone fractures, dislocations, rigid immobilization, plaster casting, and ORIF surgical fixation.",
    stats: "Priority Triage Available",
    icon: ShieldAlert,
    sports: ["cycling", "football"],
    parts: ["ankle", "wrist", "shoulder", "hip"],
  },
  {
    id: "joint-preservation",
    type: "general",
    badge: "Joint Preservation",
    title: "Joint Preservation & Realignment (HTO/OATS)",
    desc: "High Tibial Osteotomy (HTO), OATS, and biological cartilage restoration designed to preserve the native knee and prevent total joint replacement.",
    stats: "Delays Joint Replacement",
    icon: Bone,
    sports: ["running", "gym"],
    parts: ["knee", "hip"],
  },
  {
    id: "pediatric-ortho",
    type: "general",
    badge: "Pediatric Orthopedics",
    title: "Pediatric Growth Plate & Deformity Correction",
    desc: "Specialized pediatric care for growth-plate injuries, knock knees, bow legs, flat feet, and pediatric sports injuries.",
    stats: "Child-Safe Protocols",
    icon: Users,
    sports: [],
    parts: ["knee", "ankle", "hip"],
  },
  {
    id: "sports-rehab",
    type: "rehab",
    badge: "Specialized Rehab",
    title: "Physiotherapy & Athlete Performance Rehab",
    desc: "Dedicated 30-minute private slots (11:00 AM – 1:30 PM & 3:30 PM – 8:30 PM IST) for 5-phase ACL rehab, electrotherapy, and return-to-sport testing.",
    stats: "Dedicated 30-min Slots",
    icon: Dumbbell,
    sports: ["football", "cricket", "running", "gym", "racquet", "cycling"],
    parts: ["knee", "shoulder", "ankle", "hip", "elbow"],
  },
];

export default function ServicesPage() {
  const [mode, setMode] = useState<NavMode>("body");
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    if (mode === "sport" && activeSport) {
      return CLINICAL_SERVICES.filter(
        (s) => s.sports.length === 0 || s.sports.includes(activeSport)
      );
    }
    if (mode === "body" && activePart) {
      return CLINICAL_SERVICES.filter(
        (s) => s.parts.length === 0 || s.parts.includes(activePart)
      );
    }
    return CLINICAL_SERVICES;
  }, [mode, activeSport, activePart]);

  const selectedPart = activePart ? BODY_PARTS.find((p) => p.id === activePart) : null;
  const selectedSport = activeSport ? SPORTS.find((s) => s.id === activeSport) : null;

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-stone-800 font-sans">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#c89b2a]/25">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-[#c89b2a] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#c89b2a]" />
            <span className="font-black text-stone-900">Services</span>
          </div>
          <Link href="/#booking">
            <Button size="sm" className="gold-gradient-btn font-bold text-xs">
              Book OPD
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center space-y-3 mb-10">
          <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3 py-1 text-xs font-mono uppercase tracking-widest font-semibold">
            Clinical Spectrum
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 font-heading">
            Services by Sport &amp; Body Part
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-sm font-medium">
            Explore care pathways the way athletes and patients actually search — filter by sport
            or by anatomical region. Full procedure detail lives here, not on the homepage.
          </p>
        </div>

        {/* Dual navigation toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl border border-[#c89b2a]/40 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setMode("body");
                setActiveSport(null);
              }}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "body"
                  ? "bg-[#c89b2a] text-white shadow"
                  : "text-stone-600 hover:bg-[#f5e8c7]/50"
              }`}
            >
              By Body Part
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("sport");
                setActivePart(null);
              }}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === "sport"
                  ? "bg-[#c89b2a] text-white shadow"
                  : "text-stone-600 hover:bg-[#f5e8c7]/50"
              }`}
            >
              By Sport
            </button>
          </div>
        </div>

        {/* Filter chips */}
        {mode === "body" && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setActivePart(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                !activePart
                  ? "bg-[#c89b2a] text-white border-[#c89b2a]"
                  : "bg-white border-[#c89b2a]/40 text-stone-700 hover:bg-[#f5e8c7]/40"
              }`}
            >
              All regions
            </button>
            {BODY_PARTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePart(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activePart === p.id
                    ? "bg-[#c89b2a] text-white border-[#c89b2a]"
                    : "bg-white border-[#c89b2a]/40 text-stone-700 hover:bg-[#f5e8c7]/40"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {mode === "sport" && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setActiveSport(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                !activeSport
                  ? "bg-[#c89b2a] text-white border-[#c89b2a]"
                  : "bg-white border-[#c89b2a]/40 text-stone-700 hover:bg-[#f5e8c7]/40"
              }`}
            >
              All sports
            </button>
            {SPORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSport(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activeSport === s.id
                    ? "bg-[#c89b2a] text-white border-[#c89b2a]"
                    : "bg-white border-[#c89b2a]/40 text-stone-700 hover:bg-[#f5e8c7]/40"
                }`}
              >
                {s.sport}
              </button>
            ))}
          </div>
        )}

        {/* Context panel when a filter is active */}
        {selectedPart && (
          <div className="mb-10 rounded-2xl border border-[#c89b2a]/30 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
              <div>
                <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 text-[11px] font-mono mb-2">
                  {selectedPart.subtitle}
                </Badge>
                <h2 className="text-2xl font-black text-stone-900 font-heading">{selectedPart.label}</h2>
                <p className="text-sm text-[#96721b] font-semibold mt-1">{selectedPart.short}</p>
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold mb-2">
                  Procedures by Dr. Amit Jha
                </h3>
                <ul className="space-y-1.5">
                  {selectedPart.procedures.map((proc) => (
                    <li key={proc} className="flex gap-2 text-sm text-stone-800">
                      <CheckCircle2 className="h-4 w-4 text-[#c89b2a] shrink-0 mt-0.5" />
                      {proc}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold mb-2">
                  Treated conditions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPart.conditions.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg bg-[#f5f2eb] border border-stone-200 text-xs font-semibold text-stone-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedSport && (
          <div className="mb-10 rounded-2xl border border-[#c89b2a]/30 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#f5e8c7]/60 border border-[#c89b2a]/30 flex items-center justify-center text-[#c89b2a]">
                <selectedSport.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-stone-900 font-heading">{selectedSport.sport}</h2>
                <p className="text-sm text-stone-700 mt-1">
                  <strong>Common injuries:</strong> {selectedSport.injuries}
                </p>
                <p className="text-sm text-[#96721b] font-semibold mt-1">
                  Care approach: {selectedSport.approach}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Service cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <article
                key={srv.id}
                className="bg-white border border-[#c89b2a]/30 hover:border-[#c89b2a]/60 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <Badge className="w-fit text-[11px] font-mono mb-3 bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 font-semibold">
                    {srv.badge}
                  </Badge>
                  <div className="h-10 w-10 rounded-xl bg-[#f5e8c7]/50 border border-[#c89b2a]/30 flex items-center justify-center text-[#c89b2a] mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base text-stone-900 font-bold font-heading leading-snug mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">{srv.desc}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#96721b] pt-3 border-t border-stone-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#c89b2a]" />
                  {srv.stats}
                </div>
              </article>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <p className="text-center text-stone-500 py-12 text-sm">
            No services match this filter. Try another sport or body region.
          </p>
        )}

        <div className="mt-14 text-center">
          <Link href="/#booking">
            <Button size="lg" className="gold-gradient-btn font-black px-8">
              Book OPD Appointment
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
