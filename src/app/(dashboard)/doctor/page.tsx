"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Clock, Calendar as CalendarIcon, Users, Stethoscope, ChevronRight, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DoctorDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-teal-900 dark:text-teal-100">
          Doctor Workspace
        </h2>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Top KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waiting</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">Patients in queue</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Activity className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">Consultations today</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
                <IndianRupee className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1.2L</div>
                <p className="text-xs text-muted-foreground mt-1">Estimated share</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <CalendarIcon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">Appointments left</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div variants={item} className="col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-teal-600" /> Today's Patient Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient Info</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { time: "10:30 AM", name: "Anil Kapoor", mrn: "MRN-2026-001", status: "In Progress" },
                      { time: "11:00 AM", name: "Sunita Sharma", mrn: "MRN-2026-045", status: "Waiting" },
                      { time: "11:15 AM", name: "Rahul Verma", mrn: "MRN-2026-089", status: "Waiting" },
                      { time: "11:30 AM", name: "Priya Singh", mrn: "MRN-2026-112", status: "Scheduled" },
                      { time: "12:00 PM", name: "Vikram Das", mrn: "MRN-2026-156", status: "Scheduled" },
                    ].map((pt, i) => (
                      <TableRow key={i} className={cn(pt.status === "In Progress" && "bg-teal-50/50 dark:bg-teal-950/20")}>
                        <TableCell className="font-medium whitespace-nowrap">{pt.time}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{pt.name}</div>
                            <div className="text-xs text-muted-foreground">{pt.mrn}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={pt.status === "In Progress" ? "default" : pt.status === "Waiting" ? "secondary" : "outline"}
                                 className={cn(pt.status === "In Progress" && "bg-teal-600")}>
                            {pt.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant={pt.status === "In Progress" ? "default" : "outline"}
                                  className={cn(pt.status === "In Progress" && "bg-teal-600 hover:bg-teal-700")}>
                            {pt.status === "In Progress" ? "Resume" : "Start"} <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Next 5 Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "Tomorrow 10:00", name: "Amit Patel", type: "Follow up" },
                    { time: "Tomorrow 10:30", name: "Neha Gupta", type: "New Consult" },
                    { time: "Tomorrow 11:00", name: "Ravi Kumar", type: "Follow up" },
                  ].map((apt, i) => (
                    <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className="bg-teal-100 dark:bg-teal-900/40 p-2 rounded-full">
                        <CalendarIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{apt.name}</p>
                        <p className="text-xs text-muted-foreground">{apt.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{apt.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Suresh Raina", condition: "ACL Tear", date: "2 days ago" },
                    { name: "MS Dhoni", condition: "Knee Osteoarthritis", date: "4 days ago" },
                  ].map((pt, i) => (
                    <div key={i} className="flex flex-col gap-1 pb-2 border-b last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{pt.name}</span>
                        <span className="text-xs text-muted-foreground">{pt.date}</span>
                      </div>
                      <span className="text-xs text-teal-700 dark:text-teal-400">{pt.condition}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
