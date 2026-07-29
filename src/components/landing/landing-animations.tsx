"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Award, Star, CheckCircle2, Activity, MapPin,
  Trophy, Flame, Zap, Dumbbell, Compass, Stethoscope, Bone,
  ShieldAlert, Users, Target, ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BodyNavigatorIsland, type BodyPart } from "@/components/landing/body-navigator-island";
import { BookingWizardIsland, type Service } from "@/components/landing/booking-wizard-island";
import { BookingModal } from "@/components/Booking/BookingModal";
import BodySelectorFeature from "@/components/BodySelector3D/BodySelectorFeature";
import { FeedbackWidget } from "@/components/Feedback/FeedbackWidget";

// ??? ICON MAP (string -> component) ?????????????????????????????????????????
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award, Star, CheckCircle2, Activity, MapPin,
  Trophy, Flame, Zap, Dumbbell, Compass, Stethoscope, Bone,
  ShieldAlert, Users, Target, ShieldCheck,
};

// ??? ANIMATION VARIANTS ??????????????????????????????????????????????????????
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ??? DATA TYPES ??????????????????????????????????????????????????????????????
type SportEntry = {
  sport: string;
  icon: string;
  injuries: string;
  approach: string;
};
type ServiceEntry = {
  id: string;
  type: string;
  badge: string;
  title: string;
  desc: string;
  stats: string;
  icon: string;
};
type RecoveryStage = { stage: string; name: string; desc: string };
type Testimonial = { name: string; role: string; type: string; quote: string; rating: number };

// ??? PROPS ???????????????????????????????????????????????????????????????????
type Props = {
  bodyParts: BodyPart[];
  sportsWeTreat: SportEntry[];
  services: ServiceEntry[];
  recoveryStages: RecoveryStage[];
  testimonials: Testimonial[];
  timeSlots: string[];
};

