'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { Plus, Clock, CheckCircle, Activity, ActivitySquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOTSchedules, getTodayOTSchedule } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function OTSchedulePage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [todayList, setTodayList] = useState<any[]>([]);
  const [surgeonFilter, setSurgeonFilter] = useState('ALL');
  const [roomFilter, setRoomFilter] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      const allSchedules = await getOTSchedules({});
      const formattedEvents = allSchedules.map((s: any) => ({
        id: s.id,
        title: `${s.patient?.firstName || 'Patient'} ${s.patient?.lastName || ''} - ${s.surgeryType}`,
        start: s.startTime,
        end: new Date(new Date(s.startTime).getTime() + (s.estimatedDurationMins || 60) * 60000),
        backgroundColor: getStatusColor(s.status),
        borderColor: getStatusColor(s.status),
        extendedProps: {
          surgeon: `${s.surgeon?.firstName || ''} ${s.surgeon?.lastName || ''}`,
          room: s.otRoom,
          status: s.status,
          patientId: s.patientId,
          surgeryType: s.surgeryType
        }
      }));
      setEvents(formattedEvents);

      const today = await getTodayOTSchedule();
      setTodayList(today);
    }
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return '#3b82f6';
      case 'CONFIRMED': return '#8b5cf6';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'COMPLETED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredEvents = events.filter(e => {
    if (surgeonFilter !== 'ALL' && e.extendedProps.surgeon !== surgeonFilter) return false;
    if (roomFilter !== 'ALL' && e.extendedProps.room !== roomFilter) return false;
    return true;
  });

  const stats = {
    totalScheduled: todayList.length,
    inProgress: todayList.filter(s => s.status === 'IN_PROGRESS').length,
    completed: todayList.filter(s => s.status === 'COMPLETED').length,
    availableRooms: 2 - new Set(todayList.filter(s => s.status === 'IN_PROGRESS').map(s => s.otRoom)).size,
  };

  const handleEventClick = (info: any) => {
    router.push(`/dashboard/ot/${info.event.id}`);
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operation Theatre</h1>
          <p className="text-muted-foreground">Manage surgery schedules and OT room allocations</p>
        </div>
        <Link href="/dashboard/ot/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Surgery
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <ActivitySquare className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableRooms} / 2</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle>Schedule Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="OT Room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Rooms</SelectItem>
                  <SelectItem value="OT-1">OT-1</SelectItem>
                  <SelectItem value="OT-2">OT-2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-hidden" style={{ minHeight: '600px' }}>
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,timeGridDay,dayGridMonth'
              }}
              events={filteredEvents}
              eventClick={handleEventClick}
              height="auto"
              slotMinTime="07:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              nowIndicator={true}
            />
          </CardContent>
        </Card>

        <Card className="w-full lg:w-[350px]">
          <CardHeader>
            <CardTitle>Today's List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayList.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                No surgeries scheduled for today
              </div>
            ) : (
              todayList.map((schedule, i) => (
                <Link key={i} href={`/dashboard/ot/${schedule.id}`} className="block">
                  <div className="flex items-start justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{schedule.patient?.firstName ? `${schedule.patient.firstName} ${schedule.patient.lastName || ''}` : 'Patient'}</p>
                      <p className="text-xs text-muted-foreground">{schedule.surgeryType}</p>
                      <div className="flex items-center text-xs text-muted-foreground pt-1">
                        <Clock className="mr-1 h-3 w-3" />
                        {schedule.startTime} ({schedule.estimatedDurationMins || 60}m) • {schedule.otRoom}
                      </div>
                    </div>
                    <Badge variant="outline" style={{ borderColor: getStatusColor(schedule.status), color: getStatusColor(schedule.status) }}>
                      {schedule.status}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
