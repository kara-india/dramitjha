"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  MapPin,
  CheckCircle2,
  Award,
  Star,
  Users,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  ArrowRight,
  Bone,
  Flame,
  Zap,
  ShieldAlert,
  Dumbbell,
  Target,
  Trophy,
  Compass,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ─── DATA ──────────────────────────────────────────────────────────────────

const BODY_PARTS = [
  {
    id: "knee",
    name: "Knee Joint",
    icon: Flame,
    subtitle: "ACL, Meniscus & Cartilage",
    conditions: [
      "ACL & PCL Ligament Tears",
      "Meniscus Radial & Bucket-Handle Tears",
      "Cartilage Defect & Osteochondritis",
      "Knee Osteoarthritis & Patellar Instability",
    ],
    solution:
      "Anatomic Single/Double Bundle Reconstruction, Keyhole Arthroscopy, HTO Joint Preservation",
    recovery: "Return to Sport in 6–9 Months",
  },
  {
    id: "shoulder",
    name: "Shoulder Joint",
    icon: Zap,
    subtitle: "Instability, Labrum & Rotator Cuff",
    conditions: [
      "Recurrent Shoulder Dislocation (Bankart Lesion)",
      "Rotator Cuff Tear & Tendonitis",
      "SLAP Tear & Frozen Shoulder",
      "Acromioclavicular (AC) Joint Sprains",
    ],
    solution:
      "Arthroscopic Bankart Repair, Rotator Cuff Anchoring, Capsular Shift",
    recovery: "Full Overhead Motion in 3–4 Months",
  },
  {
    id: "elbow-wrist",
    name: "Elbow & Wrist",
    icon: Target,
    subtitle: "Tennis Elbow & Tendon Injuries",
    conditions: [
      "Lateral Epicondylitis (Tennis Elbow)",
      "Golfer's Elbow & UCL Tears",
      "TFCC Wrist Complex Tears",
      "Carpal Tunnel Syndrome",
    ],
    solution:
      "Biological Injections, Tendon Release, Arthroscopic Wrist Debridement",
    recovery: "Functional Mobility in 4–6 Weeks",
  },
  {
    id: "hip-spine",
    name: "Hip & Spine",
    icon: Bone,
    subtitle: "Joint Pain & Core Misalignment",
    conditions: [
      "Femoroacetabular Impingement (FAI)",
      "Hip Labral Tears & Bursitis",
      "Lumbar Strain & Lower Back Pain",
      "Sacroiliac (SI) Joint Dysfunction",
    ],
    solution:
      "Hip Arthroscopy, Core Biomechanical Realignment, Targeted Rehab",
    recovery: "Pain-Free Activity",
  },
  {
    id: "ankle-foot",
    name: "Ankle & Foot",
    icon: Compass,
    subtitle: "Ligament Sprains & Achilles Care",
    conditions: [
      "ATFL / CFL Ankle Ligament Sprains",
      "Achilles Tendon Rupture & Tendonitis",
      "Plantar Fasciitis & Heel Spurs",
      "Ankle Impingement & Instability",
    ],
    solution:
      "Ankle Arthroscopy, Ligament Reconstruction, Achilles Repair",
    recovery: "Impact Readiness in 8–12 Weeks",
  },
  {
    id: "pediatric",
    name: "Pediatric & Growth Plate",
    icon: Users,
    subtitle: "Child Bone & Deformity Care",
    conditions: [
      "Pediatric Ligament Injuries",
      "Knock Knees (Genu Valgum) & Bow Legs",
      "Flat Feet & Clubfoot Deformity",
      "Growth Plate Fractures & Alignment Issues",
    ],
    solution:
      "Growth-Plate Sparing Repair, Deformity Correction, Custom Bracing",
    recovery: "Child-Safe Protocol",
  },
];

