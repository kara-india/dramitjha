"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Award,
  Star,
  Users,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  ArrowRight,
  Sparkles,
  User,
  FileText,
  Building2,
  HeartPulse,
  Bone,
  Flame,
  Zap,
  Check,
  ShieldAlert,
  Dumbbell,
  Target,
  Trophy,
  Navigation,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// HSS-Grade Body Part Injury Navigator Data
const BODY_PARTS = [
  {
    id: "knee",
    name: "Knee Joint",
    icon: Flame,
    subtitle: "ACL, Meniscus & Cartilage",
    commonConditions: [
      "ACL / PCL Ligament Tear",
      "Meniscus Tear (Bucket Handle & Radial)",
      "Cartilage Defect & Osteochondritis",
      "Patellar Instability & Knee Osteoarthritis"
    ],
    solutions: "Anatomic Reconstruction, Keyhole Arthroscopy, HTO Joint Preservation",
    recovery: "Return to Sport in 6-9 Months"
  },
  {
    id: "shoulder",
    name: "Shoulder Joint",
    icon: Zap,
    subtitle: "Instability, Labrum & Rotator Cuff",
    commonConditions: [
      "Recurrent Shoulder Dislocation (Bankart Lesion)",
      "Rotator Cuff Tear & Tendonitis",
      "SLAP Lesion & Frozen Shoulder",
      "Acromioclavicular (AC) Joint Sprain"
    ],
    solutions: "Arthroscopic Bankart Repair, Rotator Cuff Anchoring, Capsular Shift",
    recovery: "Full Overhead Motion in 3-4 Months"
  },
  {
    id: "general",
    name: "General Joints & Checkup",
    icon: Stethoscope,
    subtitle: "Arthritis, Joint Pain & Bone Health",
    commonConditions: [
      "Early & Advanced Knee Osteoarthritis",
      "Chronic Joint Stiffness & Swelling",
      "Postural Deformity & Gait Misalignment",
      "Bone Density Loss & Osteoporosis"
    ],
    solutions: "Comprehensive Checkup, Biological Injections, Joint Preservation",
    recovery: "Same-Day Relief & Guided Care"
  },
  {
    id: "trauma",
    name: "Fracture & Trauma",
    icon: ShieldAlert,
    subtitle: "Emergency Bone & Joint Injury",
    commonConditions: [
      "Complex Bone Fractures & Dislocations",
      "Sports Impact Fractures & Stress Fractures",
      "Ligament Avulsion Fractures",
      "Soft Tissue Emergency Injuries"
    ],
    solutions: "Urgent Rigid Splinting, Plastering, ORIF Surgical Fixation",
    recovery: "Immediate Emergency Triage"
  },
  {
    id: "pediatric",
    name: "Pediatric Orthopedics",
    icon: Users,
    subtitle: "Growth Plate & Child Bone Care",
    commonConditions: [
      "Pediatric Ligament Injuries",
      "Knock Knees & Bow Legs (Genu Valgum/Varum)",
      "Flat Feet & Clubfoot Deformities",
      "Growth Plate Fractures & Alignment Issues"
    ],
    solutions: "Growth-Plate Sparing Repair, Deformity Correction, Custom Bracing",
    recovery: "Child-Safe Protocol"
  }
];

