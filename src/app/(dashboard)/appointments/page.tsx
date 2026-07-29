'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  List,
  Plus,
  Search,
  User,
  Clock,
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  RefreshCw,
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppointmentQueue } from './components/appointment-queue';

type ViewMode = 'calendar' | 'list';

type AppointmentStatus =
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  type: string;
  status: AppointmentStatus;
  date: string;
  time: string;
  duration: number;
  source?: string;
}

const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch('/api/appointments', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load appointments');
  const data = await res.json();
  const serverList: Appointment[] = data.appointments || [];

  // Merge any public bookings mirrored in localStorage (same browser)
  try {
    const local = JSON.parse(localStorage.getItem('kh_public_bookings') || '[]') as Partial<Appointment>[];
    for (const row of local) {
      if (!row || !row.patientName) continue;
      const id = row.id || `LOC-${row.patientName}`;
      if (serverList.some((s) => s.id === id || (s.patientName === row.patientName && s.patientPhone === row.patientPhone))) {
        continue;
      }
      serverList.unshift({
        id,
        patientId: row.patientId || 'PAT-LOCAL',
        patientName: String(row.patientName),
        patientMrn: row.patientMrn || 'PENDING',
        patientPhone: row.patientPhone,
        doctorId: row.doctorId || 'DOC-001',
        doctorName: row.doctorName || 'Dr. Amit Jha',
        type: row.type || 'CONSULTATION',
        status: (row.status as AppointmentStatus) || 'SCHEDULED',
        date: row.date || new Date().toISOString().split('T')[0],
        time: row.time || '11:00',
        duration: row.duration || 30,
        source: 'public',
      });
    }
  } catch {
    // ignore
  }

  return serverList;
};

const statusColors: Record<AppointmentStatus, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  CHECKED_IN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  IN_CONSULTATION: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate] = useState<Date>(new Date());

  const { data: appointments = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    refetchInterval: 15000,
  });

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientMrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.patientPhone || '').includes(searchTerm)
  );

  const stats = {
    scheduled: appointments.filter((a) => a.status === 'SCHEDULED').length,
    checkedIn: appointments.filter((a) => a.status === 'CHECKED_IN').length,
    inProgress: appointments.filter((a) => a.status === 'IN_CONSULTATION').length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
    cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
  };

  const calendarEvents = appointments.map((apt) => ({
    id: apt.id,
    title: `${apt.patientName} - ${apt.type}`,
    date: `${apt.date}T${apt.time}:00`,
    extendedProps: { ...apt },
    backgroundColor:
      apt.status === 'COMPLETED'
        ? '#10b981'
        : apt.status === 'IN_CONSULTATION'
          ? '#0d9488'
          : apt.status === 'CHECKED_IN'
            ? '#eab308'
            : apt.status === 'CANCELLED'
              ? '#ef4444'
              : '#3b82f6',
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 flex-wrap gap-2">
        <h2 className="text-3xl font-bold tracking-tight font-outfit">Appointments</h2>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
            <Link href="/appointments/new">
              <Plus className="mr-2 h-4 w-4" /> Book Appointment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.checkedIn}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patient/MRN/phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 bg-muted p-1 rounded-md">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="w-20"
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="w-24"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading appointments…</div>
      ) : viewMode === 'calendar' ? (
        <Card>
          <CardContent className="p-6">
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridDay"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={calendarEvents}
                height="100%"
                slotMinTime="08:00:00"
                slotMaxTime="21:00:00"
                eventClick={(info) => {
                  window.location.href = `/appointments/${info.event.id}`;
                }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium text-muted-foreground border-b bg-muted/50 text-sm">
                    <div>Time</div>
                    <div className="col-span-2">Patient</div>
                    <div>Doctor</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    <AnimatePresence>
                      {filteredAppointments.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          No appointments found. Book from the public site or use Book Appointment.
                        </div>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <motion.div
                            key={apt.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/50 transition-colors"
                          >
                            <div className="font-medium text-sm">{apt.time}</div>
                            <div className="col-span-2 min-w-0">
                              <Link
                                href={`/appointments/${apt.id}`}
                                className="font-medium hover:underline text-teal-700 dark:text-teal-400"
                              >
                                {apt.patientName}
                              </Link>
                              <div className="text-xs text-muted-foreground">
                                {apt.patientMrn}
                                {apt.source === 'public' ? ' · Web booking' : ''}
                              </div>
                            </div>
                            <div className="text-sm">{apt.doctorName}</div>
                            <div>
                              <Badge variant="secondary" className={statusColors[apt.status]}>
                                {apt.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="text-right flex justify-end gap-2">
                              {apt.status === 'SCHEDULED' && (
                                <Button size="sm" variant="outline" className="h-8">
                                  Check In
                                </Button>
                              )}
                              {apt.status === 'IN_CONSULTATION' && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-8 bg-teal-600 hover:bg-teal-700"
                                >
                                  View EMR
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/appointments/${apt.id}`}>View Details</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" /> EMR
                                  </DropdownMenuItem>
                                  {apt.status === 'SCHEDULED' && (
                                    <DropdownMenuItem className="text-red-600">
                                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <AppointmentQueue date={format(selectedDate, 'yyyy-MM-dd')} doctorId="all" />
          </div>
        </div>
      )}
    </div>
  );
}
