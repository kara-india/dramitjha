"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { IndianRupee, Users, Calendar, AlertTriangle, ArrowUpRight, ArrowDownRight, Plus, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const revenueData = [
  { date: "1 Jul", value: 12000 },
  { date: "5 Jul", value: 15000 },
  { date: "10 Jul", value: 14000 },
  { date: "15 Jul", value: 18000 },
  { date: "20 Jul", value: 22000 },
  { date: "25 Jul", value: 19000 },
  { date: "30 Jul", value: 24000 },
];

const deptData = [
  { name: "Orthopedic", value: 65 },
  { name: "Physiotherapy", value: 25 },
  { name: "Pediatrics", value: 10 },
];
const COLORS = ["#0d9488", "#2563eb", "#0ea5e9"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function CountUp({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>;
}

export function AdminDashboardClient() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Quick Actions */}
      <motion.div variants={item} className="flex gap-4">
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="mr-2 h-4 w-4" /> Register Patient
        </Button>
        <Button variant="outline" className="text-teal-700 border-teal-200 hover:bg-teal-50">
          <Calendar className="mr-2 h-4 w-4" /> Book Appointment
        </Button>
        <Button variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50">
          <FileText className="mr-2 h-4 w-4" /> Generate Invoice
        </Button>
      </motion.div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue Today</CardTitle>
              <IndianRupee className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-950 dark:text-teal-50">
                <CountUp end={45230} prefix="₹" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">+12%</span> vs yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients Today</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp end={84} />
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">+5%</span> vs yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <Calendar className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp end={92} />
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                <span className="text-rose-500 font-medium">-2%</span> vs yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                <CountUp end={12400} prefix="₹" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across 15 patients</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={item} className="col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Department Revenue</CardTitle>
              <CardDescription>Breakdown by specialty</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-bold text-teal-900 dark:text-teal-100">100%</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Rajesh Kumar", time: "10:00 AM", doc: "Dr. Amit Jha", status: "Waiting" },
                    { name: "Priya Singh", time: "10:30 AM", doc: "Dr. S. Sharma", status: "In Progress" },
                    { name: "Amit Patel", time: "11:00 AM", doc: "Dr. Amit Jha", status: "Scheduled" },
                    { name: "Neha Gupta", time: "11:15 AM", doc: "Dr. K. Verma", status: "Scheduled" },
                  ].map((apt, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{apt.name}</TableCell>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>{apt.doc}</TableCell>
                      <TableCell>
                        <Badge variant={apt.status === "Waiting" ? "secondary" : apt.status === "In Progress" ? "default" : "outline"}
                          className={cn(apt.status === 'In Progress' && 'bg-teal-600 hover:bg-teal-700')}>
                          {apt.status}
                        </Badge>
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
              <CardTitle className="text-rose-600 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" /> Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { item: "Paracetamol 500mg", stock: 15, threshold: 50 },
                  { item: "Crepe Bandage 4 inch", stock: 8, threshold: 20 },
                  { item: "Diclofenac Gel", stock: 5, threshold: 15 },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-950/20 rounded-lg border border-rose-100 dark:border-rose-900/50">
                    <div>
                      <p className="font-medium text-rose-900 dark:text-rose-200">{inv.item}</p>
                      <p className="text-sm text-rose-600 dark:text-rose-400">Stock: {inv.stock} / {inv.threshold}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-100">Order</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { patient: "Vikram Das", amount: 1200, type: "UPI", time: "10 mins ago" },
                  { patient: "Sunita Rao", amount: 500, type: "Cash", time: "25 mins ago" },
                  { patient: "Rahul Mehra", amount: 2500, type: "Card", time: "1 hour ago" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{tx.patient}</p>
                      <p className="text-sm text-muted-foreground">{tx.type} • {tx.time}</p>
                    </div>
                    <div className="font-bold text-teal-600">+₹{tx.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
