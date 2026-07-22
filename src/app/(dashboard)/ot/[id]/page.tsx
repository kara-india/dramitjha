'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Activity, CheckCircle, Clock, Save } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { updateOTStatus, updateIntraOpNotes, getOTSchedules } from '../actions';
import { cn } from '@/lib/utils';
import { prisma } from '@/lib/prisma'; // In a real app we'd fetch via action, mocking fetch here

export default function OTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [intraOpNotes, setIntraOpNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Mock fetch for client-side demo, in reality we'd have a getOTSchedule(id) server action
    async function load() {
      // Simulate fetch
      const schedules = await getOTSchedules({});
      const found = schedules.find((s: any) => s.id === id);
      if (found) {
        setSchedule(found);
        setIntraOpNotes(found.intraOpNotes || '');
      } else {
        // Dummy data for demo if not found in db
        setSchedule({
          id,
          patient: { name: 'Rahul Sharma', mrn: 'MR-1002' },
          surgeon: { name: 'Dr. Amit Jha' },
          anesthesiologist: { name: 'Dr. Anil Gupta' },
          surgeryType: 'ACL Reconstruction',
          date: new Date(),
          startTime: new Date(),
          durationMins: 90,
          otRoom: 'OT-1',
          status: 'SCHEDULED',
          anesthesiaType: 'Spinal',
          preOpChecklist: {
            pacDone: true,
            consentSigned: true,
            bloodArranged: false,
            npoFromTime: '22:00'
          }
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading || !schedule) return <div className="p-8">Loading...</div>;

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const result = await updateOTStatus(id, newStatus);
    if (result.success) {
      setSchedule({ ...schedule, status: newStatus });
      toast({ title: 'Status updated' });
    } else {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
    setIsUpdating(false);
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    const result = await updateIntraOpNotes(id, intraOpNotes, schedule.implantDetails);
    if (result.success) {
      toast({ title: 'Notes saved successfully' });
    } else {
      toast({ title: 'Error saving notes', variant: 'destructive' });
    }
    setIsUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-800 animate-pulse';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const workflowSteps = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];
  const currentStepIndex = workflowSteps.indexOf(schedule.status);

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/ot">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{schedule.surgeryType}</h1>
            <p className="text-muted-foreground">
              {schedule.patient.name} ({schedule.patient.mrn}) • {format(new Date(schedule.date), 'PPP')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={cn("px-3 py-1 text-sm font-medium", getStatusColor(schedule.status))}>
            {schedule.status.replace('_', ' ')}
          </Badge>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Summary
          </Button>
        </div>
      </div>

      {/* Progress Workflow Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -z-10 -translate-y-1/2"></div>
            {workflowSteps.map((step, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center space-y-2 bg-background px-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2",
                    isPast ? "bg-emerald-500 border-emerald-500 text-white" :
                    isCurrent ? "bg-background border-teal-600 text-teal-600" : "bg-muted border-muted-foreground text-muted-foreground"
                  )}>
                    {isPast ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-teal-600" : "text-muted-foreground"
                  )}>
                    {step.replace('_', ' ')}
                  </span>
                  
                  {isCurrent && index < workflowSteps.length - 1 && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleStatusChange(workflowSteps[index + 1])}
                      disabled={isUpdating}
                    >
                      Mark {workflowSteps[index + 1].replace('_', ' ')}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Info */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Surgery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Surgeon</p>
                <p className="font-medium">{schedule.surgeon.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anesthesiologist</p>
                <p className="font-medium">{schedule.anesthesiologist?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anesthesia Type</p>
                <p className="font-medium">{schedule.anesthesiaType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Schedule</p>
                <p className="font-medium flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {format(new Date(schedule.startTime), 'HH:mm')} ({schedule.durationMins} mins)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">OT Room</p>
                <p className="font-medium">{schedule.otRoom}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pre-Op Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">PAC Cleared</span>
                {schedule.preOpChecklist?.pacDone ? 
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> : 
                  <span className="text-xs text-red-500">Pending</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Consent Signed</span>
                {schedule.preOpChecklist?.consentSigned ? 
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> : 
                  <span className="text-xs text-red-500">Pending</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Blood Arranged</span>
                {schedule.preOpChecklist?.bloodArranged ? 
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> : 
                  <span className="text-xs text-muted-foreground">N/A</span>}
              </div>
              {schedule.preOpChecklist?.npoFromTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">NPO From</span>
                  <span className="text-sm font-medium">{schedule.preOpChecklist.npoFromTime}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notes & Intra-Op */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Intra-Operative Notes</CardTitle>
                <CardDescription>Record surgery details, findings, and events</CardDescription>
              </div>
              {schedule.status === 'IN_PROGRESS' && (
                <Activity className="h-5 w-5 text-amber-500 animate-pulse" />
              )}
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter intra-op notes here..."
                className="min-h-[200px]"
                value={intraOpNotes}
                onChange={(e) => setIntraOpNotes(e.target.value)}
                disabled={schedule.status === 'COMPLETED' || schedule.status === 'CANCELLED'}
              />
              {(schedule.status === 'IN_PROGRESS' || schedule.status === 'SCHEDULED' || schedule.status === 'CONFIRMED') && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSaveNotes} disabled={isUpdating}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Implant Details (Consignment)</CardTitle>
              <CardDescription>Track implants used during the procedure</CardDescription>
            </CardHeader>
            <CardContent>
              {schedule.status === 'COMPLETED' ? (
                <div className="text-sm text-muted-foreground">
                  No implants recorded for this procedure.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Implant Type</label>
                    <Input placeholder="E.g. Titanium Screw" disabled={schedule.status === 'COMPLETED'} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lot / Serial No.</label>
                    <Input placeholder="Enter lot number" disabled={schedule.status === 'COMPLETED'} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input type="number" placeholder="1" disabled={schedule.status === 'COMPLETED'} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
