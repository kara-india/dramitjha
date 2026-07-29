// ─── SERVER COMPONENT — no "use client" ────────────────────────────────────

import Link from "next/link";
import { Activity, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNavIsland } from "@/components/landing/mobile-nav-island";
import { LandingAnimations } from "@/components/landing/landing-animations";

const MAPS_URL = "https://maps.app.goo.gl/MNrbv5xXaSqmSh9n6";

const BODY_PARTS = [
  {
    id: "knee",
    name: "Knee Joint",
    icon: "Flame",
    subtitle: "ACL, Meniscus & Cartilage",
    conditions: [
      "ACL & PCL Ligament Tears",
      "Meniscus Radial & Bucket-Handle Tears",
      "Cartilage Defect & Osteochondritis",
      "Knee Osteoarthritis & Patellar Instability",
    ],
    solution: "Anatomic Single/Double Bundle Reconstruction, Keyhole Arthroscopy, HTO Joint Preservation",
    recovery: "Return to Sport in 6\u20139 Months",
  },
  {
    id: "shoulder",
    name: "Shoulder Joint",
    icon: "Zap",
    subtitle: "Instability, Labrum & Rotator Cuff",
    conditions: [
      "Recurrent Shoulder Dislocation (Bankart Lesion)",
      "Rotator Cuff Tear & Tendonitis",
      "SLAP Tear & Frozen Shoulder",
      "Acromioclavicular (AC) Joint Sprains",
    ],
    solution: "Arthroscopic Bankart Repair, Rotator Cuff Anchoring, Capsular Shift",
    recovery: "Full Overhead Motion in 3\u20134 Months",
  },
  {
    id: "elbow-wrist",
    name: "Elbow & Wrist",
    icon: "Target",
    subtitle: "Tennis Elbow & Tendon Injuries",
    conditions: [
      "Lateral Epicondylitis (Tennis Elbow)",
      "Golfer's Elbow & UCL Tears",
      "TFCC Wrist Complex Tears",
      "Carpal Tunnel Syndrome",
    ],
    solution: "Biological Injections, Tendon Release, Arthroscopic Wrist Debridement",
    recovery: "Functional Mobility in 4\u20136 Weeks",
  },
  {
    id: "hip-spine",
    name: "Hip & Spine",
    icon: "Bone",
    subtitle: "Joint Pain & Core Misalignment",
    conditions: [
      "Femoroacetabular Impingement (FAI)",
      "Hip Labral Tears & Bursitis",
      "Lumbar Strain & Lower Back Pain",
      "Sacroiliac (SI) Joint Dysfunction",
    ],
    solution: "Hip Arthroscopy, Core Biomechanical Realignment, Targeted Rehab",
    recovery: "Pain-Free Activity",
  },
  {
    id: "ankle-foot",
    name: "Ankle & Foot",
    icon: "Compass",
    subtitle: "Ligament Sprains & Achilles Care",
    conditions: [
      "ATFL / CFL Ankle Ligament Sprains",
      "Achilles Tendon Rupture & Tendonitis",
      "Plantar Fasciitis & Heel Spurs",
      "Ankle Impingement & Instability",
    ],
    solution: "Ankle Arthroscopy, Ligament Reconstruction, Achilles Repair",
    recovery: "Impact Readiness in 8\u201312 Weeks",
  },
  {
    id: "pediatric",
    name: "Pediatric & Growth Plate",
    icon: "Users",
    subtitle: "Child Bone & Deformity Care",
    conditions: [
      "Pediatric Ligament Injuries",
      "Knock Knees (Genu Valgum) & Bow Legs",
      "Flat Feet & Clubfoot Deformity",
      "Growth Plate Fractures & Alignment Issues",
    ],
    solution: "Growth-Plate Sparing Repair, Deformity Correction, Custom Bracing",
    recovery: "Child-Safe Protocol",
  },
];