const SPORTS_WE_TREAT = [
  {
    sport: "Cricket",
    icon: Trophy,
    injuries: "Rotator Cuff Tears, ACL Twists, Lumbar Stress Fractures",
    approach:
      "Fast-bowling biomechanics review & shoulder labral repair.",
  },
  {
    sport: "Football",
    icon: Flame,
    injuries: "ACL/PCL Tears, Meniscus Injuries, Hamstring Pulls",
    approach:
      "High-impact pivot stabilization & anatomic autograft reconstruction.",
  },
  {
    sport: "Running & Marathons",
    icon: Activity,
    injuries: "Runner's Knee, IT Band Syndrome, Achilles Tendonitis",
    approach:
      "Gait bio-feedback, footwear alignment & tendon shockwave care.",
  },
  {
    sport: "Gym & CrossFit",
    icon: Dumbbell,
    injuries: "Shoulder Impingement, Meniscus Flaps, Lower Back Strain",
    approach: "Joint-sparing lifting protocols & arthroscopic repairs.",
  },
  {
    sport: "Badminton & Tennis",
    icon: Zap,
    injuries: "Tennis Elbow, Shoulder SLAP Tears, Ankle Sprains",
    approach:
      "Overhead racquet arm biomechanics & ligament bracing.",
  },
  {
    sport: "Cycling",
    icon: Compass,
    injuries: "Patellofemoral Pain, Collarbone Fractures, Hip Bursitis",
    approach:
      "Saddle-height joint mechanics & trauma fracture fixation.",
  },
];

const SERVICES = [
  {
    id: "general-checkup",
    type: "general",
    badge: "General Patient Care",
    title: "General Orthopedic Checkup & Joint Consultation",
    desc: "Comprehensive evaluation of joint health, arthritis risk assessment, bone density review, and personalized non-surgical or surgical care plans.",
    stats: "Same-Day OPD Appointment",
    icon: Stethoscope,
  },
  {
    id: "acl-reconstruction",
    type: "sports",
    badge: "Sports Medicine",
    title: "ACL & Multiligament Reconstruction",
    desc: "Anatomic single and double-bundle ACL & PCL reconstruction using biological autografts engineered for elite athletes and active individuals.",
    stats: "98.5% Return-to-Play Rate",
    icon: Flame,
  },
  {
    id: "arthroscopy",
    type: "sports",
    badge: "Minimally Invasive Keyhole",
    title: "Knee & Shoulder Arthroscopy",
    desc: "Ultra-precise keyhole procedures for meniscus repair, cartilage restoration, Bankart repair, and shoulder stabilization with minimal tissue trauma.",
    stats: "24-Hour Hospital Discharge",
    icon: Zap,
  },
  {
    id: "trauma-fractures",
    type: "general",
    badge: "Emergency Trauma",
    title: "Emergency Fracture & Trauma Management",
    desc: "Urgent emergency triage for bone fractures, dislocations, rigid immobilization, plaster casting, and ORIF surgical fixation.",
    stats: "Priority Triage Available",
    icon: ShieldAlert,
  },
  {
    id: "joint-preservation",
    type: "general",
    badge: "Joint Preservation",
    title: "Joint Preservation & Realignment (HTO/OATS)",
    desc: "High Tibial Osteotomy (HTO), OATS, and biological cartilage restoration designed to preserve the native knee and prevent total joint replacement.",
    stats: "Delays Joint Replacement",
    icon: Bone,
  },
  {
    id: "pediatric-ortho",
    type: "general",
    badge: "Pediatric Orthopedics",
    title: "Pediatric Growth Plate & Deformity Correction",
    desc: "Specialized pediatric care for growth-plate injuries, knock knees, bow legs, flat feet, and pediatric sports injuries.",
    stats: "Child-Safe Protocols",
    icon: Users,
  },
  {
    id: "sports-rehab",
    type: "rehab",
    badge: "Specialized Rehab",
    title: "Physiotherapy & Athlete Performance Rehab",
    desc: "Dedicated 30-minute private slots (11:00 AM – 1:30 PM & 3:30 PM – 8:30 PM IST) for 5-phase ACL rehab, electrotherapy, and return-to-sport testing.",
    stats: "Dedicated 30-min Slots",
    icon: Dumbbell,
  },
];

