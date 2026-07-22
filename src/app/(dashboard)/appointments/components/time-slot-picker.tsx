'use client';

import React from 'react';
import { format, addMinutes } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Specific blocks for physio
const PHYSIO_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

const ALL_SLOTS = Array.from({ length: 26 }).map((_, i) => {
  const time = addMinutes(new Date().setHours(8, 0, 0, 0), i * 30);
  return format(time, 'HH:mm');
});

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  appointmentType?: string;
  duration: number;
  onDurationChange: (duration: number) => void;
}

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  appointmentType,
  duration,
  onDurationChange,
}: TimeSlotPickerProps) {
  const isPhysio = appointmentType === 'PHYSIOTHERAPY';
  const availableSlots = isPhysio ? PHYSIO_SLOTS : ALL_SLOTS;
  
  // Mock booked slots
  const bookedSlots = ['10:00', '11:30', '15:00'];

  const dateObj = selectedDate ? new Date(selectedDate) : new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="space-y-2 flex-1">
          <label className="text-sm font-medium">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(dateObj, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateObj}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2 flex-1">
          <label className="text-sm font-medium">Duration (Minutes)</label>
          <Select 
            value={duration.toString()} 
            onValueChange={(v) => onDurationChange(parseInt(v))}
          >
            <SelectTrigger>
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 mins (Follow up)</SelectItem>
              <SelectItem value="30">30 mins (Consultation)</SelectItem>
              <SelectItem value="45">45 mins (Extended)</SelectItem>
              <SelectItem value="60">60 mins (Procedure/Physio)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Available Time Slots</label>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-background border rounded-sm"></div> Available</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-600 rounded-sm"></div> Selected</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-muted rounded-sm"></div> Booked</span>
            {isPhysio && (
              <span className="flex items-center gap-1"><div className="w-3 h-3 border-teal-400 border-2 bg-teal-50 rounded-sm"></div> Physio Block</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {availableSlots.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = selectedTime === time;
            const isPhysioSlot = PHYSIO_SLOTS.includes(time);
            
            return (
              <Button
                key={time}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  "h-10 text-xs font-medium transition-all",
                  isSelected && "bg-teal-600 hover:bg-teal-700 text-white shadow-sm",
                  !isSelected && !isBooked && isPhysio && isPhysioSlot && "border-teal-400 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300",
                  isBooked && "opacity-50 cursor-not-allowed bg-muted"
                )}
                disabled={isBooked}
                onClick={() => onTimeChange(time)}
              >
                {time}
              </Button>
            );
          })}
        </div>
        {availableSlots.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            No available slots for this date.
          </div>
        )}
      </div>
    </div>
  );
}
