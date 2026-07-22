"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Activity,
  Clock,
  Calendar as CalendarIcon,
  Users,
  Stethoscope,
  ChevronRight,
  IndianRupee,
  Award,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DoctorDashboardPage() {
  const [opdStatus, setOpdStatus] = useState<"ACTIVE" | "IN_SURGERY" | "ON_BREAK">("ACTIVE");

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* HousesofSmiles-style Doctor Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-blue-950 p-6 text-white shadow-xl border border-teal-800/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-teal-400/50 shadow-lg shrink-0 bg-slate-950">
              <Image
                src="/dr-amit-jha-hero.png"
                alt="Dr. Amit Kumar Jha"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">Dr. Amit Kumar Jha</h1>
                <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                  <Award className="mr-1 h-3 w-3" /> FNB Ganga Hospital
                </Badge>
              </div>
              <p className="text-xs text-teal-300 font-medium">
                Senior Sports Medicine & Ligament Injury Surgeon • Orthopedic Department
              </p>
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5 text-teal-400" /> Morning OPD: 11:00 AM – 1:30 PM</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-teal-400" /> Evening OPD: 3:30 PM – 8:30 PM</span>
              </div>
            </div>
          </div>

          {/* HousesofSmiles OPD Live Status Toggle */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setOpdStatus("ACTIVE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  opdStatus === "ACTIVE" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Active OPD
              </button>
              <button
                onClick={() => setOpdStatus("IN_SURGERY")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  opdStatus === "IN_SURGERY" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                In OT Surgery
              </button>
              <button
                onClick={() => setOpdStatus("ON_BREAK")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  opdStatus === "ON_BREAK" ? "bg-blue-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                On Break
              </button>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-teal-400" /> Live Clinic OPD Queue Status
            </span>
          </div>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Top KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients Waiting</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 Patients</div>
                <p className="text-xs text-muted-foreground mt-1">Average wait time: ~12 mins</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-l-4 border-l-teal-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultations Today</CardTitle>
                <Activity className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14 Completed</div>
                <p className="text-xs text-muted-foreground mt-1">9 Ortho / 5 Physio Sessions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">OT Surgeries Scheduled</CardTitle>
                <Stethoscope className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 Cases</div>
                <p className="text-xs text-muted-foreground mt-1">ACL & Shoulder Arthroscopy</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-l-4 border-l-emerald-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹ 42,500</div>
                <p className="text-xs text-emerald-600 font-semibold mt-1">+18% vs yesterday</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live Patient Queue (HousesofSmiles-inspired) */}
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg text-teal-900 dark:text-teal-100 flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" /> Today&apos;s Live Patient Queue
                </CardTitle>
                <CardDescription>
                  Click &apos;Start Consultation&apos; to launch patient EMR & SOAP note interface
                </CardDescription>
              </div>
              <Link href="/appointments">
                <Button variant="outline" size="sm">
                  View Full Schedule <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Queue #</TableHead>
                    <TableHead>Patient Name & MRN</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Condition / Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-teal-50/50 dark:bg-teal-950/20 font-medium">
                    <TableCell className="font-bold text-teal-700"># 01</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Rajesh Kumar Verma</p>
                        <p className="text-xs font-mono text-slate-500">KH-2026-0084</p>
                      </div>
                    </TableCell>
                    <TableCell>11:30 AM</TableCell>
                    <TableCell>Right Knee ACL Tear (Post-MRI Review)</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                        In Progress
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/consultations/demo-id-1">
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                          <Stethoscope className="mr-1.5 h-4 w-4" /> Resume EMR
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold"># 02</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">Pooja Srivastava</p>
                        <p className="text-xs font-mono text-slate-500">KH-2026-0091</p>
                      </div>
                    </TableCell>
                    <TableCell>12:00 PM</TableCell>
                    <TableCell>Left Shoulder Instability</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Waiting (5m)
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/consultations/demo-id-2">
                        <Button size="sm" variant="outline" className="text-teal-700 border-teal-300 hover:bg-teal-50">
                          <Play className="mr-1.5 h-3.5 w-3.5 fill-teal-700" /> Start Consultation
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold"># 03</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">Vikramaditya Singh</p>
                        <p className="text-xs font-mono text-slate-500">KH-2026-0098</p>
                      </div>
                    </TableCell>
                    <TableCell>12:30 PM</TableCell>
                    <TableCell>Physiotherapy Session (Phase 2 ACL)</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Physio Slot
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/consultations/demo-id-3">
                        <Button size="sm" variant="outline" className="text-slate-700">
                          <FileText className="mr-1.5 h-3.5 w-3.5" /> View Notes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
