"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Stethoscope, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export type Service = { id: string; title: string };

const WHY_BOOK = [
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
];

export function BookingWizardIsland({
  services,
  timeSlots,
}: {
  services: Service[];
  timeSlots: string[];
}) {
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(services[0]?.title ?? "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [complaint, setComplaint] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
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
          <h2 id="booking-heading" className="text-3xl font-extrabold text-white">
            Why Book Here?
          </h2>
          <div className="space-y-6" role="list">
            {WHY_BOOK.map(({ icon: Icon, title, desc }) => (
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
                {[
                  { num: 1, label: "01. SERVICE & SLOT" },
                  { num: 2, label: "02. PATIENT INFO" },
                ].map(({ num, label }) => (
                  <div
                    key={num}
                    className={`pb-2 border-b-2 font-bold transition-colors ${
                      bookingStep >= num
                        ? "border-[#d5f14c] text-[#d5f14c]"
                        : "border-slate-800 text-slate-600"
                    }`}
                    role="tab"
                    aria-selected={bookingStep === num}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8">
              {isBooked ? (
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
                      <dd className="text-white font-bold">{patientName || "Patient"}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-2">
                      <dt className="text-slate-400">Service</dt>
                      <dd className="text-white font-semibold">{selectedService}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Date &amp; Time Slot</dt>
                      <dd className="text-teal-400 font-bold">
                        {selectedDate} @ {selectedSlot}
                      </dd>
                    </div>
                  </dl>
                  <Button
                    onClick={() => { setIsBooked(false); setBookingStep(1); }}
                    className="bg-[#d5f14c] hover:bg-[#c4df3b] text-[#102321] font-black focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Book Another Appointment
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-label="OPD appointment booking form">
                  {/* Step 1 */}
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <fieldset>
                        <legend className="text-slate-300 mb-3 block text-xs font-mono font-bold uppercase tracking-widest">
                          // SELECT REQUIRED SERVICE
                        </legend>
                        <div className="grid sm:grid-cols-2 gap-3" role="listbox" aria-label="Select a service">
                          {services.map((srv) => (
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
                                  <CheckCircle2 className="h-4 w-4 text-[#d5f14c] shrink-0" aria-hidden="true" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="preferred-date" className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider">
                            Preferred Date
                          </Label>
                          <Input
                            id="preferred-date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-[#0c1a18] border-slate-800 text-white focus-visible:ring-teal-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="time-slot" className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider">
                            Available Time Slot
                          </Label>
                          <select
                            id="time-slot"
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full h-10 px-3 rounded-md bg-[#0c1a18] border border-slate-800 text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 font-mono"
                          >
                            <optgroup label="Morning OPD (11:00 AM – 1:30 PM)">
                              {timeSlots.slice(0, 5).map((s) => <option key={s} value={s}>{s}</option>)}
                            </optgroup>
                            <optgroup label="Evening OPD (3:30 PM – 8:30 PM)">
                              {timeSlots.slice(5).map((s) => <option key={s} value={s}>{s}</option>)}
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
                          Next: Patient Details <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="patient-name" className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider">
                            Patient Full Name <span className="text-red-400" aria-label="required">*</span>
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
                          />
                        </div>
                        <div>
                          <Label htmlFor="patient-phone" className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider">
                            Mobile Number <span className="text-red-400" aria-label="required">*</span>
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
                        <Label htmlFor="complaint" className="text-slate-300 mb-2 block text-xs font-mono font-bold uppercase tracking-wider">
                          Symptoms / Notes
                        </Label>
                        <Textarea
                          id="complaint"
                          placeholder="Describe joint pain, injury, or request..."
                          value={complaint}
                          onChange={(e) => setComplaint(e.target.value)}
                          className="bg-[#0c1a18] border-slate-800 text-white h-24 focus-visible:ring-teal-500"
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
  );
}
