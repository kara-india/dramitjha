/**
 * KrishnaHealth ERP — Server Actions: Appointments
 * Dr. Amit Jha Sports Injury Clinic, Varanasi
 *
 * All appointment lifecycle transitions with proper validation,
 * duplicate detection, and audit logging.
 */
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/(auth)/login/actions";
import { generateDocumentNumber } from "@/lib/utils";
import { z } from "zod";
import type {
  AppointmentStatus,
  AppointmentType,
  Department,
  Prisma,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/app/(auth)/login/actions";

// ============================================================
// SCHEMAS
// ============================================================

const createAppointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  type: z.enum([
    "CONSULTATION",
    "FOLLOW_UP",
    "PROCEDURE",
    "PHYSIOTHERAPY",
    "VACCINATION",
    "SURGERY_OT",
    "WALK_IN",
  ]),
  department: z.enum([
    "ORTHOPEDIC",
    "PEDIATRICS",
    "PHYSIOTHERAPY",
    "GENERAL",
    "OT",
  ]),
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm required)"),
  durationMinutes: z.number().min(15).max(240).default(30),
  chiefComplaint: z.string().optional(),
  priority: z.enum(["ROUTINE", "URGENT", "EMERGENCY"]).default("ROUTINE"),
  isWalkIn: z.boolean().default(false),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

const updateStatusSchema = z.object({
  appointmentId: z.string().min(1),
  status: z.enum([
    "REQUESTED",
    "SCHEDULED",
    "CONFIRMED",
    "CHECKED_IN",
    "IN_TRIAGE",
    "READY_FOR_DOCTOR",
    "IN_CONSULTATION",
    "PENDING_DIAGNOSTICS",
    "REVIEW_READY",
    "COMPLETED",
    "NO_SHOW",
    "CANCELLED",
  ]),
  notes: z.string().optional(),
});

// Valid status transitions (state machine)
const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  REQUESTED: ["SCHEDULED", "CANCELLED"],
  SCHEDULED: ["CONFIRMED", "CHECKED_IN", "NO_SHOW", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "NO_SHOW", "CANCELLED"],
  CHECKED_IN: ["IN_TRIAGE", "READY_FOR_DOCTOR"],
  IN_TRIAGE: ["READY_FOR_DOCTOR"],
  READY_FOR_DOCTOR: ["IN_CONSULTATION"],
  IN_CONSULTATION: ["PENDING_DIAGNOSTICS", "COMPLETED"],
  PENDING_DIAGNOSTICS: ["REVIEW_READY"],
  REVIEW_READY: ["IN_CONSULTATION", "COMPLETED"],
  COMPLETED: [],
  NO_SHOW: [],
  CANCELLED: [],
};

