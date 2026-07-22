"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Users, CalendarDays, Timer, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function PhysioDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-teal-900 dark:text-teal-100">
          Physiotherapy Department
        </h2>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <Activity className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">Patients on treatment</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <Users className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions Today</CardTitle>
                <CalendarDays className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14</div>
                <p className="text-xs text-muted-foreground mt-1">8 morning, 6 evening</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Session In</CardTitle>
                <Timer className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">15m</div>
                <p className="text-xs text-muted-foreground mt-1">Rahul Verma (ACL Rehab)</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div variants={item} className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Morning Slot (11:00 - 13:30)</h4>
                    <div className="space-y-3">
                      {[
                        { time: "11:00 AM", name: "Priya Singh", type: "Post-Op ACL", status: "Completed" },
                        { time: "11:45 AM", name: "Rahul Verma", type: "Frozen Shoulder", status: "In Progress" },
                        { time: "12:30 PM", name: "Anil Kapoor", type: "Lower Back Pain", status: "Upcoming" },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="font-medium text-sm w-20">{session.time}</div>
                            <div>
                              <div className="font-semibold">{session.name}</div>
                              <div className="text-xs text-muted-foreground">{session.type}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={session.status === "Completed" ? "secondary" : session.status === "In Progress" ? "default" : "outline"}
                                   className={cn(session.status === "In Progress" && "bg-teal-600")}>
                              {session.status}
                            </Badge>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              {session.status === "Completed" ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Evening Slot (15:30 - 20:30)</h4>
                    <div className="space-y-3">
                      {[
                        { time: "15:30 PM", name: "Suresh Raina", type: "Sports Injury Rehab", status: "Upcoming" },
                        { time: "16:15 PM", name: "Meera Singh", type: "Cervical Spondylosis", status: "Upcoming" },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="font-medium text-sm w-20">{session.time}</div>
                            <div>
                              <div className="font-semibold">{session.name}</div>
                              <div className="text-xs text-muted-foreground">{session.type}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{session.status}</Badge>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Session Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Priya Singh", date: "Today", note: "Good progress with knee flexion. Reached 90 degrees. Assigned home exercises for quad strengthening." },
                    { name: "Vikram Das", date: "Yesterday", note: "Complained of pain during overhead motion. Reduced resistance band intensity." },
                    { name: "Sunita Sharma", date: "Yesterday", note: "Ultrasound therapy completed. Swelling reduced significantly." },
                  ].map((note, i) => (
                    <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{note.name}</span>
                        <span className="text-xs text-muted-foreground">{note.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{note.note}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-teal-700">View All Notes</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
