"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Calendar as CalendarIcon, IndianRupee, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ReceptionDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
          Front Desk Dashboard
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search patient..." className="w-64 pl-8" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Walk-in Registration
          </Button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Patients Today</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <CalendarIcon className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <IndianRupee className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground mt-1">₹4,500 total</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wait Time (Avg)</CardTitle>
                <Clock className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 min</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div variants={item} className="col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Live Appointment Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { time: "10:00 AM", name: "Kavita Rao", doc: "Dr. Amit Jha", status: "Waiting" },
                      { time: "10:15 AM", name: "Rohan Das", doc: "Dr. Amit Jha", status: "Arrived" },
                      { time: "10:30 AM", name: "Meera Singh", doc: "Dr. S. Sharma", status: "Scheduled" },
                    ].map((apt, i) => (
                      <TableRow key={i}>
                        <TableCell>{apt.time}</TableCell>
                        <TableCell className="font-medium">{apt.name}</TableCell>
                        <TableCell>{apt.doc}</TableCell>
                        <TableCell>
                          <Badge variant={apt.status === "Waiting" ? "secondary" : "outline"}
                            className={cn(apt.status === "Arrived" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200")}>
                            {apt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Check-in</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Doctor Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { doc: "Dr. Amit Jha", time: "10:00 AM - 02:00 PM", dept: "Orthopedics" },
                    { doc: "Dr. S. Sharma", time: "11:00 AM - 04:00 PM", dept: "Pediatrics" },
                    { doc: "Dr. K. Verma", time: "09:00 AM - 01:00 PM", dept: "Physiotherapy" },
                  ].map((doc, i) => (
                    <div key={i} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                      <div className="font-medium">{doc.doc}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{doc.dept}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{doc.time}</span>
                      </div>
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