// ??? COMPONENT ???????????????????????????????????????????????????????????????
export function LandingAnimations({
  bodyParts, sportsWeTreat, services, recoveryStages, testimonials, timeSlots,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  const handleOpenBooking = (partId?: string) => {
    if (partId) setSelectedPartId(partId);
    setModalOpen(true);
  };

  const bookingServices: Service[] = services.map((s) => ({ id: s.id, title: s.title }));

  return (
    <>
      {/* ?? HERO ???????????????????????????????????????????????????????????? */}
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
              4.9{" "}<Star className="h-3.5 w-3.5 fill-amber-400" aria-hidden="true" />{" "}Google Rating
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
            <Button
              size="lg"
              onClick={() => handleOpenBooking()}
              className="w-full sm:w-auto bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black text-base px-8 h-13 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#102321]"
              aria-label="Book an OPD appointment with Dr. Amit Jha"
            >
              Book OPD Appointment
            </Button>
            <a href="#doctor-signature" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white h-13 px-6 focus-visible:ring-2 focus-visible:ring-[#d5f14c]"
                aria-label="View Dr. Amit Jha credentials and qualifications"
              >
                View Credentials
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ?? TRUST ANCHORS ??????????????????????????????????????????????????? */}
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
              { value: "4.9?", label: "GOOGLE RATING", sub: "500+ Verified Reviews", accent: "text-[#d5f14c]" },
              { value: "24-HR", label: "DISCHARGE TIME", sub: "Keyhole Minimally Invasive", accent: "text-white" },
            ].map(({ value, label, sub, accent }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between space-y-2 hover:border-teal-500/30 transition-all duration-300"
              >
                <dt className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">{label}</dt>
                <dd className={`text-3xl sm:text-4xl font-black font-heading animate-count-up ${accent}`}>
                  {value}
                </dd>
                <span className="text-xs text-slate-400 font-medium">{sub}</span>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ?? BODY NAVIGATOR ?????????????????????????????????????????????????? */}
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
            <h2 id="navigator-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
              Interactive Body-Part Selector
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Click on an affected joint or anatomical area to explore common conditions and our treatment approach.
            </p>
          </motion.div>
          <BodySelectorFeature />
        </div>
      </section>

      {/* ?? SPORTS WE TREAT ????????????????????????????????????????????????? */}
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
            <h2 id="sports-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
              Sports We Treat
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Specialist protocols for every athletic discipline ? from elite competition to weekend recreation.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sportsWeTreat.map((item, idx) => {
              const Icon = ICON_MAP[item.icon];
              return (
                <motion.div key={idx} variants={fadeUp} className="h-full">
                  <div className="glass-card border border-slate-800/80 hover:border-teal-500/40 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between h-full group">
                    <div>
                      <div
                        className="h-12 w-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-teal-400 mb-4 group-hover:border-teal-500/50 transition-colors"
                        aria-hidden="true"
                      >
                        {Icon && <Icon className="h-6 w-6" />}
                      </div>
                      <h3 className="text-xl text-white font-bold font-heading mb-3">{item.sport}</h3>
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

      {/* ?? SERVICES ???????????????????????????????????????????????????????? */}
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
            <h2 id="services-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
              Our Services
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Dual-spectrum care covering both general orthopedic patients and elite athletes ? under one roof.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((srv) => {
              const Icon = ICON_MAP[srv.icon];
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
                        {Icon && <Icon className="h-5 w-5" />}
                      </div>
                      <h3 className="text-base text-white font-bold font-heading leading-snug mb-2">{srv.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.desc}</p>
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

      {/* ?? RECOVERY JOURNEY ???????????????????????????????????????????????? */}
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
            <h2 id="recovery-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
              Your Recovery Journey
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              A clear 6-stage pathway from pain to peak performance ? fully transparent, evidence-based.
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
            {recoveryStages.map((stage) => (
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
                  <h3 className="font-bold text-white text-sm font-heading mb-1">{stage.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ?? DOCTOR BIO ?????????????????????????????????????????????????????? */}
      <section
        id="doctor-signature"
        className="py-20 lg:py-28 bg-[#102321] border-b border-slate-800/80 relative overflow-hidden"
        aria-labelledby="doctor-heading"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
              FNB Sports Medicine, MS &amp; DNB Orthopaedics ? Senior Specialist
            </p>
            <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
              Committed to providing evidence-based, compassionate care at Dr. Amit Jha Sports Injury Clinic (Krishna Health). Dr. Jha specializes in comprehensive diagnostic evaluations, keyhole arthroscopy, ACL reconstruction, and personalized treatment plans for optimal patient outcomes.
            </p>
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
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black text-base px-8 focus-visible:ring-2 focus-visible:ring-white"
              >
                Request Appointment
              </Button>
              <a href="#navigator" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white px-6 font-semibold focus-visible:ring-2 focus-visible:ring-[#d5f14c]"
                >
                  Learn More About Us
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500/30 to-emerald-400/20 rounded-full blur-3xl opacity-60 -z-10" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-800/80 bg-slate-900/90 glass-card p-3 group hover:border-teal-500/40 transition-all duration-500">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950/40 aspect-[4/5]">
                <Image
                  src="/dr-amit-jha-cutout.png"
                  alt="Dr. Amit Kumar Jha ? Senior Sports Injury & Orthopedic Specialist, Varanasi"
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 560px"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ?? TESTIMONIALS ???????????????????????????????????????????????????? */}
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
            <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
              Patient Outcomes
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">Real recoveries. Real results.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, idx) => (
              <motion.figure
                key={idx}
                variants={fadeUp}
                className="glass-card border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-teal-500/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
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

      {/* ?? BOOKING WIZARD ?????????????????????????????????????????????????? */}
      <section
        id="booking"
        className="py-20 bg-[#102321] border-b border-slate-800/80"
        aria-labelledby="booking-heading"
      >
        <BookingWizardIsland services={bookingServices} timeSlots={timeSlots} />
      </section>

      {/* ?? QUICK BOOKING MODAL DIALOG ?????????????????????????????????????? */}
      <BookingModal
        isOpen={modalOpen}
        initialPartId={selectedPartId}
        onClose={() => setModalOpen(false)}
      />

      {/* ?? PATIENT FEEDBACK WIDGET ????????????????????????????????????????? */}
      <FeedbackWidget />
    </>
  );
}
