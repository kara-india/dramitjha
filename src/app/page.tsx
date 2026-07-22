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
  Dumbbell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Category Tabs: Athlete & Sports Medicine vs General Orthopedic Care
const SERVICE_CATEGORIES = [
  { id: "all", label: "All Care Services" },
  { id: "general", label: "General Orthopedics & Checkups" },
  { id: "sports", label: "Athlete Sports & Ligament Care" },
  { id: "rehab", label: "Physiotherapy & Rehab" },
];

const SERVICES = [
  {
    id: "general-checkup",
    category: "general",
    title: "General Orthopedic Checkup & Joint Consultation",
    shortDesc: "Comprehensive bone health check, joint pain screening, arthritis evaluation, posture assessment, and custom treatment plans.",
    icon: Stethoscope,
    badge: "General Care",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    stats: "Same-Day Appointment",
  },
  {
    id: "acl-reconstruction",
    category: "sports",
    title: "ACL & Multiligament Reconstruction",
    shortDesc: "Anatomic ACL, PCL & multiligament surgery using biological autografts for athletes & active individuals seeking peak stability.",
    icon: Flame,
    badge: "Sports Medicine",
    gradient: "from-teal-500/20 to-cyan-500/10",
    border: "border-teal-500/30",
    stats: "98.5% Return-to-Sport",
  },
  {
    id: "knee-shoulder-arthroscopy",
    category: "sports",
    title: "Knee & Shoulder Arthroscopy",
    shortDesc: "Minimally invasive keyhole surgery for meniscus repair, cartilage preservation, bankart repair, and shoulder dislocation.",
    icon: Zap,
    badge: "Minimally Invasive",
    gradient: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    stats: "Fast 24-hr Discharge",
  },
  {
    id: "fracture-trauma",
    category: "general",
    title: "Emergency Fracture & Trauma Management",
    shortDesc: "Urgent fracture care, rigid splinting, plaster application, and ORIF surgical fixation for bone injuries and trauma.",
    icon: ShieldAlert,
    badge: "Emergency & Trauma",
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
    stats: "Priority Triage Available",
  },
  {
    id: "joint-preservation",
    category: "general",
    title: "Joint Preservation & Arthritis Care",
    shortDesc: "High Tibial Osteotomy (HTO), OATS, viscosupplementation, and joint-sparing procedures to delay or prevent total knee replacement.",
    icon: Bone,
    badge: "Joint Preservation",
    gradient: "from-teal-600/20 to-emerald-600/10",
    border: "border-teal-600/30",
    stats: "Prevents Replacement",
  },
  {
    id: "pediatric-ortho",
    category: "general",
    title: "Pediatric Orthopedics & Growth Care",
    shortDesc: "Specialized care for pediatric fractures, knock knees, bow legs, flat feet, clubfoot, and growth-plate sparing ligament repair.",
    icon: Users,
    badge: "Pediatric Care",
    gradient: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
    stats: "Child-Friendly Care",
  },
  {
    id: "physio-rehab",
    category: "rehab",
    title: "Physiotherapy & Athlete Performance Rehab",
    shortDesc: "Dedicated 30-min slots (11am-1:30pm & 3:30pm-8:30pm IST) for post-op ACL rehab, joint mobilization, electrotherapy & return-to-play testing.",
    icon: Dumbbell,
    badge: "Specialized Rehab",
    gradient: "from-emerald-600/20 to-teal-500/10",
    border: "border-emerald-500/30",
    stats: "30-min Private Slots",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh K. Verma",
    role: "State Level Footballer",
    type: "ACL Reconstruction",
    quote: "Dr. Amit Jha diagnosed my ACL tear instantly. The anatomic reconstruction and guided physio got me back on the field in 6 months with complete stability!",
    rating: 5
  },
  {
    name: "Smt. Sunita Devi",
    role: "General Patient (Age 54)",
    type: "Knee Arthritis & Joint Preservation",
    quote: "I was struggling with severe knee pain for 3 years. Dr. Amit Jha's joint preservation checkup and treatment gave me back smooth, painless walking without knee replacement.",
    rating: 5
  },
  {
    name: "Vikramaditya Singh",
    role: "Marathon Runner",
    type: "Meniscus Repair & Cartilage Care",
    quote: "Best sports injury specialist in Poorvanchal. Minimal keyhole scar, negligible pain, and highly scientific rehabilitation protocol.",
    rating: 5
  }
];

