'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  PlayCircle,
  XCircle,
  Receipt
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const statuses = [
  { id: 'SCHEDULED', label: 'Scheduled' },
  { id: 'CHECKED_IN', label: 'Checked In' },
  { id: 'READY_FOR_DOCTOR', label: 'Ready' },
  { id: 'IN_CONSULTATION', label: 'In Consultation' },
  { id: 'COMPLETED', label: 'Completed' },
];

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Mock data
  const appointment = {
    id,
    patientId: 'PAT-001',
    patientName: 'Rahul Kumar',
    patientMrn: 'MRN-2023-001',
    patientPhone: '+91 9876543210',
    patientAge: 34,
    patientGender: 'Male',
    doctorId: 'DOC-001',
    doctorName: 'Dr. Amit Jha',
    department: 'Orthopedics',
    type: 'CONSULTATION',
    status: 'READY_FOR_DOCTOR',
    date: new Date().toISOString(),
    time: '10:00',
    duration: 30,
    complaint: 'Pain in right knee since 2 weeks. Aggravated by climbing stairs.',
    priority: 'ROUTINE',
    history: [
      { status: 'SCHEDULED', time: '2023-10-24T09:00:00', by: 'System' },
      { status: 'CHECKED_IN', time: '2023-10-25T09:45:00', by: 'Reception' },
      { status: 'READY_FOR_DOCTOR', time: '2023-10-25T09:50:00', by: 'Nurse' },
    ]
  };

  const currentStatusIndex = statuses.findIndex(s => s.id === appointment.status);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-outfit">Appointment {appointment.id}</h2>
          <p className="text-muted-foreground">{format(new Date(appointment.date), 'MMMM d, yyyy')} at {appointment.time}</p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {appointment.priority}
          </Badge>
        </div>
      </div>

      {/* Stepper */}
      <Card className="overflow-hidden">
        <div className="bg-muted/50 p-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-border z-0" />
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-teal-600 z-0 transition-all duration-500"
              style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
            />
            {statuses.map((s, idx) => {
              const isPast = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isPast ? 'bg-teal-600 border-teal-600 text-white' :
                    isCurrent ? 'bg-background border-teal-600 text-teal-600' :
                    'bg-background border-muted-foreground text-muted-foreground'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'text-teal-700 dark:text-teal-400' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-lg">{appointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MRN</p>
                    <p className="font-medium">{appointment.patientMrn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{appointment.patientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age / Gender</p>
                    <p className="font-medium">{appointment.patientAge} yrs / {appointment.patientGender}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clinical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-20">Doctor:</span>
                  <span className="font-medium">{appointment.doctorName} ({appointment.department})</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-20">Type:</span>
                  <span className="font-medium">{appointment.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-20">Date:</span>
                  <span className="font-medium">{format(new Date(appointment.date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-20">Time:</span>
                  <span className="font-medium">{appointment.time} ({appointment.duration} min)</span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Chief Complaint</p>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {appointment.complaint}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {appointment.status === 'SCHEDULED' && (
                <>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Check-In Patient
                  </Button>
                  <Button variant="destructive" className="w-full" variant="outline">
                    <XCircle className="w-4 h-4 mr-2" /> Cancel Appointment
                  </Button>
                </>
              )}
              {appointment.status === 'CHECKED_IN' && (
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Mark Ready for Doctor
                </Button>
              )}
              {appointment.status === 'READY_FOR_DOCTOR' && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => router.push(`/consultations/new?appointmentId=${appointment.id}`)}
                >
                  <PlayCircle className="w-4 h-4 mr-2" /> Start Consultation
                </Button>
              )}
              {(appointment.status === 'IN_CONSULTATION' || appointment.status === 'COMPLETED') && (
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" /> View EMR
                </Button>
              )}
              {appointment.status === 'COMPLETED' && (
                <Button variant="outline" className="w-full text-teal-600 border-teal-600 hover:bg-teal-50">
                  <Receipt className="w-4 h-4 mr-2" /> Generate Invoice
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointment.history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-teal-600" />
                      {i !== appointment.history.length - 1 && (
                        <div className="w-0.5 h-full bg-border ml-[3px] mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">{h.status}</p>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{format(new Date(h.time), 'MMM d, hh:mm a')}</span>
                        <span>by {h.by}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
