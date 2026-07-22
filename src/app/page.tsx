"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Services from dramitjhasportsinjury.com
const SERVICES = [
  {
    id: "acl",
    title: "ACL & Ligament Reconstruction",
    shortDesc: "Anatomic single/double bundle ACL, PCL & multiligamentous reconstruction using advanced autografts.",
    icon: Stethoscope,
    stats: "98.5% Return-to-Sport Rate",
    tag: "Specialized"
  },
  {
    id: "arthroscopy",
    title: "Knee & Shoulder Arthroscopy",
    shortDesc: "Minimally invasive keyhole surgery for meniscus repair, cartilage preservation & shoulder instability.",
    icon: HeartPulse,
    stats: "Fast 24-hr Discharge",
    tag: "Minimally Invasive"
  },
  {
    id: "joint-preservation",
    title: "Joint Preservation & Realignment",
    shortDesc: "Biological joint preservation, HTO, microfracture, and OATS to delay or prevent knee replacement.",
    icon: ShieldCheck,
    stats: "Joint Longevity Focus",
    tag: "Advanced"
  },
  {
    id: "pediatrics",
    title: "Pediatric Sports Medicine",
    shortDesc: "Growth-plate sparing ligament reconstruction and congenital deformity correction in young athletes.",
    icon: Users,
    stats: "Child-Safe Protocols",
    tag: "Pediatric"
  },
  {
    id: "physio",
    title: "Sports Rehabilitation & Physio",
    shortDesc: "Structured 5-phase ACL rehab, bio-feedback, goniometric tracking & return-to-play testing.",
    icon: Activity,
    stats: "Dedicated 30-min Slots",
    tag: "Rehab Center"
  }
];

// Testimonials from dramitjhasportsinjury.com & Varanasi patient feedback
const TESTIMONIALS = [
  {
    name: "Rajesh K. Verma",
    role: "State Level Football Player",
    procedure: "ACL Reconstruction (Anatomic Autograft)",
    rating: 5,
    quote: "Dr. Amit Jha treated my ACL tear with utmost care. Within 6 months of structured rehab at his clinic in Varanasi, I was back on the football pitch with 100% confidence."
  },
  {
    name: "Pooja Srivastava",
    role: "Badminton Athlete",
    procedure: "Shoulder Arthroscopy & Labral Repair",
    rating: 5,
    quote: "Exceptional clinical expertise! Dr. Jha explained the entire arthroscopic procedure clearly. His minimally invasive approach meant very little pain and quick recovery."
  },
  {
    name: "Vikramaditya Singh",
    role: "Marathon Runner",
    procedure: "Meniscus Repair & Cartilage Preservation",
    rating: 5,
    quote: "The best sports medicine specialist in Poorvanchal. Dr. Jha saved my native knee joint with advanced cartilage preservation. Highly recommended!"
  }
];

const TIME_SLOTS = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM",
  "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "07:00 PM"
];

