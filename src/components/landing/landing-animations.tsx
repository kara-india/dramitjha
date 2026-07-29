"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Award, Star, CheckCircle2, Activity, MapPin,
  Trophy, Flame, Zap, Dumbbell, Compass, Stethoscope, Bone,
  ShieldAlert, Users, Target, ShieldCheck, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type BodyPart } from "@/components/landing/body-navigator-island";
import { type Service } from "@/components/landing/booking-wizard-island";
import { BookingModal } from "@/components/Booking/BookingModal";
import BodySelectorFeature from "@/components/BodySelector3D/BodySelectorFeature";
import { FeedbackWidget } from "@/components/Feedback/FeedbackWidget";
import { LocateUsWidget } from "@/components/LocateUs/LocateUsWidget";
import SpineNavigator from "@/components/SpineNavigator/SpineNavigator";

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
  sportsWeTreat, services,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  const handleOpenBooking = (partId?: string) => {
    if (partId) setSelectedPartId(partId);
    setModalOpen(true);
  };

  void services;

  return (
    <>
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
              <Link href="/services" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-white border-[#c89b2a]/40 text-stone-800 hover:bg-[#f5e8c7]/50 h-13 px-6 font-bold shadow-sm"
                >
                  Browse Services
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <SpineNavigator onBook={() => handleOpenBooking()} />
          </motion.div>
        </div>
      </section>

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
          <div className="mt-10 flex justify-center">
            <Link href="/services">
              <Button className="gold-gradient-btn font-bold gap-2">
                Filter services by sport
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="booking"
        className="py-20 bg-[#fcfbf8] border-b border-[#c89b2a]/20"
        aria-labelledby="booking-heading"
      >
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3 py-1 text-xs font-mono uppercase tracking-widest font-semibold">
            DIRECT RESERVATION
          </Badge>
          <h2 id="booking-heading" className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading">
            Book Your OPD Slot
          </h2>
          <p className="text-stone-600 text-sm font-medium max-w-xl mx-auto">
            One booking flow for the whole site — same form whether you start from the hero, a spine vertebra, or here.
          </p>
          <ul className="grid sm:grid-cols-3 gap-4 text-left text-sm text-stone-700">
            <li className="bg-white border border-[#c89b2a]/25 rounded-xl p-4">
              <Stethoscope className="h-5 w-5 text-[#c89b2a] mb-2" />
              <strong className="block text-stone-900">Expert diagnosis</strong>
              Fellowship-trained specialist consultation.
            </li>
            <li className="bg-white border border-[#c89b2a]/25 rounded-xl p-4">
              <Activity className="h-5 w-5 text-[#c89b2a] mb-2" />
              <strong className="block text-stone-900">Live OPD queue</strong>
              Token secures a dedicated time slot.
            </li>
            <li className="bg-white border border-[#c89b2a]/25 rounded-xl p-4">
              <Award className="h-5 w-5 text-[#c89b2a] mb-2" />
              <strong className="block text-stone-900">Clear plans</strong>
              Surgical vs non-surgical guidance.
            </li>
          </ul>
          <Button
            size="lg"
            onClick={() => handleOpenBooking()}
            className="gold-gradient-btn font-black text-base px-10"
          >
            Book OPD Appointment
          </Button>
        </div>
      </section>

      <BookingModal
        isOpen={modalOpen}
        initialPartId={selectedPartId}
        onClose={() => setModalOpen(false)}
      />

      <LocateUsWidget />
      <FeedbackWidget />
    </>
  );
}