const SPORTS_WE_TREAT = [
  {
    sport: "Cricket",
    icon: "Trophy",
    injuries: "Rotator Cuff Tears, ACL Twists, Lumbar Stress Fractures",
    approach: "Fast-bowling biomechanics review & shoulder labral repair.",
  },
  {
    sport: "Football",
    icon: "Flame",
    injuries: "ACL/PCL Tears, Meniscus Injuries, Hamstring Pulls",
    approach: "High-impact pivot stabilization & anatomic autograft reconstruction.",
  },
  {
    sport: "Running & Marathons",
    icon: "Activity",
    injuries: "Runner's Knee, IT Band Syndrome, Achilles Tendonitis",
    approach: "Gait bio-feedback, footwear alignment & tendon shockwave care.",
  },
  {
    sport: "Gym & CrossFit",
    icon: "Dumbbell",
    injuries: "Shoulder Impingement, Meniscus Flaps, Lower Back Strain",
    approach: "Joint-sparing lifting protocols & arthroscopic repairs.",
  },
  {
    sport: "Badminton & Tennis",
    icon: "Zap",
    injuries: "Tennis Elbow, Shoulder SLAP Tears, Ankle Sprains",
    approach: "Overhead racquet arm biomechanics & ligament bracing.",
  },
  {
    sport: "Cycling",
    icon: "Compass",
    injuries: "Patellofemoral Pain, Collarbone Fractures, Hip Bursitis",
    approach: "Saddle-height joint mechanics & trauma fracture fixation.",
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
    icon: "Stethoscope",
  },
  {
    id: "acl-reconstruction",
    type: "sports",
    badge: "Sports Medicine",
    title: "ACL & Multiligament Reconstruction",
    desc: "Anatomic single and double-bundle ACL & PCL reconstruction using biological autografts engineered for elite athletes and active individuals.",
    stats: "98.5% Return-to-Play Rate",
    icon: "Flame",
  },
  {
    id: "arthroscopy",
    type: "sports",
    badge: "Minimally Invasive Keyhole",
    title: "Knee & Shoulder Arthroscopy",
    desc: "Ultra-precise keyhole procedures for meniscus repair, cartilage restoration, Bankart repair, and shoulder stabilization with minimal tissue trauma.",
    stats: "24-Hour Hospital Discharge",
    icon: "Zap",
  },
  {
    id: "trauma-fractures",
    type: "general",
    badge: "Emergency Trauma",
    title: "Emergency Fracture & Trauma Management",
    desc: "Urgent emergency triage for bone fractures, dislocations, rigid immobilization, plaster casting, and ORIF surgical fixation.",
    stats: "Priority Triage Available",
    icon: "ShieldAlert",
  },
  {
    id: "joint-preservation",
    type: "general",
    badge: "Joint Preservation",
    title: "Joint Preservation & Realignment (HTO/OATS)",
    desc: "High Tibial Osteotomy (HTO), OATS, and biological cartilage restoration designed to preserve the native knee and prevent total joint replacement.",
    stats: "Delays Joint Replacement",
    icon: "Bone",
  },
  {
    id: "pediatric-ortho",
    type: "general",
    badge: "Pediatric Orthopedics",
    title: "Pediatric Growth Plate & Deformity Correction",
    desc: "Specialized pediatric care for growth-plate injuries, knock knees, bow legs, flat feet, and pediatric sports injuries.",
    stats: "Child-Safe Protocols",
    icon: "Users",
  },
  {
    id: "sports-rehab",
    type: "rehab",
    badge: "Specialized Rehab",
    title: "Physiotherapy & Athlete Performance Rehab",
    desc: "Dedicated 30-minute private slots (11:00 AM \u2013 1:30 PM & 3:30 PM \u2013 8:30 PM IST) for 5-phase ACL rehab, electrotherapy, and return-to-sport testing.",
    stats: "Dedicated 30-min Slots",
    icon: "Dumbbell",
  },
];

const RECOVERY_STAGES = [
  { stage: "01", name: "Symptom & Pain Assessment", desc: "Initial physical examination, range of motion & joint stability testing." },
  { stage: "02", name: "Precision Bio-Imaging", desc: "High-resolution MRI & digital X-ray review for exact anatomical mapping." },
  { stage: "03", name: "Targeted Treatment Plan", desc: "Tailored choice between biological preservation or keyhole surgery." },
  { stage: "04", name: "Minimally Invasive Surgery", desc: "Keyhole arthroscopy with 24-hr discharge and minimal tissue disruption." },
  { stage: "05", name: "Guided 5-Phase Physiotherapy", desc: "Private 30-min rehab slots, ROM expansion & progressive muscle building." },
  { stage: "06", name: "Return to Sport Clearance", desc: "Biomechanical testing and athletic clearance for 100% field readiness." },
];

const TESTIMONIALS = [
  {
    name: "Rajesh K. Verma",
    role: "State Level Footballer",
    type: "ACL Reconstruction",
    quote: "Dr. Amit Jha diagnosed my ACL tear instantly. The anatomic reconstruction and guided rehab got me back on the pitch in 6 months with 100% knee stability!",
    rating: 5,
  },
  {
    name: "Smt. Sunita Devi",
    role: "General Patient (Age 54)",
    type: "Knee Arthritis & Joint Preservation",
    quote: "I was struggling with severe knee pain for 3 years. Dr. Amit Jha's joint preservation checkup gave me back smooth, painless walking without knee replacement.",
    rating: 5,
  },
  {
    name: "Vikramaditya Singh",
    role: "Marathon Runner",
    type: "Meniscus Repair & Cartilage Care",
    quote: "The best sports injury specialist in Poorvanchal. Keyhole surgery, minimal scar, negligible pain, and a highly scientific return-to-running protocol.",
    rating: 5,
  },
];