const RECOVERY_STAGES = [
  {
    stage: "01",
    name: "Symptom & Pain Assessment",
    desc: "Initial physical examination, range of motion & joint stability testing.",
  },
  {
    stage: "02",
    name: "Precision Bio-Imaging",
    desc: "High-resolution MRI & digital X-ray review for exact anatomical mapping.",
  },
  {
    stage: "03",
    name: "Targeted Treatment Plan",
    desc: "Tailored choice between biological preservation or keyhole surgery.",
  },
  {
    stage: "04",
    name: "Minimally Invasive Surgery",
    desc: "Keyhole arthroscopy with 24-hr discharge and minimal tissue disruption.",
  },
  {
    stage: "05",
    name: "Guided 5-Phase Physiotherapy",
    desc: "Private 30-min rehab slots, ROM expansion & progressive muscle building.",
  },
  {
    stage: "06",
    name: "Return to Sport Clearance",
    desc: "Biomechanical testing and athletic clearance for 100% field readiness.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh K. Verma",
    role: "State Level Footballer",
    type: "ACL Reconstruction",
    quote:
      "Dr. Amit Jha diagnosed my ACL tear instantly. The anatomic reconstruction and guided rehab got me back on the pitch in 6 months with 100% knee stability!",
    rating: 5,
  },
  {
    name: "Smt. Sunita Devi",
    role: "General Patient (Age 54)",
    type: "Knee Arthritis & Joint Preservation",
    quote:
      "I was struggling with severe knee pain for 3 years. Dr. Amit Jha's joint preservation checkup gave me back smooth, painless walking without knee replacement.",
    rating: 5,
  },
  {
    name: "Vikramaditya Singh",
    role: "Marathon Runner",
    type: "Meniscus Repair & Cartilage Care",
    quote:
      "The best sports injury specialist in Poorvanchal. Keyhole surgery, minimal scar, negligible pain, and a highly scientific return-to-running protocol.",
    rating: 5,
  },
];

