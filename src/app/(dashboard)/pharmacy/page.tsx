"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pill, AlertTriangle, Clock, CheckCircle } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function PharmacyDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-teal-900 dark:text-teal-100">
          Pharmacy Dashboard
        </h2>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Dispense</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">8</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">45</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-600">12</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Near Expiry</CardTitle>
                <Pill className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">5</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div variants={item} className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pending Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { pt: "Rajesh Kumar", doc: "Dr. Amit Jha", items: 3, time: "10 mins ago" },
                      { pt: "Sunita Sharma", doc: "Dr. S. Sharma", items: 1, time: "15 mins ago" },
                    ].map((rx, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{rx.pt}</TableCell>
                        <TableCell>{rx.doc}</TableCell>
                        <TableCell>{rx.items} meds</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{rx.time}</TableCell>
                        <TableCell>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Dispense</Button>
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
                <CardTitle className="text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Amoxicillin 500mg", stock: 12, threshold: 50, type: "Low Stock" },
                    { name: "Cough Syrup", stock: 5, threshold: 20, type: "Low Stock" },
                    { name: "Ibuprofen 400mg", stock: 150, expiry: "15 Aug 2026", type: "Expiring" },
                  ].map((inv, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50">
                      <div>
                        <div className="font-medium text-sm text-rose-900 dark:text-rose-200">{inv.name}</div>
                        <div className="text-xs text-rose-600 dark:text-rose-400">
                          {inv.type === "Low Stock" ? `Stock: ${inv.stock} / ${inv.threshold}` : `Exp: ${inv.expiry}`}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-rose-600 border-rose-200 bg-white dark:bg-black">
                        {inv.type}
                      </Badge>
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
