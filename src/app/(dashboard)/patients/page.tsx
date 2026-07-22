"use client";

import { useState } from "react";
import Link from "next/link";
import { usePatients } from "./queries";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  Search, Plus, Download, ChevronLeft, ChevronRight, UserRound 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientsListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = usePatients({ search, page, limit });

  const exportToCsv = () => {
    if (!data?.data) return;
    const headers = ["MRN", "First Name", "Last Name", "Gender", "DOB", "Phone", "Status"];
    const rows = data.data.map(p => [
      p.mrn, p.firstName, p.lastName, p.gender, p.dob, p.phone, p.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `patients_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-teal-700">Patients</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportToCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Link href="/patients/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" /> Register New Patient
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by MRN, Name, Phone..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MRN</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Age / Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <UserRound className="h-8 w-8 mb-2" />
                    <p>No patients found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((patient, index) => {
                const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
                return (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="font-medium text-teal-600">
                      <Link href={`/patients/${patient.id}`}>
                        {patient.mrn}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell>
                      {age} Y / {patient.gender.charAt(0)}
                    </TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        {patient.bloodGroup}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {patient.lastVisit ? format(new Date(patient.lastVisit), "dd MMM yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.status === "Active" ? "default" : "secondary"} className={patient.status === "Active" ? "bg-teal-100 text-teal-800 hover:bg-teal-100" : ""}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-gray-500">
          Page {data?.page || 1} of {data?.totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => p + 1)}
          disabled={!data || page >= data.totalPages || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
