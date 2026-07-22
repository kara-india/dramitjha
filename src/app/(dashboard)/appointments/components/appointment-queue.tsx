'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppointmentQueueProps {
  date: string;
  doctorId: string;
}

export function AppointmentQueue({ date, doctorId }: AppointmentQueueProps) {
  // Mock live queue data
  const { data: queue = [] } = useQuery({
    queryKey: ['appointmentQueue', date, doctorId],
    queryFn: async () => [
      { id: '1', patient: 'Rahul K.', status: 'IN_CONSULTATION', time: '10:00', waitTime: '15 min' },
      { id: '2', patient: 'Sneha S.', status: 'READY_FOR_DOCTOR', time: '10:30', waitTime: '5 min' },
      { id: '3', patient: 'Vikram P.', status: 'CHECKED_IN', time: '11:00', waitTime: '0 min' },
      { id: '4', patient: 'Neha G.', status: 'SCHEDULED', time: '11:30', waitTime: '-' },
    ],
    refetchInterval: 30000,
  });

  return (
    <Card className="h-full flex flex-col shadow-md border-teal-100 dark:border-teal-900/50">
      <CardHeader className="pb-3 bg-teal-50/50 dark:bg-teal-900/20 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-outfit flex items-center">
            Live Queue
            <span className="ml-2 relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
          </CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {queue.length} Wait
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-[500px] p-4">
          <div className="space-y-3">
            <AnimatePresence>
              {queue.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`p-3 rounded-lg border ${
                    item.status === 'IN_CONSULTATION' ? 'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800' :
                    item.status === 'READY_FOR_DOCTOR' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                    'bg-background border-border'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        <span className="text-muted-foreground text-xs font-mono">{index + 1}.</span>
                        {item.patient}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {item.time} (Wait: {item.waitTime})
                      </div>
                    </div>
                    {item.status === 'IN_CONSULTATION' && (
                      <Badge className="bg-teal-500 hover:bg-teal-600 text-[10px] uppercase">
                        Active
                      </Badge>
                    )}
                    {item.status === 'READY_FOR_DOCTOR' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-[10px] uppercase">
                        Ready
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {item.status === 'READY_FOR_DOCTOR' && (
                      <Button size="sm" className="w-full h-7 text-xs bg-blue-600 hover:bg-blue-700">
                        <PlayCircle className="w-3 h-3 mr-1" /> Call Next
                      </Button>
                    )}
                    {item.status === 'SCHEDULED' && (
                      <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Check In
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {queue.length === 0 && (
              <div className="text-center p-8 text-muted-foreground text-sm">
                Queue is empty
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
