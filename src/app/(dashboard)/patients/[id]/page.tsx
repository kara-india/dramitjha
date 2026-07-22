"use client";

import { use } from "react";
import Link from "next/link";
import { usePatient } from "../queries";
import { 
  UserRound, Calendar, Phone, Droplets, MapPin, 
  AlertTriangle, FileText, Activity, CreditCard,
  Printer, Edit, Plus
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: patient, isLoading } = usePatient(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2" />
          <Skeleton className="h-64 col-span-1" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Patient Not Found</h2>
          <Link href="/patients">
            <Button variant="link" className="mt-4">Back to Patients List</Button>
          </Link>
        </div>
      </div>
    );
  }

  const p = ((patient as any)?.data || patient) as any;
  const dob = p?.dateOfBirth || p?.dob;
  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 0;

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Header Profile Card */}
      <Card className="border-t-4 border-t-teal-600 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-6">
              <div className="h-24 w-24 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                <UserRound className="h-12 w-12" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {p.firstName} {p.lastName}
                  </h1>
                  <Badge variant={p.status === "Active" ? "default" : "secondary"} className="bg-teal-100 text-teal-800">
                    {p.status || "Active"}
                  </Badge>
                </div>
                <div className="text-lg font-mono text-gray-500 font-medium">{p.mrn}</div>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {age} Years • {p.gender}</div>
                  <div className="flex items-center gap-1"><Droplets className="h-4 w-4 text-red-500" /> {p.bloodGroup}</div>
                  <div className="flex items-center gap-1"><Phone className="h-4 w-4" /> {p.phone}</div>
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {p.city}, {p.state}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="bg-teal-600 hover:bg-teal-700 w-full">
                <Calendar className="h-4 w-4 mr-2" /> Book Appointment
              </Button>
              <div className="flex gap-2">
                <Link href={`/dashboard/patients/${p.id || resolvedParams.id}/edit`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" /> Print
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border-b w-full justify-start rounded-none h-12 p-0 space-x-6">
          <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:shadow-none rounded-none">Overview</TabsTrigger>
          <TabsTrigger value="appointments" className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:shadow-none rounded-none">Appointments</TabsTrigger>
          <TabsTrigger value="consultations" className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:shadow-none rounded-none">Consultations</TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:shadow-none rounded-none">Billing</TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:shadow-none rounded-none">Files & Reports</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" /> Allergies & Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {p.allergies?.length ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.allergies.map((a: any, i: number) => (
                          <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {a.allergen || a.name} ({a.severity})
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">No known allergies.</p>
                    )}

                    <h4 className="text-sm font-semibold mb-2">Existing Conditions</h4>
                    {p.existingConditions?.length ? (
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {p.existingConditions.map((c: string, i: number) => <li key={i}>{c}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No existing conditions reported.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{p.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Alternate Phone</p>
                      <p className="font-medium">{p.altPhone || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Full Address</p>
                      <p className="font-medium">{p.addressLine1 || p.address}, {p.city}, {p.state} - {p.pincode}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-1 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-teal-800">Emergency Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {p.emergencyContacts?.map((ec: any, idx: number) => (
                      <div key={idx} className="mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-0 text-sm">
                        <p className="font-semibold">{ec.name}</p>
                        <p className="text-gray-500">{ec.relationship}</p>
                        <p className="flex items-center gap-1 mt-1"><Phone className="h-3 w-3"/> {ec.phone}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-teal-800">Insurance Info</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    {p.insuranceName || p.insuranceProvider ? (
                      <>
                        <p className="text-gray-500">Provider</p>
                        <p className="font-semibold mb-2">{p.insuranceName || p.insuranceProvider}</p>
                        <p className="text-gray-500">Policy ID</p>
                        <p className="font-mono">{p.policyNumber || p.insuranceId}</p>
                      </>
                    ) : (
                      <p className="text-gray-500">No insurance details provided.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments scheduled yet.</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations">
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No previous consultations found.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No billing records found.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No files or reports uploaded.</p>
                <Button variant="outline" className="mt-4">Upload File</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