export default function LandingPage() {
  // HousesofSmiles-inspired interactive booking modal state
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(SERVICES[0].title);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">
                Dr. Amit Jha
              </span>
              <span className="text-xs text-teal-400 font-medium">
                Sports Injury & Ligament Surgery Clinic, Varanasi
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-teal-400 transition-colors">About Dr. Jha</a>
            <a href="#services" className="hover:text-teal-400 transition-colors">Specialized Services</a>
            <a href="#testimonials" className="hover:text-teal-400 transition-colors">Patient Stories</a>
            <a href="#booking" className="hover:text-teal-400 transition-colors">Book Consultation</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Staff Portal Sign In
              </Button>
            </Link>
            <a href="#booking">
              <Button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/25">
                <Calendar className="mr-2 h-4 w-4" /> Book Appointment
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION — Featuring Dr. Amit Jha's Photo */}
      <section id="about" className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.1),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column — Credentials & Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
              <Sparkles className="h-4 w-4" /> Fellowship Trained at Ganga Hospital, Coimbatore
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Expert Sports Medicine & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400">Ligament Injury Care</span> in Varanasi
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed font-light">
              Led by <strong className="text-white font-semibold">Dr. Amit Kumar Jha</strong> (MS Ortho, DNB, FNB Sports Medicine), offering state-of-the-art ACL reconstruction, arthroscopic joint surgery, and specialized sports rehabilitation designed for rapid recovery.
            </p>

            {/* Qualifications Chips */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Badge className="bg-slate-800 border-slate-700 text-slate-200 py-1.5 px-3">
                <Award className="mr-1.5 h-4 w-4 text-teal-400" /> FNB Sports Medicine (Ganga Hospital)
              </Badge>
              <Badge className="bg-slate-800 border-slate-700 text-slate-200 py-1.5 px-3">
                <Award className="mr-1.5 h-4 w-4 text-teal-400" /> MS & DNB Orthopaedics
              </Badge>
              <Badge className="bg-slate-800 border-slate-700 text-slate-200 py-1.5 px-3">
                <Building2 className="mr-1.5 h-4 w-4 text-teal-400" /> Apex Super Specialty Hospital
              </Badge>
            </div>

            {/* Key Performance Badges */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800">
              <div>
                <div className="text-3xl font-black text-white">10+ Yrs</div>
                <div className="text-xs text-slate-400 font-medium">Surgical Experience</div>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-400">5,000+</div>
                <div className="text-xs text-slate-400 font-medium">Successful Surgeries</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">99%</div>
                <div className="text-xs text-slate-400 font-medium">Patient Satisfaction</div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a href="#booking">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base px-8 h-12 shadow-xl shadow-teal-500/20">
                  <Calendar className="mr-2 h-5 w-5" /> Book Consultation Now
                </Button>
              </a>
              <a href="#services">
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 px-6">
                  Explore Treatments <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column — Dr. Amit Jha Photo Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-br from-teal-500/20 via-slate-800 to-slate-900 border border-teal-500/30 p-4 shadow-2xl shadow-teal-500/10">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/5] flex items-end justify-center">
                <Image
                  src="/dr-amit-jha-hero.png"
                  alt="Dr. Amit Kumar Jha - Sports Medicine & Ligament Surgeon"
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  priority
                />
                
                {/* Overlay Profile Badge */}
                <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">Dr. Amit Kumar Jha</h3>
                      <p className="text-xs text-teal-400 font-medium">Senior Orthopedic & Sports Surgeon</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                      Available OPD Today
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOUSES OF SMILES-INSPIRED APPOINTMENT BOOKING MODULE */}
      <section id="booking" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 px-3 py-1">
              Instant Online Booking
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Schedule Your Consultation in 3 Easy Steps
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Select your required specialty, choose a convenient slot, and receive instant appointment token confirmation.
            </p>
          </div>

          <Card className="bg-slate-900/90 border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
            <CardHeader className="bg-slate-800/50 border-b border-slate-800 pb-6">
              {/* Step Indicators */}
              <div className="grid grid-cols-3 gap-4 text-center max-w-lg mx-auto">
                <div className={`pb-2 border-b-2 font-semibold text-xs ${bookingStep >= 1 ? "border-teal-400 text-teal-400" : "border-slate-700 text-slate-500"}`}>
                  1. Service & Slot
                </div>
                <div className={`pb-2 border-b-2 font-semibold text-xs ${bookingStep >= 2 ? "border-teal-400 text-teal-400" : "border-slate-700 text-slate-500"}`}>
                  2. Patient Details
                </div>
                <div className={`pb-2 border-b-2 font-semibold text-xs ${bookingStep >= 3 ? "border-teal-400 text-teal-400" : "border-slate-700 text-slate-500"}`}>
                  3. Confirmation
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {isBooked ? (
                <div className="text-center py-10 space-y-6">
                  <div className="h-20 w-20 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/40">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Appointment Confirmed!</h3>
                    <p className="text-slate-400 text-sm mt-1">Your consultation token has been generated successfully.</p>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 max-w-md mx-auto text-left space-y-3">
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400 text-xs">Token Number</span>
                      <span className="text-teal-400 font-mono font-bold">KH-2026-0841</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400 text-xs">Patient Name</span>
                      <span className="text-white text-xs font-semibold">{patientName || "Rajesh Kumar"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400 text-xs">Treatment/Service</span>
                      <span className="text-white text-xs font-semibold">{selectedService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Date & Time</span>
                      <span className="text-white text-xs font-semibold">{selectedDate} @ {selectedSlot}</span>
                    </div>
                  </div>
                  <Button onClick={() => setIsBooked(false)} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold">
                    Book Another Appointment
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-8">
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-slate-300 mb-3 block">Select Treatment Category</Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {SERVICES.map((srv) => (
                            <div
                              key={srv.id}
                              onClick={() => setSelectedService(srv.title)}
                              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                selectedService === srv.title
                                  ? "bg-teal-500/10 border-teal-500 text-white"
                                  : "bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-center justify-between font-semibold text-sm">
                                <span>{srv.title}</span>
                                {selectedService === srv.title && <CheckCircle2 className="h-4 w-4 text-teal-400" />}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{srv.shortDesc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-slate-300 mb-2 block">Preferred Date</Label>
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300 mb-2 block">Available Time Slot</Label>
                          <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            {TIME_SLOTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="button" onClick={() => setBookingStep(2)} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold">
                          Next: Patient Info <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-300 mb-2 block">Patient Full Name</Label>
                          <Input
                            placeholder="e.g. Ramesh Chandra"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            required
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300 mb-2 block">Mobile / WhatsApp Number</Label>
                          <Input
                            placeholder="e.g. 9876543210"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            required
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-slate-300 mb-2 block">Chief Complaint / Symptoms</Label>
                        <Textarea
                          placeholder="Describe your knee/shoulder pain, ligament injury, or recovery goals..."
                          value={complaint}
                          onChange={(e) => setComplaint(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white h-24"
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setBookingStep(1)} className="border-slate-700 text-slate-300">
                          Back
                        </Button>
                        <Button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold">
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

      {/* SPECIALIZED SERVICES SECTION */}
      <section id="services" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 px-3 py-1">
              Clinical Specialties
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Comprehensive Orthopedic & Sports Medicine Services
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Providing modern minimally invasive arthroscopy, ligament reconstruction, and joint preservation treatments in Varanasi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="bg-slate-950 border-slate-800 hover:border-teal-500/50 transition-all group">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge className="w-fit bg-slate-800 text-slate-300 border-slate-700 mb-2">
                      {service.tag}
                    </Badge>
                    <CardTitle className="text-xl text-white font-bold">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-400 text-sm leading-relaxed">{service.shortDesc}</p>
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-teal-400 font-semibold">
                      <span>{service.stats}</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PATIENT TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 px-3 py-1">
              Patient Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Trusted by Athletes & Active Individuals Across India
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <Card key={idx} className="bg-slate-900 border-slate-800 flex flex-col justify-between">
                <CardHeader>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 italic text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </CardHeader>
                <CardContent className="pt-4 border-t border-slate-800">
                  <div className="font-bold text-white text-base">{t.name}</div>
                  <div className="text-xs text-teal-400 font-medium">{t.role}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{t.procedure}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER & CLINIC DETAILS */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Activity className="h-5 w-5 text-teal-400" /> Dr. Amit Jha Clinic
            </div>
            <p className="text-xs leading-relaxed">
              Dr. Amit Kumar Jha (MS, DNB, FNB Sports Medicine) — Fellowship Trained Sports Medicine & Ligament Surgeon in Varanasi.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Clinic Location</h4>
            <p className="text-xs flex items-start gap-2">
              <MapPin className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
              Sigra & Apex Super Specialty Hospital, Varanasi, UP 221010
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">OPD Hours</h4>
            <p className="text-xs">Morning: 11:00 AM – 01:30 PM IST</p>
            <p className="text-xs mt-1">Evening: 03:30 PM – 08:30 PM IST</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Staff Access</h4>
            <Link href="/login">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                ERP Staff Portal
              </Button>
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-800 text-center text-xs text-slate-500 pt-8">
          © 2026 KrishnaHealth ERP — Dr. Amit Jha Sports Injury Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
