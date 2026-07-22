'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createOTSchedule } from '../actions';
import { ArrowLeft, Save, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  surgeonId: z.string().min(1, 'Surgeon is required'),
  anesthesiologistId: z.string().optional(),
  surgeryType: z.string().min(1, 'Surgery type is required'),
  date: z.date({
    message: 'A date of surgery is required.',
  }),
  startTime: z.string().min(1, 'Start time is required'),
  durationMins: z.number().min(30).max(480),
  otRoom: z.string().min(1, 'OT room is required'),
  anesthesiaType: z.enum(['General', 'Spinal', 'Regional', 'Local']),
  preOpChecklist: z.object({
    pacDone: z.boolean().default(false),
    consentSigned: z.boolean().default(false),
    bloodArranged: z.boolean().default(false),
    npoFromTime: z.string().optional(),
  }),
  notes: z.string().optional(),
});

const SURGERY_SUGGESTIONS = [
  'ACL Reconstruction',
  'Arthroscopy',
  'Meniscus Repair',
  'ORIF',
  'THR',
  'TKR'
];

export default function NewOTSchedulePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: '',
      surgeonId: '',
      anesthesiologistId: '',
      surgeryType: '',
      durationMins: 60,
      otRoom: '',
      anesthesiaType: 'Spinal',
      preOpChecklist: {
        pacDone: false,
        consentSigned: false,
        bloodArranged: false,
        npoFromTime: '',
      },
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createOTSchedule(values);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Surgery scheduled successfully.',
        });
        router.push(`/dashboard/ot/${result.data.id}`);
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/ot">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule New Surgery</h1>
          <p className="text-muted-foreground">Book an OT room and configure pre-op details</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="p1">Rahul Sharma (MR-1002)</SelectItem>
                            <SelectItem value="p2">Priya Singh (MR-1005)</SelectItem>
                            <SelectItem value="p3">Amit Kumar (MR-1008)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="surgeonId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surgeon</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select surgeon..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dr_amit">Dr. Amit Jha</SelectItem>
                              <SelectItem value="dr_raj">Dr. Raj Patel</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="anesthesiologistId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anesthesiologist (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dr_anil">Dr. Anil Gupta</SelectItem>
                              <SelectItem value="dr_sneha">Dr. Sneha Roy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="surgeryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surgery Type</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input placeholder="E.g. Arthroscopy" {...field} />
                            <div className="flex flex-wrap gap-2">
                              {SURGERY_SUGGESTIONS.map(sug => (
                                <Badge 
                                  key={sug} 
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-teal-100 hover:text-teal-800"
                                  onClick={() => form.setValue('surgeryType', sug)}
                                >
                                  {sug}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Room</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0,0,0,0))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="durationMins"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Duration: {field.value} minutes</FormLabel>
                        <FormControl>
                          <Slider
                            min={30}
                            max={480}
                            step={15}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otRoom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OT Room</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select OT room" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="OT-1">OT-1 (Main)</SelectItem>
                            <SelectItem value="OT-2">OT-2 (Minor)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-Operative details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="anesthesiaType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anesthesia Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select anesthesia type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Spinal">Spinal</SelectItem>
                            <SelectItem value="Regional">Regional</SelectItem>
                            <SelectItem value="Local">Local</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium">Pre-Op Checklist</h4>
                    
                    <FormField
                      control={form.control}
                      name="preOpChecklist.pacDone"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>PAC Done & Cleared</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preOpChecklist.consentSigned"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Consent Signed</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preOpChecklist.bloodArranged"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Blood Arranged</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preOpChecklist.npoFromTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NPO From (Optional)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Special requirements, equipment needed, etc."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
              {isSubmitting ? 'Scheduling...' : 'Schedule Surgery'}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const Badge = ({ children, variant, className, onClick }: any) => {
  return (
    <span 
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === 'secondary' && "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {children}
    </span>
  );
};