const TIME_SLOTS = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM",
  "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState("General Orthopedic Checkup & Joint Consultation");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [complaint, setComplaint] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const filteredServices = activeCategory === "all"
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeCategory);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white relative">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="h-4 w-4 text-teal-200 animate-pulse" />
        <span>OPD Timings in Varanasi: Morning 11:00 AM – 1:30 PM | Evening 3:30 PM – 8:30 PM IST</span>
        <a href="#booking" className="underline font-bold hover:text-teal-200 ml-2">Book Slot →</a>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/90 border-b border-teal-900/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/25">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                Dr. Amit Jha
              </span>
              <span className="text-xs text-teal-400 font-semibold tracking-wide">
                Sports Injury & Orthopedic Care Clinic, Varanasi
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-teal-400 transition-colors">About Dr. Jha</a>
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
              <Button className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-extrabold shadow-xl shadow-teal-500/30">
                <Calendar className="mr-2 h-4 w-4" /> Book Consultation
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION — Featuring Dr. Amit Jha's Photo */}
      <section id="about" className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-teal-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.1),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold backdrop-blur-md">
              <Award className="h-4 w-4 text-teal-400" /> FNB Sports Medicine (Ganga Hospital) • MS & DNB Orthopaedics
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Elite Athlete Rehab & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-200">General Patient Orthopedic Care</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Consult <strong className="text-white font-bold">Dr. Amit Kumar Jha</strong> for expert care in General Orthopedic Checkups, Joint Pain, ACL Ligament Reconstruction, Arthroscopic Surgery, Pediatric Bone Care, and Dedicated Physiotherapy in Varanasi.
            </p>

            {/* Care Highlights */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>General Checkup:</strong> Arthritis & Joint Consultation</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                <span><strong>Athlete Care:</strong> Keyhole ACL & Arthroscopy</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span><strong>Emergency:</strong> Fracture & Trauma Management</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span><strong>Rehab:</strong> 30-min Private Physio Slots</span>
              </div>
            </div>

            {/* Quick Numbers */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-3xl font-black text-white">10+ Yrs</div>
                <div className="text-xs text-slate-400 font-semibold">Clinical Experience</div>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-400">5,000+</div>
                <div className="text-xs text-slate-400 font-semibold">Successful Surgeries</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-400">99%</div>
                <div className="text-xs text-slate-400 font-semibold">Patient Recovery Rate</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a href="#booking">
                <Button size="lg" className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-extrabold text-base px-8 h-12 shadow-xl shadow-teal-500/25">
                  <Calendar className="mr-2 h-5 w-5" /> Book Consultation Now
                </Button>
              </a>
              <a href="#services">
                <Button size="lg" variant="outline" className="border-slate-800 text-slate-200 hover:bg-slate-900 hover:text-white h-12 px-6">
                  Explore Services <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column — Dr. Amit Jha Photo Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-br from-teal-500/30 via-slate-900 to-slate-950 border-2 border-teal-500/40 p-4 shadow-2xl shadow-teal-500/20">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[460px] flex items-end justify-center">
                {/* Standard img tag for 100% reliable image loading */}
                <img
                  src="/dr-amit-jha-hero.png"
                  alt="Dr. Amit Kumar Jha - Sports Medicine & Orthopedic Surgeon"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />

                {/* Profile Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-slate-950/90 border border-teal-500/40 rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">Dr. Amit Kumar Jha</h3>
                      <p className="text-xs text-teal-400 font-semibold">Orthopedic & Sports Medicine Surgeon</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                      OPD Active Today
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES & CHECKUPS SECTION */}
      <section id="services" className="py-20 bg-slate-950 border-b border-teal-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 px-3 py-1 text-xs">
              Complete Orthopedic Spectrum
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              General Patient Orthopedics & Athlete Sports Medicine
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              From routine joint checkups and arthritis care to advanced keyhole knee surgery and athlete return-to-sport rehab.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-lg shadow-teal-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.id}
                  className={`bg-slate-900/90 border ${service.border} hover:border-teal-400/60 transition-all group flex flex-col justify-between`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="bg-slate-800 border-slate-700 text-teal-300 text-[11px]">
                        {service.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-white font-bold">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 text-xs leading-relaxed">{service.shortDesc}</p>
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-teal-400 font-bold">
                      <span>{service.stats}</span>
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

      {/* HOUSES OF SMILES-INSPIRED APPOINTMENT BOOKING MODULE */}
      <section id="booking" className="py-20 bg-slate-900 border-b border-teal-900/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 px-3 py-1">
              Instant Online Consultation Booking
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Book Your Appointment in 3 Quick Steps
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Select your service, choose a convenient slot, and receive instant digital appointment token confirmation.
            </p>
          </div>

          <Card className="bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
            <CardHeader className="bg-slate-900/80 border-b border-slate-800 pb-6">
              <div className="grid grid-cols-3 gap-4 text-center max-w-lg mx-auto">
                <div className={`pb-2 border-b-2 font-bold text-xs ${bookingStep >= 1 ? "border-teal-400 text-teal-400" : "border-slate-800 text-slate-600"}`}>
                  1. Select Service & Slot
                </div>
                <div className={`pb-2 border-b-2 font-bold text-xs ${bookingStep >= 2 ? "border-teal-400 text-teal-400" : "border-slate-800 text-slate-600"}`}>
                  2. Patient Details
                </div>
                <div className={`pb-2 border-b-2 font-bold text-xs ${bookingStep >= 3 ? "border-teal-400 text-teal-400" : "border-slate-800 text-slate-600"}`}>
                  3. Instant Token
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
                    <h3 className="text-2xl font-black text-white">Appointment Confirmed!</h3>
                    <p className="text-slate-400 text-sm mt-1">Your consultation token has been generated successfully.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md mx-auto text-left space-y-3 shadow-inner">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 text-xs">Token Number</span>
                      <span className="text-teal-400 font-mono font-bold text-sm">KH-2026-0842</span>
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
                      <span className="text-slate-400 text-xs">Date & Time</span>
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
                          Select Service Required
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
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{srv.shortDesc}</p>
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
                          Next: Patient Info <ArrowRight className="ml-2 h-4 w-4" />
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
      <section id="testimonials" className="py-20 bg-slate-950 border-b border-teal-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/30 px-3 py-1 text-xs">
              Verified Patient Reviews
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Trusted by General Patients & Athletes Alike
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <Card key={idx} className="bg-slate-900 border-slate-800 flex flex-col justify-between hover:border-teal-500/40 transition-all">
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
            <h4 className="text-white font-bold mb-2">Staff Access</h4>
            <Link href="/login">
              <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white">
                ERP Staff Login
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
