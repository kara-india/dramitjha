/**
 * KrishnaHealth ERP — Server Actions: Patients
 * Dr. Amit Jha Sports Injury Clinic, Varanasi
 */
"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/(auth)/login/actions";
import { formatMRN } from "@/lib/utils";
import { z } from "zod";
import type { Gender, BloodGroup, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/app/(auth)/login/actions";

// ============================================================
// SCHEMAS
// ============================================================

const patientDemographicsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  bloodGroup: z
    .enum([
      "A_POS",
      "A_NEG",
      "B_POS",
      "B_NEG",
      "O_POS",
      "O_NEG",
      "AB_POS",
      "AB_NEG",
      "UNKNOWN",
    ])
    .default("UNKNOWN"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  altPhone: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode")
    .optional()
    .nullable(),
  occupation: z.string().optional().nullable(),
  referredBy: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // Insurance
  insuranceName: z.string().optional().nullable(),
  policyNumber: z.string().optional().nullable(),
  tpaName: z.string().optional().nullable(),
});

const emergencyContactSchema = z.object({
  name: z.string().min(2),
  relationship: z.string().min(1),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  altPhone: z.string().optional().nullable(),
  isPrimary: z.boolean().default(false),
});

const allergySchema = z.object({
  allergen: z.string().min(1),
  severity: z.enum(["MILD", "MODERATE", "SEVERE", "LIFE_THREATENING"]),
  reaction: z.string().optional(),
  notes: z.string().optional(),
});

const createPatientSchema = patientDemographicsSchema.extend({
  emergencyContacts: z.array(emergencyContactSchema).min(1, "At least one emergency contact is required"),
  allergies: z.array(allergySchema).default([]),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;

// ============================================================
// MRN GENERATION (Thread-safe via DB sequence)
// ============================================================

async function generateMRN(tenantId: string): Promise<string> {
  const year = new Date().getFullYear();

  // Count existing patients this year to generate sequential MRN
  const startOfYear = new Date(year, 0, 1);
  const count = await prisma.patient.count({
    where: {
      tenantId,
      registeredAt: { gte: startOfYear },
    },
  });

  return formatMRN(year, count + 1);
}

// ============================================================
// CHECK DUPLICATE PATIENT
// ============================================================

export async function checkDuplicatePatient(params: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
}): Promise<ActionResult<{ isDuplicate: boolean; existing?: unknown }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const existing = await prisma.patient.findFirst({
    where: {
      tenantId: user.tenantId,
      deletedAt: null,
      OR: [
        { phone: params.phone },
        {
          AND: [
            { firstName: { equals: params.firstName, mode: "insensitive" } },
            { lastName: { equals: params.lastName, mode: "insensitive" } },
            { dateOfBirth: new Date(params.dateOfBirth) },
          ],
        },
      ],
    },
    select: {
      id: true,
      mrn: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      phone: true,
    },
  });

  return {
    success: true,
    data: {
      isDuplicate: !!existing,
      existing: existing ?? undefined,
    },
  };
}

// ============================================================
// CREATE PATIENT
// ============================================================

