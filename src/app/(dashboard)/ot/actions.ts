'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/app/(auth)/login/actions';
import { z } from 'zod';

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

const otScheduleSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  surgeonId: z.string().min(1, 'Surgeon is required'),
  anesthesiologistId: z.string().optional().nullable(),
  surgeryType: z.string().min(1, 'Surgery type is required'),
  date: z.date(),
  startTime: z.string(), // "HH:mm"
  durationMins: z.number().min(30).max(480),
  otRoom: z.string().min(1, 'OT room is required'),
  anesthesiaType: z.enum(['General', 'Spinal', 'Regional', 'Local']),
  preOpChecklist: z.object({
    pacDone: z.boolean(),
    consentSigned: z.boolean(),
    bloodArranged: z.boolean(),
    npoFromTime: z.string().optional(),
  }),
  notes: z.string().optional(),
});

type CreateOTScheduleInput = z.infer<typeof otScheduleSchema>;

export async function checkOTRoomConflict(
  room: string,
  date: Date,
  startTimeStr: string,
  durationMins: number,
  excludeId?: string
): Promise<boolean> {
  const [hours, minutes] = startTimeStr.split(':').map(Number);
  const startDateTime = new Date(date);
  startDateTime.setHours(hours, minutes, 0, 0);

  const endDateTime = new Date(startDateTime.getTime() + durationMins * 60000);

  const existingSchedules = await prisma.oTSchedule.findMany({
    where: {
      otRoom: room,
      scheduledDate: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      status: {
        not: 'CANCELLED',
      },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: {
      scheduledDate: true,
      startTime: true,
      estimatedDurationMins: true,
    },
  });

  for (const schedule of existingSchedules) {
    const [sHours, sMins] = schedule.startTime.split(':').map(Number);
    const existingStart = new Date(schedule.scheduledDate);
    existingStart.setHours(sHours, sMins, 0, 0);
    const existingEnd = new Date(existingStart.getTime() + schedule.estimatedDurationMins * 60000);

    if (startDateTime < existingEnd && existingStart < endDateTime) {
      return true;
    }
  }

  return false;
}

export async function createOTSchedule(input: CreateOTScheduleInput): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = otScheduleSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: 'Invalid input data' };
    }

    const { data } = validated;

    const hasConflict = await checkOTRoomConflict(data.otRoom, data.date, data.startTime, data.durationMins);
    if (hasConflict) {
      return { success: false, error: 'OT Room is already booked for this time slot' };
    }

    const schedule = await prisma.$transaction(async (tx) => {
      const newSchedule = await tx.oTSchedule.create({
        data: {
          tenantId: user.tenantId,
          patientId: data.patientId,
          surgeonId: data.surgeonId,
          anesthesiologistId: data.anesthesiologistId,
          surgeryType: data.surgeryType,
          scheduledDate: data.date,
          startTime: data.startTime,
          estimatedDurationMins: data.durationMins,
          otNumber: `OT-${Date.now().toString().slice(-6)}`,
          otRoom: data.otRoom,
          anesthesiaType: data.anesthesiaType,
          status: 'SCHEDULED',
          pacDone: data.preOpChecklist.pacDone,
          consentSigned: data.preOpChecklist.consentSigned,
          bloodArranged: data.preOpChecklist.bloodArranged,
          notes: data.notes,
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          action: 'CREATE',
          tableName: 'ot_schedules',
          recordId: newSchedule.id,
          userId: user.id,
          newData: {
            details: `Scheduled surgery ${data.surgeryType} in ${data.otRoom}`,
          },
        },
      });

      return newSchedule;
    });

    revalidatePath('/dashboard/ot');
    return { success: true, data: { id: schedule.id } };
  } catch (error: any) {
    console.error('Failed to create OT schedule:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
}

export async function updateOTStatus(id: string, status: any): Promise<ActionResult<{ success: boolean }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const validStatuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED'];
    if (!validStatuses.includes(status)) {
      return { success: false, error: 'Invalid status' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.oTSchedule.update({
        where: { id },
        data: { status },
      });

      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          action: 'UPDATE',
          tableName: 'ot_schedules',
          recordId: id,
          userId: user.id,
          newData: {
            details: `Updated OT schedule status to ${status}`,
          },
        },
      });
    });

    revalidatePath('/dashboard/ot');
    revalidatePath(`/dashboard/ot/${id}`);
    return { success: true, data: { success: true } };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update status' };
  }
}

export async function updateIntraOpNotes(
  id: string,
  notes: string,
  implantDetails: any
): Promise<ActionResult<{ success: boolean }>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.oTSchedule.update({
        where: { id },
        data: {
          anesthesiaNotes: notes,
          implantDetails: JSON.stringify(implantDetails),
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          action: 'UPDATE',
          tableName: 'ot_schedules',
          recordId: id,
          userId: user.id,
          newData: {
            details: 'Updated intra-op notes and implant details',
          },
        },
      });
    });

    revalidatePath(`/dashboard/ot/${id}`);
    return { success: true, data: { success: true } };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update notes' };
  }
}

export async function getOTSchedules(params: { date?: Date; surgeonId?: string; status?: any }) {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const where: any = { tenantId: user.tenantId, deletedAt: null };
    if (params.date) {
      const startOfDay = new Date(params.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(params.date);
      endOfDay.setHours(23, 59, 59, 999);

      where.scheduledDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }
    if (params.surgeonId) {
      where.surgeonId = params.surgeonId;
    }
    if (params.status) {
      where.status = params.status;
    }

    const schedules = await prisma.oTSchedule.findMany({
      where,
      include: {
        patient: true,
        surgeon: true,
        anesthesiologist: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return schedules;
  } catch (error) {
    console.error('Failed to fetch OT schedules:', error);
    return [];
  }
}

export async function getTodayOTSchedule() {
  const today = new Date();
  return getOTSchedules({ date: today });
}
