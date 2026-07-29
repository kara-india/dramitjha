"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Award, Star, CheckCircle2, Activity, MapPin,
  Trophy, Flame, Zap, Dumbbell, Compass, Stethoscope, Bone,
  ShieldAlert, Users, Target, ShieldCheck, Sparkles, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BodyNavigatorIsland, type BodyPart } from "@/components/landing/body-navigator-island";
import { BookingWizardIsland, type Service } from "@/components/landing/booking-wizard-island";
import { BookingModal } from "@/components/Booking/BookingModal";
import BodySelectorFeature from "@/components/BodySelector3D/BodySelectorFeature";
import { FeedbackWidget } from "@/components/Feedback/FeedbackWidget";
import HeroBone from "@/components/HeroBone/HeroBone";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award, Star, CheckCircle2, Activity, MapPin,
  Trophy, Flame, Zap, Dumbbell, Compass, Stethoscope, Bone,
  ShieldAlert, Users, Target, ShieldCheck,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

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

type Props = {
  bodyParts: BodyPart[];
  sportsWeTreat: SportEntry[];
  services: ServiceEntry[];
  recoveryStages: RecoveryStage[];
  testimonials: Testimonial[];
  timeSlots: string[];
};

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
      {/* HERO */}
      <section
        id="about"
        className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#fcfbf8] via-[#f8f5ee] to-[#f2ede4] border-b border-[#c89b2a]/20"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-4">
              <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest font-semibold">
                // CLINICAL PRECISION // VARANASI OPD
              </Badge>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.08] font-heading"
              >
                Recover Faster.{" "}
                <br />
                <span className="gold-text-gradient">Move Better.</span>
              </h1>
              <p className="text-stone-700 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Specialized keyhole arthroscopy, ACL reconstruction, joint preservation &amp; comprehensive sports rehabilitation tailored to get you back to peak activity safely.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1 text-xs sm:text-sm font-semibold text-stone-800"
              aria-label="Dr. Amit Jha credentials"
            >
              <span className="bg-white/90 px-3.5 py-2 rounded-xl border border-[#c89b2a]/30 font-mono text-stone-800 flex items-center gap-2 shadow-sm">
                <Award className="h-4 w-4 text-[#c89b2a]" aria-hidden="true" />
                FNB Sports Medicine (Ganga Hospital)
              </span>
              <span className="bg-white/90 px-3.5 py-2 rounded-xl border border-[#c89b2a]/30 font-mono text-[#96721b] flex items-center gap-1.5 shadow-sm">
                4.9{" "}<Star className="h-3.5 w-3.5 fill-[#c89b2a] text-[#c89b2a]" aria-hidden="true" />{" "}Google Rating
              </span>
              <span className="bg-white/90 px-3.5 py-2 rounded-xl border border-[#c89b2a]/30 font-mono text-stone-900 font-bold shadow-sm">
                5,000+ Surgeries
              </span>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto gold-gradient-btn font-black text-base px-8 h-13"
                aria-label="Book an OPD appointment with Dr. Amit Jha"
              >
                Book OPD Appointment
              </Button>
              <a href="#doctor-signature" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-white border-[#c89b2a]/40 text-stone-800 hover:bg-[#f5e8c7]/50 h-13 px-6 font-bold shadow-sm"
                  aria-label="View Dr. Amit Jha credentials and qualifications"
                >
                  View Credentials
                </Button>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <HeroBone onBook={() => handleOpenBooking()} />
          </motion.div>
        </div>
      </section>

      {/* TRUST ANCHORS */}
      <section
        className="py-10 bg-[#f5f2eb] border-b border-[#c89b2a]/20"
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
              { value: "5,000+", label: "SURGICAL PROCEDURES", sub: "Anatomic Precision", accent: "text-stone-900" },
              { value: "98.5%", label: "RETURN-TO-SPORT", sub: "ACL & Arthroscopy", accent: "gold-text-gradient" },
              { value: "4.9★", label: "GOOGLE RATING", sub: "500+ Verified Reviews", accent: "text-[#96721b]" },
              { value: "24-HR", label: "DISCHARGE TIME", sub: "Keyhole Minimally Invasive", accent: "text-stone-900" },
            ].map(({ value, label, sub, accent }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="glass-card bg-white rounded-2xl p-5 border border-[#c89b2a]/25 flex flex-col justify-between space-y-2 hover:border-[#c89b2a]/50 transition-all duration-300 shadow-sm"
              >
                <dt className="text-[10px] font-mono tracking-widest text-stone-500 uppercase font-semibold">{label}</dt>
                <dd className={`text-3xl sm:text-4xl font-black font-heading ${accent}`}>
                  {value}
                </dd>
                <span className="text-xs text-stone-600 font-medium">{sub}</span>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* BODY NAVIGATOR */}
      <section
        id="navigator"
        className="py-20 bg-[#fcfbf8] border-b border-[#c89b2a]/20"
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
            <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3 py-1 text-xs font-mono uppercase tracking-widest font-semibold">
              DIAGNOSTIC ARCHITECTURE
            </Badge>
            <h2 id="navigator-heading" className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading">
              Interactive Body-Part Selector
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-sm font-medium">
              Click on an affected joint or anatomical area to explore common conditions and our treatment approach.
            </p>
          </motion.div>
          <BodySelectorFeature />
        </div>
      </section>

      {/* SPORTS WE TREAT */}
      <section
        id="sports"
        className="py-20 bg-[#f5f2eb] border-b border-[#c89b2a]/20"
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
            <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3 py-1 text-xs font-mono uppercase tracking-widest font-semibold">
              ATHLETIC PROTOCOLS
            </Badge>
            <h2 id="sports-heading" className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading">
              Sports We Treat
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto text-sm font-medium">
              Specialist protocols for every athletic discipline — from elite competition to weekend recreation.
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
                  <div className="glass-card bg-white border border-[#c89b2a]/30 hover:border-[#c89b2a]/60 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between h-full shadow-sm group">
                    <div>
                      <div
                        className="h-12 w-12 rounded-xl bg-[#f5e8c7]/60 border border-[#c89b2a]/30 flex items-center justify-center text-[#c89b2a] mb-4 group-hover:border-[#c89b2a]/60 transition-colors"
                        aria-hidden="true"
                      >
                        {Icon && <Icon className="h-6 w-6" />}
                      </div>
                      <h3 className="text-xl text-stone-900 font-bold font-heading mb-3">{item.sport}</h3>
                      <p className="text-xs text-stone-700 leading-relaxed mb-3">
                        <strong className="text-stone-900">Common Injuries:</strong> {item.injuries}
                      </p>
                    </div>
                    <p className="text-xs text-[#96721b] font-semibold pt-3 border-t border-stone-200">
                      <strong className="text-stone-900">Care Approach:</strong> {item.approach}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SERVICES TEASER → /services */}
      <section
        id="services"
        className="py-20 bg-[#fcfbf8] border-b border-[#c89b2a]/20"
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center space-y-4 mb-10"
          >
            <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3 py-1 text-xs font-mono uppercase tracking-widest font-semibold">
              CLINICAL SPECTRUM
            </Badge>
            <h2 id="services-heading" className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading">
              Our Services
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-sm font-medium">
              Full procedure lists, sports protocols, and body-part pathways live on the dedicated Services page — filtered the way patients actually search.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
          >
            {services.slice(0, 3).map((srv) => {
              const Icon = ICON_MAP[srv.icon];
              return (
                <motion.div key={srv.id} variants={fadeUp}>
                  <div className="glass-card bg-white border border-[#c89b2a]/30 rounded-2xl p-5 h-full shadow-sm">
                    <Badge className="w-fit text-[10px] font-mono mb-2 bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 font-semibold">
                      {srv.badge}
                    </Badge>
                    <div className="flex items-center gap-2 mb-2">
                      {Icon && <Icon className="h-4 w-4 text-[#c89b2a]" />}
                      <h3 className="text-sm text-stone-900 font-bold font-heading leading-snug">{srv.title}</h3>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2">{srv.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex justify-center"
          >
            <Link href="/services">
              <Button size="lg" className="gold-gradient-btn font-black text-base px-8 gap-2">
                Browse all services by sport &amp; body part
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* RECOVERY JOURNEY */}
      <section
        className="py-20 bg-[#f5f2eb] border-b border-[#c89b2a]/20"
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
            <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3 py-1 text-xs font-mono uppercase tracking-widest font-semibold">
              INSTRUMENTED CONTINUUM
            </Badge>
            <h2 id="recovery-heading" className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading">
              Your Recovery Journey
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto text-sm font-medium">
              A clear 6-stage pathway from pain to peak performance — fully transparent, evidence-based.
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
                className="glass-card bg-white border border-[#c89b2a]/30 rounded-2xl p-6 flex gap-4 hover:border-[#c89b2a]/60 transition-all duration-300 shadow-sm"
              >
                <span
                  className="text-3xl sm:text-4xl font-black font-heading gold-text-gradient leading-none shrink-0 select-none"
                  aria-hidden="true"
                >
                  {stage.stage}
                </span>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm font-heading mb-1">{stage.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{stage.desc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* DOCTOR BIO */}
      <section
        id="doctor-signature"
        className="py-20 lg:py-28 bg-[#fcfbf8] border-b border-[#c89b2a]/20 relative overflow-hidden"
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
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f5e8c7] border border-[#c89b2a]/40 text-[#96721b] text-xs font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#c89b2a]" aria-hidden="true" />
              LEAD PHYSICIAN &amp; SURGEON
            </div>
            <h2
              id="doctor-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight font-heading"
            >
              Dr. Amit Kumar Jha
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[#96721b] font-mono">
              FNB Sports Medicine, MS &amp; DNB Orthopaedics — Senior Specialist
            </p>
            <p className="text-base text-stone-700 leading-relaxed max-w-3xl font-medium">
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
                  className="flex items-start gap-3 glass-card bg-white p-3.5 rounded-xl border border-[#c89b2a]/30 text-xs shadow-sm"
                >
                  <Award className="h-5 w-5 text-[#c89b2a] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-stone-900 block font-heading">{title}</strong>
                    <span className="text-stone-600">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto gold-gradient-btn font-black text-base px-8"
              >
                Request Appointment
              </Button>
              <a href="#navigator" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-white border-[#c89b2a]/40 text-stone-800 hover:bg-[#f5e8c7]/50 px-6 font-bold shadow-sm"
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
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#d4af37]/20 to-[#c89b2a]/10 rounded-full blur-3xl opacity-60 -z-10" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-[#c89b2a]/40 bg-white p-3 group hover:border-[#c89b2a] transition-all duration-500">
              <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-[4/5]">
                <Image
                  src="/dr-amit-jha-cutout.png"
                  alt="Dr. Amit Kumar Jha — Senior Sports Injury & Orthopedic Specialist, Varanasi"
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

      {/* TESTIMONIALS */}
      <section
        className="py-20 bg-[#f5f2eb] border-b border-[#c89b2a]/20"
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
            <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3 py-1 text-xs font-mono uppercase tracking-wider font-semibold">
              VERIFIED OUTCOMES
            </Badge>
            <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading">
              Patient Outcomes
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto text-sm font-medium">Real recoveries. Real results.</p>
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
                className="glass-card bg-white border border-[#c89b2a]/30 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-[#c89b2a]/60 transition-all duration-300 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#c89b2a] text-[#c89b2a]" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-stone-700 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="border-t border-stone-200 pt-4">
                  <strong className="text-stone-900 text-sm block font-heading">{t.name}</strong>
                  <span className="text-xs text-stone-500 block font-medium">{t.role}</span>
                  <Badge className="mt-2 bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 text-[11px] font-mono font-semibold">
                    {t.type}
                  </Badge>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOOKING */}
      <section
        id="booking"
        className="py-20 bg-[#fcfbf8] border-b border-[#c89b2a]/20"
        aria-labelledby="booking-heading"
      >
        <BookingWizardIsland services={bookingServices} timeSlots={timeSlots} />
      </section>

      <BookingModal
        isOpen={modalOpen}
        initialPartId={selectedPartId}
        onClose={() => setModalOpen(false)}
      />

      <FeedbackWidget />
    </>
  );
}
