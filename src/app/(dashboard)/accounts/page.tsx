"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { IndianRupee, CreditCard, Landmark, FileText, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const collectionData = [
  { mode: "Cash", amount: 15000 },
  { mode: "UPI", amount: 35000 },
  { mode: "Card", amount: 22000 },
  { mode: "Insurance", amount: 45000 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function AccountsDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-teal-900 dark:text-teal-100">
          Accounts Dashboard
        </h2>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
                <IndianRupee className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">₹72,000</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                  <span className="text-emerald-500 font-medium">+8%</span> vs yesterday
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
                <FileText className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-600">₹45,500</div>
                <p className="text-xs text-muted-foreground mt-1">18 pending invoices</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TPA Pending Claims</CardTitle>
                <Landmark className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">₹1,25,000</div>
                <p className="text-xs text-muted-foreground mt-1">5 claims in process</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Cash Register</CardTitle>
                <CreditCard className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹15,000</div>
                <p className="text-xs text-muted-foreground mt-1">Current cash in hand</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Collection by Payment Mode</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collectionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mode" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip cursor={{ fill: 'rgba(13, 148, 136, 0.1)' }} formatter={(value) => [`₹${value}`, "Amount"]} />
                    <Bar dataKey="amount" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Payment Log</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: "INV-2026-101", name: "Rahul Verma", amt: 1200, mode: "UPI" },
                      { id: "INV-2026-102", name: "Kavita Rao", amt: 500, mode: "Cash" },
                      { id: "INV-2026-103", name: "Amit Patel", amt: 4500, mode: "Card" },
                      { id: "INV-2026-104", name: "Sunita Sharma", amt: 15000, mode: "Insurance" },
                    ].map((tx, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-xs">{tx.id}</TableCell>
                        <TableCell>{tx.name}</TableCell>
                        <TableCell className="font-bold text-teal-700">₹{tx.amt}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tx.mode}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