const TIME_SLOTS = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM",
  "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "07:00 PM", "08:00 PM",
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#fcfbf8] text-stone-800 font-sans selection:bg-[#c89b2a]/30 selection:text-stone-900 relative overflow-x-hidden"
      role="main"
    >
      {/* Header — cream / gold system matching landing body */}
      <header
        className="sticky top-0 z-50 glass-header"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm"
          >
            <div
              className="h-10 w-10 rounded-xl bg-[#c89b2a] flex items-center justify-center text-white font-black shadow-md"
              aria-hidden="true"
            >
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-stone-900 leading-none">
                Dr. Amit Jha
              </span>
              <span className="text-[10px] font-mono text-[#96721b] tracking-wider uppercase mt-0.5">
                Sports Medicine Clinic
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5e8c7]/80 border border-[#c89b2a]/35 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#c89b2a] animate-pulse" aria-hidden="true" />
            <span className="text-stone-700 font-medium">OPD QUEUE ACTIVE</span>
            <span className="text-stone-400">•</span>
            <span className="text-[#96721b] font-bold">11:00 AM \u2013 8:30 PM</span>
          </div>

          <nav
            className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-600"
            aria-label="Primary navigation"
          >
            <a href="#about" className="hover:text-[#c89b2a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm px-1">About</a>
            <a href="#navigator" className="hover:text-[#c89b2a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm px-1">Body Navigator</a>
            <a href="#sports" className="hover:text-[#c89b2a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm px-1">Sports We Treat</a>
            <Link href="/services" className="hover:text-[#c89b2a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm px-1">Services</Link>
            <a href="#booking" className="hover:text-[#c89b2a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm px-1">Book OPD</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="text-stone-700 hover:text-stone-900 hover:bg-[#f5e8c7]/50 border border-[#c89b2a]/40 text-xs font-mono focus-visible:ring-2 focus-visible:ring-[#c89b2a]"
                aria-label="Staff ERP Portal login"
              >
                Staff ERP
              </Button>
            </Link>
            <MobileNavIsland />
          </div>
        </div>
      </header>

      <LandingAnimations
        bodyParts={BODY_PARTS}
        sportsWeTreat={SPORTS_WE_TREAT}
        services={SERVICES}
        recoveryStages={RECOVERY_STAGES}
        testimonials={TESTIMONIALS}
        timeSlots={TIME_SLOTS}
      />

      <footer
        className="py-12 bg-stone-900 text-stone-400 text-xs border-t border-stone-800"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-base">
              <Activity className="h-5 w-5 text-[#c89b2a]" aria-hidden="true" />
              Dr. Amit Jha Clinic
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Fellowship Trained Sports Medicine & Orthopedic Surgeon (FNB Ganga Hospital, MS, DNB).
            </p>
          </div>

          <address className="not-italic">
            <h2 className="text-white font-bold mb-2 not-italic text-xs uppercase tracking-wider">
              Location & OPD
            </h2>
            <p className="text-stone-400 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-[#c89b2a] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Sigra &amp; Apex Super Specialty Hospital, Varanasi, UP
                <br />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c89b2a] hover:text-[#d4af37] underline underline-offset-2 mt-1 inline-block"
                >
                  Open in Google Maps
                </a>
              </span>
            </p>
          </address>

          <nav aria-label="Footer navigation">
            <h2 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">Navigation</h2>
            <div className="flex flex-col space-y-2">
              <a href="#about" className="hover:text-[#c89b2a] transition-colors">About Dr. Jha</a>
              <Link href="/services" className="hover:text-[#c89b2a] transition-colors">Our Services</Link>
              <a href="#booking" className="hover:text-[#c89b2a] transition-colors">Book Appointment</a>
              <Link href="/login" className="hover:text-[#c89b2a] transition-colors">Staff ERP Portal</Link>
            </div>
          </nav>

          <div>
            <h2 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">OPD Hours</h2>
            <p className="text-stone-400">Morning: 11:00 AM \u2013 1:30 PM IST</p>
            <p className="text-slate-400 mt-1">Evening: 3:30 PM \u2013 8:30 PM IST</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-stone-800 text-center text-stone-500 pt-6">
          \u00A9 2026 KrishnaHealth ERP \u2014 Dr. Amit Jha Sports Injury & Orthopedic Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