// ============================================================
// CREATE APPOINTMENT
// ============================================================

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<ActionResult<{ id: string; appointmentNo: string }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const parsed = createAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
      code: "VALIDATION_ERROR",
    };
  }

  const data = parsed.data;

  // Check for scheduling conflict
  const conflict = await prisma.appointment.findFirst({
    where: {
      tenantId: user.tenantId,
      doctorId: data.doctorId,
      scheduledDate: new Date(data.scheduledDate),
      scheduledTime: data.scheduledTime,
      deletedAt: null,
      status: {
        notIn: ["CANCELLED", "NO_SHOW"],
      },
    },
  });

  if (conflict) {
    return {
      success: false,
      error: `Doctor already has an appointment at ${data.scheduledTime} on this date.`,
      code: "SLOT_CONFLICT",
    };
  }

  // Generate appointment number
  const count = await prisma.appointment.count({
    where: { tenantId: user.tenantId },
  });
  const appointmentNo = generateDocumentNumber("APT", count + 1);

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      const apt = await tx.appointment.create({
        data: {
          tenantId: user.tenantId,
          patientId: data.patientId,
          doctorId: data.doctorId,
          appointmentNo,
          type: data.type as AppointmentType,
          department: data.department as Department,
          status: "SCHEDULED",
          scheduledDate: new Date(data.scheduledDate),
          scheduledTime: data.scheduledTime,
          durationMinutes: data.durationMinutes,
          chiefComplaint: data.chiefComplaint,
          priority: data.priority,
          isWalkIn: data.isWalkIn,
          notes: data.notes,
        },
      });

      // Record status history
      await tx.appointmentStatusHistory.create({
        data: {
          appointmentId: apt.id,
          toStatus: "SCHEDULED",
          changedBy: user.id,
          notes: "Appointment created",
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: "CREATE",
          tableName: "appointments",
          recordId: apt.id,
          newData: {
            appointmentNo,
            patientId: data.patientId,
            doctorId: data.doctorId,
            scheduledDate: data.scheduledDate,
            scheduledTime: data.scheduledTime,
          },
        },
      });

      return apt;
    });

    revalidatePath("/dashboard/appointments");
    return {
      success: true,
      data: { id: appointment.id, appointmentNo: appointment.appointmentNo },
    };
  } catch (error) {
    console.error("createAppointment error:", error);
    return {
      success: false,
      error: "Failed to create appointment. Please try again.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// UPDATE APPOINTMENT STATUS (State Machine)
// ============================================================

export async function updateAppointmentStatus(input: {
  appointmentId: string;
  status: AppointmentStatus;
  notes?: string;
}): Promise<ActionResult<{ status: AppointmentStatus }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
      code: "VALIDATION_ERROR",
    };
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: parsed.data.appointmentId,
      tenantId: user.tenantId,
      deletedAt: null,
    },
  });

  if (!appointment) {
    return { success: false, error: "Appointment not found", code: "NOT_FOUND" };
  }

  // Validate transition
  const validNext = VALID_TRANSITIONS[appointment.status] ?? [];
  if (!validNext.includes(parsed.data.status)) {
    return {
      success: false,
      error: `Cannot transition from ${appointment.status} to ${parsed.data.status}`,
      code: "INVALID_TRANSITION",
    };
  }

  // Build update data with timestamps
  const updateData: Prisma.AppointmentUpdateInput = {
    status: parsed.data.status,
  };

  if (parsed.data.status === "CHECKED_IN") {
    updateData.checkedInAt = new Date();
  } else if (parsed.data.status === "IN_TRIAGE") {
    updateData.triageStartAt = new Date();
  } else if (parsed.data.status === "IN_CONSULTATION") {
    updateData.consultStartAt = new Date();
  } else if (parsed.data.status === "COMPLETED") {
    updateData.completedAt = new Date();
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id: appointment.id },
        data: updateData,
      });

      await tx.appointmentStatusHistory.create({
        data: {
          appointmentId: appointment.id,
          fromStatus: appointment.status,
          toStatus: parsed.data.status,
          changedBy: user.id,
          notes: parsed.data.notes,
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: "UPDATE",
          tableName: "appointments",
          recordId: appointment.id,
          oldData: { status: appointment.status },
          newData: { status: parsed.data.status },
        },
      });
    });

    revalidatePath("/dashboard/appointments");
    revalidatePath(`/dashboard/appointments/${appointment.id}`);

    return {
      success: true,
      data: { status: parsed.data.status },
    };
  } catch (error) {
    console.error("updateAppointmentStatus error:", error);
    return {
      success: false,
      error: "Failed to update appointment status.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// GET APPOINTMENTS
// ============================================================

export type AppointmentListItem = {
  id: string;
  appointmentNo: string;
  status: AppointmentStatus;
  type: AppointmentType;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  chiefComplaint: string | null;
  priority: string;
  isWalkIn: boolean;
  patient: {
    id: string;
    mrn: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    bloodGroup: string;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    department: string | null;
  };
};

export async function getAppointments(params: {
  date?: string;
  doctorId?: string;
  status?: AppointmentStatus[];
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<
  ActionResult<{ appointments: AppointmentListItem[]; total: number }>
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const page = params.page ?? 1;
  const limit = params.limit ?? 50;
  const skip = (page - 1) * limit;

  const where: Prisma.AppointmentWhereInput = {
    tenantId: user.tenantId,
    deletedAt: null,
  };

  if (params.date) {
    const date = new Date(params.date);
    where.scheduledDate = date;
  }

  if (params.doctorId) {
    where.doctorId = params.doctorId;
  }

  if (params.status?.length) {
    where.status = { in: params.status };
  }

  if (params.department) {
    where.department = params.department as Department;
  }

  if (params.search) {
    where.OR = [
      {
        patient: {
          OR: [
            { mrn: { contains: params.search, mode: "insensitive" } },
            { firstName: { contains: params.search, mode: "insensitive" } },
            { lastName: { contains: params.search, mode: "insensitive" } },
            { phone: { contains: params.search } },
          ],
        },
      },
      { appointmentNo: { contains: params.search, mode: "insensitive" } },
    ];
  }

  // Doctors can only see their own appointments
  if (user.role === "DOCTOR" || user.role === "PHYSIOTHERAPIST") {
    where.doctorId = user.id;
  }

  try {
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: [
          { scheduledDate: "asc" },
          { scheduledTime: "asc" },
        ],
        skip,
        take: limit,
        include: {
          patient: {
            select: {
              id: true,
              mrn: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              gender: true,
              phone: true,
              bloodGroup: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              department: true,
            },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      success: true,
      data: {
        appointments: appointments.map((apt) => ({
          ...apt,
          scheduledDate: apt.scheduledDate.toISOString(),
          patient: {
            ...apt.patient,
            dateOfBirth: apt.patient.dateOfBirth.toISOString(),
            gender: apt.patient.gender,
            bloodGroup: apt.patient.bloodGroup,
          },
          doctor: {
            ...apt.doctor,
            department: apt.doctor.department,
          },
        })),
        total,
      },
    };
  } catch (error) {
    console.error("getAppointments error:", error);
    return {
      success: false,
      error: "Failed to fetch appointments.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// GET TODAY'S QUEUE
// ============================================================

export async function getTodaysQueue(doctorId?: string): Promise<
  ActionResult<AppointmentListItem[]>
> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getAppointments({
    date: today.toISOString().split("T")[0],
    doctorId,
    status: [
      "SCHEDULED",
      "CONFIRMED",
      "CHECKED_IN",
      "IN_TRIAGE",
      "READY_FOR_DOCTOR",
      "IN_CONSULTATION",
      "PENDING_DIAGNOSTICS",
      "REVIEW_READY",
    ],
    limit: 100,
  }).then((result) => {
    if (!result.success) return result;
    return { success: true, data: result.data.appointments };
  });
}
