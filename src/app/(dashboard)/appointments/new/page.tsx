'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Search, User, UserPlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeSlotPicker } from '../components/time-slot-picker';

const formSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  department: z.string().min(1, 'Department is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  type: z.enum(['CONSULTATION', 'FOLLOW_UP', 'PROCEDURE', 'PHYSIOTHERAPY', 'WALK_IN']),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(15),
  complaint: z.string().optional(),
  priority: z.enum(['ROUTINE', 'URGENT', 'EMERGENCY']),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: 'Patient' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Schedule' },
  { id: 4, title: 'Confirm' },
];

const DEMO_PATIENTS = [
  { id: 'PAT-001', name: 'Rajesh Kumar Verma', mrn: 'KH-2026-0084', phone: '9876543210' },
  { id: 'PAT-002', name: 'Pooja Srivastava', mrn: 'KH-2026-0091', phone: '9123456780' },
  { id: 'PAT-003', name: 'Vikramaditya Singh', mrn: 'KH-2026-0098', phone: '9988776655' },
  { id: 'PAT-004', name: 'Sunita Devi', mrn: 'KH-2026-0102', phone: '9012345678' },
];

export default function NewAppointmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<typeof DEMO_PATIENTS>([]);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
    mrn: string;
    phone: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string } | null>(null);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'MALE',
  });
  const [newPatientError, setNewPatientError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: '',
      department: 'orthopedics',
      doctorId: 'doc-1',
      type: 'CONSULTATION',
      date: new Date().toISOString().split('T')[0],
      time: '',
      duration: 30,
      complaint: '',
      priority: 'ROUTINE',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessData({
        id: `APT-${Math.floor(Math.random() * 10000)}`,
      });
    }, 800);
  };

  const nextStep = () => {
    const fields = getFieldsForStep(currentStep);
    form.trigger(fields as (keyof FormValues)[]).then((isValid) => {
      if (isValid) setCurrentStep((prev) => Math.min(prev + 1, 4));
    });
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const getFieldsForStep = (step: number): (keyof FormValues)[] => {
    switch (step) {
      case 1:
        return ['patientId'];
      case 2:
        return ['department', 'doctorId', 'type'];
      case 3:
        return ['date', 'time', 'duration'];
      case 4:
        return ['complaint', 'priority'];
      default:
        return [];
    }
  };

  const handleSearch = () => {
    const q = patientSearch.trim().toLowerCase();
    if (!q) {
      setSearchResults(DEMO_PATIENTS);
      return;
    }
    const hits = DEMO_PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
    setSearchResults(hits.length ? hits : DEMO_PATIENTS);
  };

  const selectPatient = (p: (typeof DEMO_PATIENTS)[0]) => {
    setSelectedPatient(p);
    form.setValue('patientId', p.id, { shouldValidate: true });
    setSearchResults([]);
    setShowNewPatient(false);
  };

  const registerNewPatient = () => {
    setNewPatientError(null);
    if (!newPatient.firstName.trim() || !newPatient.lastName.trim()) {
      setNewPatientError('First and last name are required.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(newPatient.phone.trim())) {
      setNewPatientError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    const id = `PAT-${Date.now().toString().slice(-6)}`;
    const mrn = `KH-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const created = {
      id,
      name: `${newPatient.firstName.trim()} ${newPatient.lastName.trim()}`,
      mrn,
      phone: newPatient.phone.trim(),
    };
    selectPatient(created);
    setNewPatient({ firstName: '', lastName: '', phone: '', gender: 'MALE' });
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 pt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold font-outfit text-teal-900 dark:text-teal-400">
            Appointment Confirmed!
          </h2>
          <p className="text-muted-foreground text-lg">
            Appointment <span className="font-bold text-foreground">{successData.id}</span> has been
            successfully scheduled for {selectedPatient?.name}.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button onClick={() => router.push('/appointments')} variant="outline">
              Go to Queue
            </Button>
            <Button
              onClick={() => router.push(`/billing/new?appointmentId=${successData.id}`)}
              variant="outline"
            >
              Generate Invoice
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-teal-600 hover:bg-teal-700">
              Book Another
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-outfit">Book Appointment</h2>
        <p className="text-muted-foreground">Schedule a new visit for a patient.</p>
      </div>

      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-muted z-0 rounded-full" />
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-teal-600 z-0 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />
        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 ${
                currentStep >= step.id
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-background border-muted text-muted-foreground'
              }`}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label>Find Patient</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by MRN, Name, or Phone..."
                          className="pl-9"
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSearch();
                            }
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" onClick={handleSearch} variant="secondary">
                          Search
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            setShowNewPatient(true);
                            setSearchResults([]);
                          }}
                        >
                          <UserPlus className="w-4 h-4" /> New
                        </Button>
                      </div>
                    </div>

                    {searchResults.length > 0 && !selectedPatient && (
                      <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                        {searchResults.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-teal-50 flex items-center justify-between gap-2"
                            onClick={() => selectPatient(p)}
                          >
                            <div>
                              <p className="font-semibold text-sm">{p.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {p.mrn} · {p.phone}
                              </p>
                            </div>
                            <span className="text-xs text-teal-700 font-medium">Select</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {showNewPatient && !selectedPatient && (
                    <Card className="border-teal-200 bg-teal-50/30">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Register New Patient</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setShowNewPatient(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>First name</Label>
                            <Input
                              value={newPatient.firstName}
                              onChange={(e) =>
                                setNewPatient((s) => ({ ...s, firstName: e.target.value }))
                              }
                              placeholder="First name"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Last name</Label>
                            <Input
                              value={newPatient.lastName}
                              onChange={(e) =>
                                setNewPatient((s) => ({ ...s, lastName: e.target.value }))
                              }
                              placeholder="Last name"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Mobile</Label>
                            <Input
                              value={newPatient.phone}
                              onChange={(e) =>
                                setNewPatient((s) => ({ ...s, phone: e.target.value }))
                              }
                              placeholder="10-digit mobile"
                              inputMode="numeric"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Gender</Label>
                            <Select
                              value={newPatient.gender}
                              onValueChange={(val) =>
                                setNewPatient((s) => ({ ...s, gender: val }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {newPatientError && (
                          <p className="text-sm text-red-500">{newPatientError}</p>
                        )}
                        <Button
                          type="button"
                          className="bg-teal-600 hover:bg-teal-700"
                          onClick={registerNewPatient}
                        >
                          Save &amp; Select Patient
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {selectedPatient && (
                    <Card className="bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-200 shrink-0">
                            <User className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-lg truncate">{selectedPatient.name}</h4>
                            <div className="text-sm text-muted-foreground flex flex-wrap gap-3">
                              <span>MRN: {selectedPatient.mrn}</span>
                              <span>Phone: {selectedPatient.phone}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPatient(null);
                            form.setValue('patientId', '');
                          }}
                        >
                          Change
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  {form.formState.errors.patientId && (
                    <p className="text-sm text-red-500">{form.formState.errors.patientId.message}</p>
                  )}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select
                        onValueChange={(val) => form.setValue('department', val)}
                        defaultValue={form.getValues('department')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                          <SelectItem value="sports_medicine">Sports Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Doctor</Label>
                      <Select
                        onValueChange={(val) => form.setValue('doctorId', val)}
                        defaultValue={form.getValues('doctorId')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doc-1">Dr. Amit Jha</SelectItem>
                          <SelectItem value="doc-2">Dr. Priya Singh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Appointment Type</Label>
                      <Select
                        onValueChange={(val: FormValues['type']) => form.setValue('type', val)}
                        defaultValue={form.getValues('type')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CONSULTATION">Consultation</SelectItem>
                          <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                          <SelectItem value="PROCEDURE">Procedure</SelectItem>
                          <SelectItem value="PHYSIOTHERAPY">Physiotherapy</SelectItem>
                          <SelectItem value="WALK_IN">Walk In</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <TimeSlotPicker
                    selectedDate={form.watch('date')}
                    selectedTime={form.watch('time')}
                    onDateChange={(d) => form.setValue('date', d)}
                    onTimeChange={(t) => form.setValue('time', t)}
                    appointmentType={form.watch('type')}
                    duration={form.watch('duration')}
                    onDurationChange={(d) => form.setValue('duration', d)}
                  />
                  {form.formState.errors.time && (
                    <p className="text-sm text-red-500">{form.formState.errors.time.message}</p>
                  )}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 md:col-span-2">
                      <Label>Chief Complaint / Notes</Label>
                      <Textarea
                        placeholder="Brief description of the issue..."
                        className="min-h-[100px]"
                        {...form.register('complaint')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        onValueChange={(val: FormValues['priority']) => form.setValue('priority', val)}
                        defaultValue={form.getValues('priority')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ROUTINE">Routine</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                          <SelectItem value="EMERGENCY">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="bg-muted/50 mt-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Patient:</div>
                      <div className="font-medium">{selectedPatient?.name}</div>
                      <div className="text-muted-foreground">Type:</div>
                      <div className="font-medium">{form.watch('type')}</div>
                      <div className="text-muted-foreground">Date &amp; Time:</div>
                      <div className="font-medium">
                        {form.watch('date')} at {form.watch('time')} ({form.watch('duration')} mins)
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              Back
            </Button>
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep} className="bg-teal-600 hover:bg-teal-700">
                Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