// Dual Spectrum Services: Athlete Sports Medicine + General Patient Orthopedic Care
const SERVICES = [
  {
    id: "general-checkup",
    type: "general",
    badge: "General Patient Care",
    title: "General Orthopedic Checkup & Joint Consultation",
    desc: "Comprehensive evaluation of joint health, arthritis risk assessment, bone density review, and personalized non-surgical or surgical care plans.",
    stats: "Same-Day OPD Appointment",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    icon: Stethoscope
  },
  {
    id: "acl-reconstruction",
    type: "sports",
    badge: "Sports Medicine",
    title: "ACL & Multiligament Reconstruction",
    desc: "Anatomic single and double-bundle ACL & PCL reconstruction using biological autografts engineered for elite athletes and active individuals.",
    stats: "98.5% Return-to-Play Rate",
    gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
    icon: Flame
  },
  {
    id: "arthroscopy",
    type: "sports",
    badge: "Minimally Invasive Keyhole",
    title: "Knee & Shoulder Arthroscopy",
    desc: "Ultra-precise keyhole procedures for meniscus repair, cartilage restoration, Bankart repair, and shoulder stabilization with minimal tissue trauma.",
    stats: "24-Hour Hospital Discharge",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    icon: Zap
  },
  {
    id: "trauma-fractures",
    type: "general",
    badge: "Emergency Trauma",
    title: "Emergency Fracture & Trauma Management",
    desc: "Urgent emergency triage for bone fractures, dislocations, rigid immobilization, plaster casting, and ORIF surgical fixation.",
    stats: "Priority Triage Available",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    icon: ShieldAlert
  },
  {
    id: "joint-preservation",
    type: "general",
    badge: "Joint Preservation",
    title: "Joint Preservation & Realignment (HTO/OATS)",
    desc: "High Tibial Osteotomy (HTO), OATS, and biological cartilage restoration designed to preserve the native knee and prevent total joint replacement.",
    stats: "Delays Joint Replacement",
    gradient: "from-teal-600/20 via-emerald-600/10 to-transparent",
    icon: Bone
  },
  {
    id: "pediatric-ortho",
    type: "general",
    badge: "Pediatric Orthopedics",
    title: "Pediatric Growth Plate & Deformity Correction",
    desc: "Specialized pediatric care for growth-plate injuries, knock knees, bow legs, flat feet, and pediatric sports injuries.",
    stats: "Child-Safe Protocols",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    icon: Users
  },
  {
    id: "sports-rehab",
    type: "rehab",
    badge: "Specialized Rehab",
    title: "Physiotherapy & Athlete Performance Rehab",
    desc: "Dedicated 30-minute private slots (11:00 AM – 1:30 PM & 3:30 PM – 8:30 PM IST) for 5-phase ACL rehab, electrotherapy, and return-to-sport testing.",
    stats: "Dedicated 30-min Slots",
    gradient: "from-emerald-600/20 via-teal-500/10 to-transparent",
    icon: Dumbbell
  }
];

// Patient Stories & Testimonials
const TESTIMONIALS = [
  {
    name: "Rajesh K. Verma",
    role: "State Level Footballer",
    type: "ACL Reconstruction",
    quote: "Dr. Amit Jha diagnosed my ACL tear instantly. The anatomic reconstruction and guided rehab got me back on the pitch in 6 months with 100% knee stability!",
    rating: 5
  },
  {
    name: "Smt. Sunita Devi",
    role: "General Patient (Age 54)",
    type: "Knee Arthritis & Joint Preservation",
    quote: "I was struggling with severe knee pain for 3 years. Dr. Amit Jha's joint preservation checkup gave me back smooth, painless walking without knee replacement.",
    rating: 5
  },
  {
    name: "Vikramaditya Singh",
    role: "Marathon Runner",
    type: "Meniscus Repair & Cartilage Care",
    quote: "The best sports injury specialist in Poorvanchal. Keyhole surgery, minimal scar, negligible pain, and a highly scientific return-to-running protocol.",
    rating: 5
  }
];

const TIME_SLOTS = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM",
  "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