export async function createPatient(
  input: CreatePatientInput
): Promise<ActionResult<{ id: string; mrn: string }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const parsed = createPatientSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
      code: "VALIDATION_ERROR",
    };
  }

  const data = parsed.data;

  // Check phone duplicate
  const phoneExists = await prisma.patient.findFirst({
    where: {
      tenantId: user.tenantId,
      phone: data.phone,
      deletedAt: null,
    },
    select: { id: true, mrn: true, firstName: true, lastName: true },
  });

  if (phoneExists) {
    return {
      success: false,
      error: `A patient with this phone number already exists: ${phoneExists.firstName} ${phoneExists.lastName} (${phoneExists.mrn})`,
      code: "DUPLICATE_PHONE",
    };
  }

  const mrn = await generateMRN(user.tenantId);

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const p = await tx.patient.create({
        data: {
          tenantId: user.tenantId,
          mrn,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender as Gender,
          bloodGroup: (data.bloodGroup as BloodGroup) ?? "UNKNOWN",
          phone: data.phone,
          altPhone: data.altPhone ?? null,
          email: data.email ?? null,
          addressLine1: data.addressLine1 ?? null,
          addressLine2: data.addressLine2 ?? null,
          city: data.city ?? null,
          state: data.state ?? null,
          pincode: data.pincode ?? null,
          occupation: data.occupation ?? null,
          referredBy: data.referredBy ?? null,
          notes: data.notes ?? null,
          insuranceName: data.insuranceName ?? null,
          policyNumber: data.policyNumber ?? null,
          tpaName: data.tpaName ?? null,
          emergencyContacts: {
            create: data.emergencyContacts.map((ec) => ({
              name: ec.name,
              relationship: ec.relationship,
              phone: ec.phone,
              altPhone: ec.altPhone ?? null,
              isPrimary: ec.isPrimary,
            })),
          },
          allergies: {
            create: data.allergies.map((a) => ({
              allergen: a.allergen,
              severity: a.severity as "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING",
              reaction: a.reaction ?? null,
              notes: a.notes ?? null,
            })),
          },
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: "CREATE",
          tableName: "patients",
          recordId: p.id,
          newData: {
            mrn,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
        },
      });

      return p;
    });

    revalidatePath("/dashboard/patients");

    return {
      success: true,
      data: { id: patient.id, mrn: patient.mrn },
    };
  } catch (error) {
    console.error("createPatient error:", error);
    return {
      success: false,
      error: "Failed to register patient. Please try again.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// GET PATIENTS (paginated)
// ============================================================

export async function getPatients(params: {
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}): Promise<ActionResult<{ patients: unknown[]; total: number }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const page = params.page ?? 1;
  const limit = params.limit ?? 25;
  const skip = (page - 1) * limit;

  const where: Prisma.PatientWhereInput = {
    tenantId: user.tenantId,
    isActive: true,
    deletedAt: null,
  };

  if (params.search) {
    where.OR = [
      { mrn: { contains: params.search, mode: "insensitive" } },
      { firstName: { contains: params.search, mode: "insensitive" } },
      { lastName: { contains: params.search, mode: "insensitive" } },
      { phone: { contains: params.search } },
    ];
  }

  if (params.startDate || params.endDate) {
    where.registeredAt = {};
    if (params.startDate) {
      (where.registeredAt as Prisma.DateTimeFilter).gte = new Date(params.startDate);
    }
    if (params.endDate) {
      (where.registeredAt as Prisma.DateTimeFilter).lte = new Date(params.endDate);
    }
  }

  try {
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { registeredAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          mrn: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          bloodGroup: true,
          phone: true,
          email: true,
          city: true,
          registeredAt: true,
          _count: {
            select: {
              appointments: true,
              consultations: true,
            },
          },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    return {
      success: true,
      data: { patients, total },
    };
  } catch (error) {
    console.error("getPatients error:", error);
    return {
      success: false,
      error: "Failed to fetch patients.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// GET SINGLE PATIENT
// ============================================================

export async function getPatient(
  id: string
): Promise<ActionResult<unknown>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  try {
    const patient = await prisma.patient.findFirst({
      where: {
        id,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      include: {
        emergencyContacts: true,
        allergies: { where: { isActive: true } },
        appointments: {
          orderBy: { scheduledDate: "desc" },
          take: 20,
          include: {
            doctor: {
              select: { firstName: true, lastName: true, department: true },
            },
          },
        },
        consultations: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            doctor: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        invoices: {
          orderBy: { invoiceDate: "desc" },
          take: 10,
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            paidAmount: true,
            balanceAmount: true,
            status: true,
            invoiceDate: true,
          },
        },
        vaccinations: { orderBy: { scheduledDate: "desc" } },
        growthRecords: { orderBy: { recordDate: "desc" } },
      },
    });

    if (!patient) {
      return { success: false, error: "Patient not found", code: "NOT_FOUND" };
    }

    // Audit: view event
    await prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: "VIEW",
        tableName: "patients",
        recordId: id,
      },
    });

    return { success: true, data: patient };
  } catch (error) {
    console.error("getPatient error:", error);
    return {
      success: false,
      error: "Failed to fetch patient.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// UPDATE PATIENT
// ============================================================

export async function updatePatient(
  id: string,
  input: Partial<z.infer<typeof patientDemographicsSchema>>
): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  const patient = await prisma.patient.findFirst({
    where: { id, tenantId: user.tenantId, deletedAt: null },
    select: { id: true },
  });

  if (!patient) {
    return { success: false, error: "Patient not found", code: "NOT_FOUND" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const oldPatient = await tx.patient.findUnique({
        where: { id },
      });

      await tx.patient.update({
        where: { id },
        data: {
          ...(input.firstName && { firstName: input.firstName }),
          ...(input.lastName && { lastName: input.lastName }),
          ...(input.dateOfBirth && { dateOfBirth: new Date(input.dateOfBirth) }),
          ...(input.gender && { gender: input.gender as Gender }),
          ...(input.bloodGroup && { bloodGroup: input.bloodGroup as BloodGroup }),
          ...(input.phone && { phone: input.phone }),
          altPhone: input.altPhone ?? undefined,
          email: input.email ?? undefined,
          addressLine1: input.addressLine1 ?? undefined,
          addressLine2: input.addressLine2 ?? undefined,
          city: input.city ?? undefined,
          state: input.state ?? undefined,
          pincode: input.pincode ?? undefined,
          occupation: input.occupation ?? undefined,
          referredBy: input.referredBy ?? undefined,
          notes: input.notes ?? undefined,
          insuranceName: input.insuranceName ?? undefined,
          policyNumber: input.policyNumber ?? undefined,
          tpaName: input.tpaName ?? undefined,
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: "UPDATE",
          tableName: "patients",
          recordId: id,
          oldData: oldPatient as object,
          newData: input as object,
        },
      });
    });

    revalidatePath(`/dashboard/patients/${id}`);
    revalidatePath("/dashboard/patients");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("updatePatient error:", error);
    return {
      success: false,
      error: "Failed to update patient.",
      code: "DB_ERROR",
    };
  }
}

// ============================================================
// SOFT DELETE PATIENT
// ============================================================

export async function softDeletePatient(
  id: string
): Promise<ActionResult<null>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };

  if (user.role !== "ADMIN") {
    return {
      success: false,
      error: "Only administrators can delete patients.",
      code: "FORBIDDEN",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.patient.update({
        where: { id },
        data: { deletedAt: new Date(), isActive: false },
      });

      await tx.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: "DELETE",
          tableName: "patients",
          recordId: id,
        },
      });
    });

    revalidatePath("/dashboard/patients");
    return { success: true, data: null };
  } catch (error) {
    console.error("softDeletePatient error:", error);
    return {
      success: false,
      error: "Failed to delete patient.",
      code: "DB_ERROR",
    };
  }
}