const TIME_SLOTS = [
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── COMPONENT ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [selectedBodyPart, setSelectedBodyPart] = useState(BODY_PARTS[0]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Booking state
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(
    "General Orthopedic Checkup & Joint Consultation"
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [complaint, setComplaint] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div
      className="min-h-screen bg-[#102321] text-slate-300 font-sans selection:bg-[#d5f14c] selection:text-[#102321] relative overflow-x-hidden"
      role="main"
    >
      {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 glass-header border-b border-slate-800/80"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm">
            <div
              className="h-10 w-10 rounded-xl bg-[#d5f14c] flex items-center justify-center text-[#102321] font-black shadow-lg"
              aria-hidden="true"
            >
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                Dr. Amit Jha
              </span>
              <span className="text-[10px] font-mono text-teal-400 tracking-wider uppercase mt-0.5">
                Sports Medicine Clinic
              </span>
            </div>
          </a>

          {/* Live Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#d5f14c] animate-pulse" aria-hidden="true" />
            <span className="text-slate-300 font-medium">OPD QUEUE ACTIVE</span>
            <span className="text-slate-600">•</span>
            <span className="text-teal-400 font-bold">11:00 AM – 8:30 PM</span>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300"
            aria-label="Primary navigation"
          >
            <a href="#about" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm px-1">About</a>
            <a href="#navigator" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm px-1">Body Navigator</a>
            <a href="#sports" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm px-1">Sports We Treat</a>
            <a href="#services" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm px-1">Services</a>
            <a href="#booking" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm px-1">Book OPD</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-900/80 border border-slate-800 text-xs font-mono focus-visible:ring-2 focus-visible:ring-[#d5f14c]"
                aria-label="Staff ERP Portal login"
              >
                Staff ERP
              </Button>
            </Link>
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-slate-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <nav
            id="mobile-nav"
            className="lg:hidden bg-[#102321]/95 backdrop-blur-xl border-t border-slate-800 px-6 py-4 flex flex-col gap-4 text-sm font-semibold"
            aria-label="Mobile navigation"
          >
            {["#about", "#navigator", "#sports", "#services", "#booking"].map(
              (href) => (
                <a
                  key={href}
                  href={href}
                  className="text-slate-300 hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm py-1 capitalize"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {href.replace("#", "").replace("-", " ")}
                </a>
              )
            )}
          </nav>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-[#102321] border-b border-slate-800/80"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center lg:text-left space-y-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-4">
            <Badge className="bg-teal-900/40 text-teal-300 border-teal-700/50 px-3.5 py-1 text-xs font-mono uppercase tracking-widest">
              // CLINICAL PRECISION // VARANASI OPD
            </Badge>
            <h1
              id="hero-heading"
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]"
            >
              Recover Faster.{" "}
              <br />
              <span className="text-teal-400">Move Better.</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Specialized keyhole arthroscopy, ACL reconstruction, joint preservation &amp; comprehensive sports rehabilitation tailored to get you back to peak activity safely.
            </p>
          </motion.div>

          {/* Precision Credibility Metrics */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1 text-xs sm:text-sm font-semibold text-slate-300"
            aria-label="Dr. Amit Jha credentials"
          >
            <span className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800/80 font-mono text-slate-300 flex items-center gap-2">
              <Award className="h-4 w-4 text-[#d5f14c]" aria-hidden="true" />
              FNB Sports Medicine (Ganga Hospital)
            </span>
            <span className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800/80 font-mono text-amber-400 flex items-center gap-1.5">
              4.9{" "}
              <Star
                className="h-3.5 w-3.5 fill-amber-400"
                aria-hidden="true"
              />{" "}
              Google Rating
            </span>
            <span className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800/80 font-mono text-teal-400">
              5,000+ Surgeries
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a href="#booking" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black text-base px-8 h-13 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#102321]"
                aria-label="Book an OPD appointment with Dr. Amit Jha"
              >
                Book OPD Appointment
              </Button>
            </a>
            <a href="#doctor-signature" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white h-13 px-6 focus-visible:ring-2 focus-visible:ring-[#d5f14c]"
                aria-label="View Dr. Amit Jha's credentials and qualifications"
              >
                View Credentials
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST ANCHORS (Instrumentation Metric Bar) ───────────────────── */}
      <section
        className="py-10 bg-slate-950 border-b border-slate-800/80"
        aria-label="Clinical outcomes and trust statistics"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.dl
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              { value: "5,000+", label: "SURGICAL PROCEDURES", sub: "Anatomic Precision", accent: "text-white" },
              { value: "98.5%", label: "RETURN-TO-SPORT", sub: "ACL & Arthroscopy", accent: "text-teal-400" },
              { value: "4.9★", label: "GOOGLE RATING", sub: "500+ Verified Reviews", accent: "text-[#d5f14c]" },
              { value: "24-HR", label: "DISCHARGE TIME", sub: "Keyhole Minimally Invasive", accent: "text-white" },
            ].map(({ value, label, sub, accent }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between space-y-2 hover:border-teal-500/30 transition-all duration-300"
              >
                <dt className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">{label}</dt>
                <dd className={`text-3xl sm:text-4xl font-black font-heading ${accent}`}>{value}</dd>
                <span className="text-xs text-slate-400 font-medium">{sub}</span>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ── BODY NAVIGATOR ─────────────────────────────────────────────── */}
      <section
        id="navigator"
        className="py-20 bg-[#102321] border-b border-slate-800/80"
        aria-labelledby="navigator-heading"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center space-y-4 mb-12"
          >
            <Badge className="bg-teal-900/40 text-teal-300 border-teal-700/50 px-3 py-1 text-xs font-mono uppercase tracking-widest">
              DIAGNOSTIC ARCHITECTURE
            </Badge>
            <h2
              id="navigator-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              Interactive Body-Part Selector
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Click on an affected joint or anatomical area to explore common
              conditions and our treatment approach.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Body part list */}
            <div
              className="lg:col-span-5 space-y-3"
              role="listbox"
              aria-label="Select body part"
              aria-activedescendant={`bodypart-${selectedBodyPart.id}`}
            >
              {BODY_PARTS.map((bp, idx) => {
                const Icon = bp.icon;
                const isSelected = selectedBodyPart.id === bp.id;
                return (
                  <motion.div
                    key={bp.id}
                    id={`bodypart-${bp.id}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={idx}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onClick={() => setSelectedBodyPart(bp)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedBodyPart(bp);
                      }
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#d5f14c] ${
                      isSelected
                        ? "bg-slate-900 border-teal-400 text-white shadow-xl"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-teal-400 text-[#102321]"
                              : "bg-slate-800 text-teal-400"
                          }`}
                          aria-hidden="true"
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">{bp.name}</h3>
                          <p className="text-xs text-slate-400">{bp.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${
                          isSelected
                            ? "translate-x-1 text-teal-400"
                            : "text-slate-600"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Condition detail panel */}
            <div className="lg:col-span-7" aria-live="polite" aria-atomic="true">
              <motion.div
                key={selectedBodyPart.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <h3 className="text-2xl font-black text-white font-heading">
                      {selectedBodyPart.name} Conditions
                    </h3>
                    <Badge className="bg-teal-950/80 text-teal-300 border-teal-700/50 text-xs font-mono">
                      {selectedBodyPart.recovery}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                      // COMMONLY DIAGNOSED CONDITIONS
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-3" role="list">
                      {selectedBodyPart.conditions.map((cond, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 bg-[#0c1a18] p-3 rounded-xl border border-slate-800/80 text-xs font-medium text-slate-200"
                        >
                          <CheckCircle2
                            className="h-4 w-4 text-teal-400 shrink-0"
                            aria-hidden="true"
                          />
                          {cond}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                      // CLINICAL TREATMENT APPROACH
                    </h4>
                    <p className="text-sm text-teal-300 font-semibold leading-relaxed">
                      {selectedBodyPart.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPORTS WE TREAT ────────────────────────────────────────────── */}
      <section
        id="sports"
        className="py-20 bg-slate-950 border-b border-slate-800/80"
        aria-labelledby="sports-heading"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center space-y-4 mb-16"
          >
            <Badge className="bg-teal-900/40 text-teal-300 border-teal-700/50 px-3 py-1 text-xs font-mono uppercase tracking-widest">
              ATHLETIC PROTOCOLS
            </Badge>
            <h2
              id="sports-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              Sports We Treat
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Specialist protocols for every athletic discipline — from elite
              competition to weekend recreation.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SPORTS_WE_TREAT.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={idx} variants={fadeUp} className="h-full">
                  <div className="glass-card border border-slate-800/80 hover:border-teal-500/40 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between h-full group">
                    <div>
                      <div
                        className="h-12 w-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-teal-400 mb-4 group-hover:border-teal-500/50 transition-colors"
                        aria-hidden="true"
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl text-white font-bold font-heading mb-3">
                        {item.sport}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        <strong className="text-slate-200">Common Injuries:</strong> {item.injuries}
                      </p>
                    </div>
                    <p className="text-xs text-teal-400 font-semibold pt-3 border-t border-slate-800/80">
                      <strong className="text-teal-300">Care Approach:</strong> {item.approach}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────── */}
      <section
        id="services"
        className="py-20 bg-[#102321] border-b border-slate-800/80"
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center space-y-4 mb-16"
          >
            <Badge className="bg-teal-900/40 text-teal-300 border-teal-700/50 px-3 py-1 text-xs font-mono uppercase tracking-widest">
              CLINICAL SPECTRUM
            </Badge>
            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              Our Services
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Dual-spectrum care covering both general orthopedic patients and
              elite athletes — under one roof.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SERVICES.map((srv) => {
              const Icon = srv.icon;
              return (
                <motion.div key={srv.id} variants={fadeUp}>
                  <div className="glass-card border border-slate-800/80 hover:border-teal-500/40 transition-all duration-300 rounded-2xl p-6 h-full flex flex-col justify-between group">
                    <div>
                      <Badge
                        className="w-fit text-[11px] font-mono mb-3 bg-teal-950/60 text-teal-300 border-teal-800/60"
                        aria-label={`Service category: ${srv.badge}`}
                      >
                        {srv.badge}
                      </Badge>
                      <div
                        className="h-10 w-10 rounded-xl bg-[#0c1a18] border border-slate-800 flex items-center justify-center text-teal-400 mb-3 group-hover:border-teal-500/50 transition-colors"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base text-white font-bold font-heading leading-snug mb-2">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {srv.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#d5f14c] pt-3 border-t border-slate-800/80">
                      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {srv.stats}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── RECOVERY JOURNEY ───────────────────────────────────────────── */}
      <section
        className="py-20 bg-slate-950 border-b border-slate-800/80"
        aria-labelledby="recovery-heading"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center space-y-4 mb-16"
          >
            <Badge className="bg-teal-900/40 text-teal-300 border-teal-700/50 px-3 py-1 text-xs font-mono uppercase tracking-widest">
              INSTRUMENTED CONTINUUM
            </Badge>
            <h2
              id="recovery-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              Your Recovery Journey
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              A clear 6-stage pathway from pain to peak performance — fully
              transparent, evidence-based.
            </p>
          </motion.div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="6-stage recovery process"
          >
            {RECOVERY_STAGES.map((stage) => (
              <motion.li
                key={stage.stage}
                variants={fadeUp}
                className="glass-card border border-slate-800/80 rounded-2xl p-6 flex gap-4 hover:border-teal-500/30 transition-all duration-300"
              >
                <span
                  className="text-3xl sm:text-4xl font-black font-heading text-[#d5f14c] leading-none shrink-0 select-none"
                  aria-hidden="true"
                >
                  {stage.stage}
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm font-heading mb-1">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ── DOCTOR BIO / PROFILE SECTION ───────────────────────────────── */}
      <section
        id="doctor-signature"
        className="py-20 lg:py-28 bg-[#102321] border-b border-slate-800/80 relative overflow-hidden"
        aria-labelledby="doctor-heading"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column: Columns 1-7 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-800/60 text-teal-300 text-xs font-mono font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#d5f14c] animate-pulse" aria-hidden="true"></span>
              LEAD PHYSICIAN &amp; SURGEON
            </div>

            <h2
              id="doctor-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-heading"
            >
              Dr. Amit Kumar Jha
            </h2>

            <p className="text-lg sm:text-xl font-semibold text-teal-400 font-mono">
              FNB Sports Medicine, MS &amp; DNB Orthopaedics — Senior Specialist
            </p>

            <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
              Committed to providing evidence-based, compassionate care at Dr. Amit Jha Sports Injury Clinic (Krishna Health). Dr. Jha specializes in comprehensive diagnostic evaluations, keyhole arthroscopy, ACL reconstruction, and personalized treatment plans for optimal patient outcomes.
            </p>

            {/* Bullet Points */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                { title: "FNB Sports Medicine (Ganga Hospital)", desc: "Fellowship trained in sports surgery" },
                { title: "MS & DNB Orthopaedics", desc: "Post-graduate surgical qualification" },
                { title: "Keyhole Arthroscopy Specialist", desc: "Minimally invasive joint preservation" },
                { title: "Ethical & Advanced Diagnostics", desc: "5,000+ successful surgical outcomes" },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 glass-card bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 text-xs"
                >
                  <Award className="h-5 w-5 text-[#d5f14c] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-white block font-heading">{title}</strong>
                    <span className="text-slate-400">{desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#booking" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black text-base px-8 h-13 focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Request OPD appointment with Dr. Amit Jha"
                >
                  Request Appointment
                </Button>
              </a>
              <a href="#navigator" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white h-13 px-6 font-semibold focus-visible:ring-2 focus-visible:ring-[#d5f14c]"
                  aria-label="Learn more about treatments and services"
                >
                  Learn More About Us
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right Image Column: Columns 8-12 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-5 relative"
          >
            {/* Subtle Backglow effect */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500/30 to-emerald-400/20 rounded-full blur-3xl opacity-60 -z-10"></div>

            {/* Image Container with precise styling */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-800/80 bg-slate-900/90 glass-card p-3 group hover:border-teal-500/40 transition-all duration-500">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950/40 aspect-[4/5]">
                <Image
                  src="/dr-amit-jha-portrait.webp"
                  alt="Dr. Amit Kumar Jha — Senior Sports Injury & Orthopedic Specialist, Varanasi"
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 560px"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section
        className="py-20 bg-slate-950 border-b border-slate-800/80"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center space-y-4 mb-16"
          >
            <Badge className="bg-teal-900/40 text-teal-300 border-teal-700/50 px-3 py-1 text-xs font-mono uppercase tracking-widest">
              VERIFIED OUTCOMES
            </Badge>
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              Patient Outcomes
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Real recoveries. Real results.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.figure
                key={idx}
                variants={fadeUp}
                className="glass-card border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-teal-500/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div
                    className="flex gap-0.5"
                    aria-label={`${t.rating} out of 5 stars`}
                  >
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-slate-300 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="border-t border-slate-800/80 pt-4">
                  <strong className="text-white text-sm block font-heading">{t.name}</strong>
                  <span className="text-xs text-slate-400 block">{t.role}</span>
                  <Badge className="mt-2 bg-teal-950/60 text-teal-300 border-teal-800/60 text-[11px] font-mono">
                    {t.type}
                  </Badge>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BOOKING WIZARD ─────────────────────────────────────────────── */}
      <section
        id="booking"
        className="py-20 bg-[#102321] border-b border-slate-800/80"
        aria-labelledby="booking-heading"
      >
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
          {/* Why Book Here sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-6"
            >
              <Badge className="bg-teal-900/40 text-teal-300 border-teal-700/50 px-3 py-1 text-xs font-mono uppercase tracking-widest">
                DIRECT RESERVATION
              </Badge>
              <h2
                id="booking-heading"
                className="text-3xl font-extrabold text-white"
              >
                Why Book Here?
              </h2>
              <div className="space-y-6" role="list">
                {[
                  {
                    icon: Stethoscope,
                    title: "Expert Diagnosis",
                    desc: "Direct consultation with a fellowship-trained specialist.",
                  },
                  {
                    icon: Clock,
                    title: "Zero Wait Time",
                    desc: "Your token secures a dedicated slot in our live OPD queue.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Clear Treatment Plans",
                    desc: "Transparent guidance on surgical vs non-surgical care.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4" role="listitem">
                    <div
                      className="h-10 w-10 shrink-0 bg-[#0c1a18] border border-slate-800 rounded-xl flex items-center justify-center text-teal-400"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm font-heading">{title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="glass-card border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden">
                {/* Step indicator */}
                <div
                  className="bg-[#0c1a18] border-b border-slate-800/80 px-8 py-5"
                  role="tablist"
                  aria-label="Booking form steps"
                >
                  <div className="grid grid-cols-2 gap-4 text-center max-w-sm mx-auto font-mono text-xs">
                    <div
                      className={`pb-2 border-b-2 font-bold transition-colors ${
                        bookingStep >= 1
                          ? "border-[#d5f14c] text-[#d5f14c]"
                          : "border-slate-800 text-slate-600"
                      }`}
                      role="tab"
                      aria-selected={bookingStep === 1}
                      aria-label="Step 1: Service and slot selection"
                    >
                      01. SERVICE &amp; SLOT
                    </div>
                    <div
                      className={`pb-2 border-b-2 font-bold transition-colors ${
                        bookingStep >= 2
                          ? "border-[#d5f14c] text-[#d5f14c]"
                          : "border-slate-800 text-slate-600"
                      }`}
                      role="tab"
                      aria-selected={bookingStep === 2}
                      aria-label="Step 2: Patient information"
                    >
                      02. PATIENT INFO
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {isBooked ? (
                    /* ── Success State ── */
                    <div
                      className="text-center py-10 space-y-6"
                      role="status"
                      aria-live="polite"
                      aria-label="Appointment confirmed successfully"
                    >
                      <div
                        className="h-20 w-20 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/40"
                        aria-hidden="true"
                      >
                        <CheckCircle2 className="h-10 w-10 text-[#d5f14c]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white font-heading">
                          OPD Appointment Confirmed!
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          Your consultation token has been reserved.
                        </p>
                      </div>
                      <dl className="bg-[#0c1a18] border border-slate-800/80 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-slate-800/80 pb-2">
                          <dt className="text-slate-400">Patient Name</dt>
                          <dd className="text-white font-bold">
                            {patientName || "Patient"}
                          </dd>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/80 pb-2">
                          <dt className="text-slate-400">Service</dt>
                          <dd className="text-white font-semibold">
                            {selectedService}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Date &amp; Time Slot</dt>
                          <dd className="text-teal-400 font-bold">
                            {selectedDate} @ {selectedSlot}
                          </dd>
                        </div>
                      </dl>
                      <Button
                        onClick={() => {
                          setIsBooked(false);
                          setBookingStep(1);
                        }}
                        className="bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Book Another Appointment
                      </Button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleBookingSubmit}
                      className="space-y-8"
                      noValidate
                      aria-label="OPD appointment booking form"
                    >
                      {/* ── Step 1 ── */}
                      {bookingStep === 1 && (
                        <div className="space-y-6">
                          <fieldset>
                            <legend className="text-slate-300 mb-3 block text-xs font-mono font-bold uppercase tracking-widest">
                              // SELECT REQUIRED SERVICE
                            </legend>
                            <div
                              className="grid sm:grid-cols-2 gap-3"
                              role="listbox"
                              aria-label="Select a service"
                            >
                              {SERVICES.map((srv) => (
                                <div
                                  key={srv.id}
                                  role="option"
                                  aria-selected={selectedService === srv.title}
                                  tabIndex={0}
                                  onClick={() => setSelectedService(srv.title)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setSelectedService(srv.title);
                                    }
                                  }}
                                  className={`p-4 rounded-xl border cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#d5f14c] ${
                                    selectedService === srv.title
                                      ? "bg-slate-900 border-[#d5f14c] text-white shadow-md"
                                      : "bg-[#0c1a18] border-slate-800/80 text-slate-400 hover:bg-slate-900/80 hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center justify-between font-bold text-xs">
                                    <span>{srv.title}</span>
                                    {selectedService === srv.title && (
                                      <CheckCircle2
                                        className="h-4 w-4 text-[#d5f14c] shrink-0"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </fieldset>

                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <Label
                                htmlFor="preferred-date"
                                className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider"
                              >
                                Preferred Date
                              </Label>
                              <Input
                                id="preferred-date"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-[#0c1a18] border-slate-800 text-white focus-visible:ring-teal-500"
                                aria-label="Select your preferred appointment date"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="time-slot"
                                className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider"
                              >
                                Available Time Slot
                              </Label>
                              <select
                                id="time-slot"
                                value={selectedSlot}
                                onChange={(e) => setSelectedSlot(e.target.value)}
                                className="w-full h-10 px-3 rounded-md bg-[#0c1a18] border border-slate-800 text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 font-mono"
                                aria-label="Select an available time slot"
                              >
                                <optgroup label="Morning OPD (11:00 AM – 1:30 PM)">
                                  {TIME_SLOTS.slice(0, 5).map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </optgroup>
                                <optgroup label="Evening OPD (3:30 PM – 8:30 PM)">
                                  {TIME_SLOTS.slice(5).map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </optgroup>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <Button
                              type="button"
                              onClick={() => setBookingStep(2)}
                              className="bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black focus-visible:ring-2 focus-visible:ring-white"
                            >
                              Next: Patient Details{" "}
                              <ArrowRight
                                className="ml-2 h-4 w-4"
                                aria-hidden="true"
                              />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* ── Step 2 ── */}
                      {bookingStep === 2 && (
                        <div className="space-y-6">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="patient-name"
                                className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider"
                              >
                                Patient Full Name{" "}
                                <span className="text-red-400" aria-label="required">*</span>
                              </Label>
                              <Input
                                id="patient-name"
                                placeholder="e.g. Ramesh Chandra"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                required
                                autoComplete="name"
                                className="bg-[#0c1a18] border-slate-800 text-white focus-visible:ring-teal-500"
                                aria-required="true"
                                aria-describedby="name-hint"
                              />
                              <span id="name-hint" className="sr-only">
                                Enter the patient&apos;s full name
                              </span>
                            </div>
                            <div>
                              <Label
                                htmlFor="patient-phone"
                                className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider"
                              >
                                Mobile Number{" "}
                                <span className="text-red-400" aria-label="required">*</span>
                              </Label>
                              <Input
                                id="patient-phone"
                                placeholder="e.g. 9876543210"
                                value={patientPhone}
                                onChange={(e) => setPatientPhone(e.target.value)}
                                required
                                type="tel"
                                autoComplete="tel"
                                inputMode="numeric"
                                className="bg-[#0c1a18] border-slate-800 text-white focus-visible:ring-teal-500"
                                aria-required="true"
                              />
                            </div>
                          </div>

                          <div>
                            <Label
                              htmlFor="complaint"
                              className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider"
                            >
                              Symptoms / Notes
                            </Label>
                            <Textarea
                              id="complaint"
                              placeholder="Describe joint pain, injury, or request..."
                              value={complaint}
                              onChange={(e) => setComplaint(e.target.value)}
                              className="bg-[#0c1a18] border-slate-800 text-white h-24 focus-visible:ring-teal-500"
                              aria-label="Optional: describe your symptoms or special requests"
                            />
                          </div>

                          <div className="flex justify-between pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setBookingStep(1)}
                              className="border-slate-800 text-slate-300 hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#d5f14c]"
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black focus-visible:ring-2 focus-visible:ring-white"
                            >
                              Confirm &amp; Generate Token
                            </Button>
                          </div>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        className="py-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-base">
              <Activity className="h-5 w-5 text-teal-400" aria-hidden="true" />
              Dr. Amit Jha Clinic
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fellowship Trained Sports Medicine & Orthopedic Surgeon (FNB Ganga
              Hospital, MS, DNB).
            </p>
          </div>

          {/* Location */}
          <address className="not-italic">
            <h2 className="text-white font-bold mb-2 not-italic text-xs uppercase tracking-wider">
              Location & OPD
            </h2>
            <p className="text-slate-400 flex items-start gap-2">
              <MapPin
                className="h-4 w-4 text-teal-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              Sigra & Apex Super Specialty Hospital, Varanasi, UP
            </p>
          </address>

          {/* Nav Links */}
          <nav aria-label="Footer navigation">
            <h2 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">
              Navigation
            </h2>
            <div className="flex flex-col space-y-2">
              <a href="#about" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm">About Dr. Jha</a>
              <a href="#services" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm">Our Services</a>
              <a href="#booking" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm">Book Appointment</a>
              <Link href="/login" className="hover:text-teal-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5f14c] rounded-sm">Staff ERP Portal</Link>
            </div>
          </nav>

          {/* OPD Hours */}
          <div>
            <h2 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">
              OPD Hours
            </h2>
            <p className="text-slate-400">Morning: 11:00 AM – 1:30 PM IST</p>
            <p className="text-slate-400 mt-1">Evening: 3:30 PM – 8:30 PM IST</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 text-center text-slate-500 pt-6">
          © 2026 KrishnaHealth ERP — Dr. Amit Jha Sports Injury & Orthopedic
          Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