export default function LandingPage() {
  const [selectedBodyPart, setSelectedBodyPart] = useState(BODY_PARTS[0]);
  const [activeTab, setActiveTab] = useState("all");

  // Booking Form State
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState("General Orthopedic Checkup & Joint Consultation");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [complaint, setComplaint] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const filteredServices = activeTab === "all"
    ? SERVICES
    : SERVICES.filter((s) => s.type === activeTab);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Top High-Performance Announcement Bar */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-lg">
        <Sparkles className="h-4 w-4 text-teal-200 animate-pulse" />
        <span>Dr. Amit Jha OPD Timings (Varanasi): Morning 11:00 AM – 1:30 PM | Evening 3:30 PM – 8:30 PM IST</span>
        <a href="#booking" className="underline font-black hover:text-teal-200 ml-2">Book OPD Slot →</a>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/90 border-b border-teal-900/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-400 via-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/25">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                Dr. Amit Jha
              </span>
              <span className="text-[11px] text-teal-400 font-semibold tracking-wide">
                Sports Injury & Orthopedic Clinic, Varanasi
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-teal-400 transition-colors">About Dr. Jha</a>
            <a href="#navigator" className="hover:text-teal-400 transition-colors">Injury Navigator</a>
            <a href="#services" className="hover:text-teal-400 transition-colors">Services & Checkups</a>
            <a href="#testimonials" className="hover:text-teal-400 transition-colors">Patient Reviews</a>
            <a href="#booking" className="hover:text-teal-400 transition-colors">Book Appointment</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800">
                Staff ERP Login
              </Button>
            </Link>
            <a href="#booking">
              <Button className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black shadow-xl shadow-teal-500/30">
                <Calendar className="mr-2 h-4 w-4" /> Book Consultation
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION — Featuring Dr. Amit Jha's Photo & Nike/Steadman Athletic Luxury */}
      <section id="about" className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-teal-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.12),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold backdrop-blur-md">
              <Award className="h-4 w-4 text-teal-400" /> FNB Sports Medicine (Ganga Hospital, Coimbatore) • MS & DNB Ortho
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Peak Athletic Performance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-100">World-Class Joint Restoration</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Consult <strong className="text-white font-bold">Dr. Amit Kumar Jha</strong> in Varanasi for advanced General Orthopedic Checkups, Knee & Shoulder Arthroscopy, ACL Ligament Surgery, Emergency Trauma Fixation, and Dedicated Sports Rehabilitation.
            </p>

            {/* Target Audience Chips (Nike/Steadman athletic & general focus) */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-teal-300 font-semibold">⚡ Professional Athletes</span>
              <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-teal-300 font-semibold">🏃 Marathon Runners & Footballers</span>
              <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-teal-300 font-semibold">🦵 Knee & Joint Pain Patients</span>
              <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-teal-300 font-semibold">🩺 General Checkups & Trauma</span>
            </div>

            {/* Key Clinical Credentials & Numbers */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white">10+ Yrs</div>
                <div className="text-xs text-slate-400 font-semibold">Surgical Expertise</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-teal-400">5,000+</div>
                <div className="text-xs text-slate-400 font-semibold">Successful Surgeries</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400">98.5%</div>
                <div className="text-xs text-slate-400 font-semibold">Return-to-Sport Rate</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a href="#booking">
                <Button size="lg" className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-base px-8 h-12 shadow-2xl shadow-teal-500/30">
                  <Calendar className="mr-2 h-5 w-5" /> Book OPD Consultation
                </Button>
              </a>
              <a href="#navigator">
                <Button size="lg" variant="outline" className="border-slate-800 text-slate-200 hover:bg-slate-900 hover:text-white h-12 px-6">
                  <Compass className="mr-2 h-5 w-5 text-teal-400" /> Interactive Injury Navigator
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column — Dr. Amit Jha Photo Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-br from-teal-500/40 via-slate-900 to-slate-950 border-2 border-teal-500/50 p-4 shadow-2xl shadow-teal-500/25">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[480px] flex items-end justify-center">
                {/* Standard HTML img tag for 100% reliable rendering */}
                <img
                  src="/dr-amit-jha-hero.png"
                  alt="Dr. Amit Kumar Jha - Fellowship Trained Sports Medicine & Orthopedic Surgeon"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />

                {/* Profile Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-slate-950/90 border border-teal-500/50 rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base">Dr. Amit Kumar Jha</h3>
                      <p className="text-xs text-teal-400 font-semibold">Orthopedic & Sports Medicine Surgeon</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold">
                      OPD Active Today
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HSS-GRADE INTERACTIVE BODY-PART INJURY NAVIGATOR */}
      <section id="navigator" className="py-20 bg-slate-950 border-b border-teal-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 px-3 py-1 text-xs">
              Interactive Diagnostic Tool
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              HSS-Grade Joint & Injury Navigator
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Select your affected joint or injury area to explore common conditions, diagnostic tests, and Dr. Amit Jha&apos;s surgical and non-surgical solutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {BODY_PARTS.map((bp) => {
                const Icon = bp.icon;
                const isSelected = selectedBodyPart.id === bp.id;
                return (
                  <div
                    key={bp.id}
                    onClick={() => setSelectedBodyPart(bp)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 border-teal-400 text-white shadow-xl"
                        : "bg-slate-900/80 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-teal-400 text-slate-950" : "bg-slate-800 text-teal-400"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{bp.name}</h4>
                          <p className="text-xs text-slate-400">{bp.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-transform ${isSelected ? "translate-x-1 text-teal-400" : "text-slate-600"}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Interactive Detail Card */}
            <div className="lg:col-span-7">
              <Card className="bg-slate-900/90 border border-teal-500/30 shadow-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 mb-2">
                      Focused Clinical Protocol
                    </Badge>
                    <h3 className="text-2xl font-black text-white">{selectedBodyPart.name} Overview</h3>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                    {selectedBodyPart.recovery}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commonly Diagnosed Conditions</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedBodyPart.commonConditions.map((cond, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                        <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Treatment Approach</h4>
                  <p className="text-sm text-teal-300 font-semibold">{selectedBodyPart.solutions}</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <a href="#booking">
                    <Button className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-bold">
                      Book Consultation for {selectedBodyPart.name} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3-PHASE RECOVERY CONTINUUM (Andrews Sports Medicine Style) */}
      <section className="py-20 bg-slate-900 border-b border-teal-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 px-3 py-1 text-xs">
              Scientific Patient Journey
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The 3-Phase Athlete & Patient Care Continuum
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Structured from initial clinical assessment to minimally invasive keyhole treatment and 5-stage return-to-play rehabilitation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-950 border-slate-800 hover:border-teal-500/40 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-xl mb-4">
                  01
                </div>
                <CardTitle className="text-xl text-white font-bold">Precision Diagnosis & Bio-Imaging</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-400 leading-relaxed">
                <p>High-resolution MRI review, joint stability testing (Lachman, Drawer, Bankart tests), gait analysis, and physical checkup.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800 hover:border-teal-500/40 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-xl mb-4">
                  02
                </div>
                <CardTitle className="text-xl text-white font-bold">Minimally Invasive Keyhole / Preservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-400 leading-relaxed">
                <p>Anatomic ACL reconstruction, arthroscopic meniscus repair, Bankart repair, or non-surgical joint preservation injections.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800 hover:border-teal-500/40 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-xl mb-4">
                  03
                </div>
                <CardTitle className="text-xl text-white font-bold">5-Phase Rehab & Return-to-Play Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-400 leading-relaxed">
                <p>Dedicated 30-min physio slots, bio-feedback, goniometric ROM tracking, muscle strengthening, and sports field clearance.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DUAL SPECTRUM SERVICES SECTION */}
      <section id="services" className="py-20 bg-slate-950 border-b border-teal-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 px-3 py-1 text-xs">
              Complete Clinical Spectrum
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Specialized Services for General Patients & Athletes
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Explore our full range of general orthopedic checkups, joint pain treatments, fracture care, and elite sports medicine procedures.
            </p>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === "all" ? "bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-lg" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}
            >
              All Clinical Services
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === "general" ? "bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-lg" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}
            >
              General Orthopedics & Checkups
            </button>
            <button
              onClick={() => setActiveTab("sports")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === "sports" ? "bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-lg" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}
            >
              Athlete Sports & Ligament Surgery
            </button>
            <button
              onClick={() => setActiveTab("rehab")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === "rehab" ? "bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-lg" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}
            >
              Physiotherapy & Rehab
            </button>
          </div>

          {/* Services Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.id} className="bg-slate-900/90 border border-slate-800 hover:border-teal-400/60 transition-all group flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="bg-slate-800 border-slate-700 text-teal-300 text-[11px]">
                        {s.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-white font-bold">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 text-xs leading-relaxed">{s.desc}</p>
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-teal-400 font-bold">
                      <span>{s.stats}</span>
                      <a href="#booking" className="flex items-center gap-1 hover:underline">
                        Book <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPLE/STEADMAN-INSPIRED CONVERSION BOOKING WIZARD */}
      <section id="booking" className="py-20 bg-slate-900 border-b border-teal-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 px-3 py-1 text-xs">
              Instant OPD Token Booking
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Schedule Your Consultation with Dr. Amit Jha
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Instant appointment token generation with automated queue confirmation.
            </p>
          </div>

          <Card className="bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
            <CardHeader className="bg-slate-900/80 border-b border-slate-800 pb-6">
              <div className="grid grid-cols-3 gap-4 text-center max-w-lg mx-auto">
                <div className={`pb-2 border-b-2 font-bold text-xs ${bookingStep >= 1 ? "border-teal-400 text-teal-400" : "border-slate-800 text-slate-600"}`}>
                  1. Service & Slot
                </div>
                <div className={`pb-2 border-b-2 font-bold text-xs ${bookingStep >= 2 ? "border-teal-400 text-teal-400" : "border-slate-800 text-slate-600"}`}>
                  2. Patient Info
                </div>
                <div className={`pb-2 border-b-2 font-bold text-xs ${bookingStep >= 3 ? "border-teal-400 text-teal-400" : "border-slate-800 text-slate-600"}`}>
                  3. Digital Token
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {isBooked ? (
                <div className="text-center py-10 space-y-6">
                  <div className="h-20 w-20 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/40 shadow-xl">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">OPD Appointment Confirmed!</h3>
                    <p className="text-slate-400 text-sm mt-1">Your consultation token has been reserved in the live queue.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md mx-auto text-left space-y-3">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 text-xs">Token Number</span>
                      <span className="text-teal-400 font-mono font-bold text-sm">KH-2026-0845</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 text-xs">Patient Name</span>
                      <span className="text-white text-xs font-bold">{patientName || "Patient"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 text-xs">Service</span>
                      <span className="text-white text-xs font-semibold">{selectedService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Date & Time Slot</span>
                      <span className="text-white text-xs font-semibold">{selectedDate} @ {selectedSlot}</span>
                    </div>
                  </div>
                  <Button onClick={() => setIsBooked(false)} className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold">
                    Book Another Appointment
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-8">
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-slate-300 mb-3 block text-xs font-bold uppercase tracking-wider">
                          Select Required Service
                        </Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {SERVICES.map((srv) => (
                            <div
                              key={srv.id}
                              onClick={() => setSelectedService(srv.title)}
                              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                selectedService === srv.title
                                  ? "bg-teal-500/10 border-teal-400 text-white shadow-md"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold text-xs">
                                <span>{srv.title}</span>
                                {selectedService === srv.title && <CheckCircle2 className="h-4 w-4 text-teal-400" />}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{srv.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-slate-300 mb-2 block text-xs font-bold uppercase">Preferred Date</Label>
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-slate-900 border-slate-800 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300 mb-2 block text-xs font-bold uppercase">Available Time Slot</Label>
                          <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full h-10 px-3 rounded-md bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            {TIME_SLOTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="button" onClick={() => setBookingStep(2)} className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-bold">
                          Next: Patient Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-300 mb-2 block text-xs font-bold uppercase">Patient Full Name</Label>
                          <Input
                            placeholder="e.g. Ramesh Chandra"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            required
                            className="bg-slate-900 border-slate-800 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300 mb-2 block text-xs font-bold uppercase">Mobile Number</Label>
                          <Input
                            placeholder="e.g. 9876543210"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            required
                            className="bg-slate-900 border-slate-800 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-slate-300 mb-2 block text-xs font-bold uppercase">Symptoms / Notes</Label>
                        <Textarea
                          placeholder="Describe joint pain, ligament injury, fracture, or checkup request..."
                          value={complaint}
                          onChange={(e) => setComplaint(e.target.value)}
                          className="bg-slate-900 border-slate-800 text-white h-24"
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setBookingStep(1)} className="border-slate-800 text-slate-300">
                          Back
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-bold">
                          Confirm & Generate Token
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PATIENT TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-slate-950 border-b border-teal-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 px-3 py-1 text-xs">
              Verified Patient Reviews
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Trusted by General Patients & Professional Athletes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <Card key={idx} className="bg-slate-900 border-slate-800 flex flex-col justify-between hover:border-teal-400/40 transition-all">
                <CardHeader>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 italic text-xs leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </CardHeader>
                <CardContent className="pt-4 border-t border-slate-800">
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-teal-400 font-semibold">{t.role}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{t.type}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-base">
              <Activity className="h-5 w-5 text-teal-400" /> Dr. Amit Jha Clinic
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fellowship Trained Sports Medicine & Orthopedic Surgeon (FNB Ganga Hospital, MS, DNB).
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Location & OPD</h4>
            <p className="text-slate-400 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
              Sigra & Apex Super Specialty Hospital, Varanasi, UP
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">OPD Hours</h4>
            <p className="text-slate-400">Morning: 11:00 AM – 1:30 PM IST</p>
            <p className="text-slate-400 mt-1">Evening: 3:30 PM – 8:30 PM IST</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Staff ERP Access</h4>
            <Link href="/login">
              <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white">
                ERP Staff Portal
              </Button>
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-900 text-center text-slate-500 pt-8">
          © 2026 KrishnaHealth ERP — Dr. Amit Jha Sports Injury & Orthopedic Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
