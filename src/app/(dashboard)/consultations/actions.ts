"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Mock DB & Auth Helpers ---
// In a real app, these would import from @/lib/auth, @/lib/db, etc.
const getCurrentUser = async () => ({ id: "user_123", role: "DOCTOR", name: "Dr. Amit Jha" });
const db = {
  consultation: {
    create: async (data: any) => ({ id: "cons_123", ...data }),
    update: async ({ where, data }: any) => ({ id: where.id, ...data }),
    findUnique: async ({ where }: any) => ({
      id: where.id,
      status: "IN_CONSULTATION",
      patient: {
        mrn: "MRN-2026-001",
        name: "Rahul Kumar",
        age: 28,
        gender: "Male",
        bloodGroup: "O+",
        allergies: ["Penicillin", "Peanuts"],
      },
      appointment: { id: "app_1", department: "ORTHOPEDIC", chiefComplaint: "Knee pain" },
      vitals: {
        bpSystolic: 120,
        bpDiastolic: 80,
        heartRate: 72,
        spO2: 98,
        temperature: 98.6,
        weight: 70,
        height: 175,
        bmi: 22.8,
        painScore: 5,
        bloodSugar: 90,
      },
      soapNotes: {
        subjective: "Knee pain since 2 weeks",
        objective: "Swelling in right knee",
        assessmentPrimary: "ACL Tear",
        assessmentSecondary: "Meniscus tear",
        plan: "Rest, Ice, Compression, Elevation",
      },
    }),
  },
  appointment: {
    update: async (data: any) => ({}),
  },
  prescription: {
    create: async (data: any) => ({ id: "presc_1" }),
  },
  orthopedicRecord: {
    upsert: async (data: any) => ({}),
  },
  pediatricRecord: {
    upsert: async (data: any) => ({}),
  },
  physioRecord: {
    upsert: async (data: any) => ({}),
  },
  fileRecord: {
    create: async (data: any) => ({}),
  }
};

const auditLog = async (action: string, details: any) => {
  console.log(`[AUDIT] ${action}`, details);
};

// --- Schemas ---

const VitalsSchema = z.object({
  bpSystolic: z.number().optional(),
  bpDiastolic: z.number().optional(),
  heartRate: z.number().optional(),
  spO2: z.number().optional(),
  temperature: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  painScore: z.number().min(0).max(10).optional(),
  bloodSugar: z.number().optional(),
});

const SoapNotesSchema = z.object({
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessmentPrimary: z.string().optional(),
  assessmentSecondary: z.string().optional(),
  plan: z.string().optional(),
});

const PrescriptionItemSchema = z.object({
  medicineId: z.string(),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  durationDays: z.number(),
  route: z.string(),
  instructions: z.string().optional(),
  quantity: z.number(),
});

const OrthoSchema = z.object({
  specialTests: z.record(z.string(), z.enum(["POSITIVE", "NEGATIVE", "NOT_DONE"])).optional(),
  romInputs: z.string().optional(),
  affectedJoint: z.string().optional(),
  affectedSide: z.enum(["LEFT", "RIGHT", "BILATERAL", "NA"]).optional(),
  mechanismOfInjury: z.string().optional(),
  implantDetails: z.string().optional(),
});

const PediatricSchema = z.object({
  headCircumference: z.number().optional(),
  milestones: z.record(z.string(), z.boolean()).optional(),

  vaccinationsGiven: z.array(z.string()).optional(),
});

const PhysioSchema = z.object({
  bodyChartSvgState: z.string().optional(),
  romTesting: z.string().optional(),
  strengthTesting: z.string().optional(),
  treatmentGoals: z.string().optional(),
  hepPrescription: z.string().optional(),
});

// --- Actions ---

export async function createConsultation(appointmentId: string) {
  const user = await getCurrentUser();
  if (!user || !["DOCTOR", "PHYSIOTHERAPIST"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  const consultation = await db.consultation.create({
    data: {
      appointmentId,
      status: "IN_CONSULTATION",
      doctorId: user.id,
    }
  });

  await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "IN_CONSULTATION" }
  });

  await auditLog("CREATE_CONSULTATION", { appointmentId, consultationId: consultation.id, by: user.id });
  revalidatePath(`/consultations/${consultation.id}`);
  return { success: true, consultationId: consultation.id };
}

export async function saveConsultation(id: string, vitals: z.infer<typeof VitalsSchema>, soapData: z.infer<typeof SoapNotesSchema>) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await db.consultation.update({
    where: { id },
    data: {
      vitals: { update: vitals },
      soapNotes: { update: soapData }
    }
  });

  return { success: true };
}

export async function addPrescription(consultationId: string, items: z.infer<typeof PrescriptionItemSchema>[]) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") throw new Error("Only doctors can prescribe");

  await db.prescription.create({
    data: {
      consultationId,
      items: {
        create: items
      }
    }
  });

  await auditLog("ADD_PRESCRIPTION", { consultationId, by: user.id });
  revalidatePath(`/consultations/${consultationId}`);
  return { success: true };
}

export async function signOffConsultation(id: string) {
  const user = await getCurrentUser();
  if (!user || !["DOCTOR", "PHYSIOTHERAPIST", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized to sign off");
  }

  const consultation = await db.consultation.findUnique({ where: { id } });
  if (!consultation.vitals?.weight || !consultation.soapNotes?.assessmentPrimary) {
    return { success: false, error: "Missing required fields for sign off (Weight, Primary Diagnosis)" };
  }

  await db.consultation.update({
    where: { id },
    data: { status: "COMPLETED", signedOffBy: user.id, signedOffAt: new Date() }
  });

  await auditLog("SIGN_OFF_CONSULTATION", { consultationId: id, by: user.id });
  revalidatePath(`/consultations/${id}`);
  return { success: true };
}

export async function uploadMedicalFile(consultationId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  const type = formData.get("type") as string;
  if (!file) throw new Error("No file provided");

  // Mock upload to storage
  const fileUrl = `https://storage.mock.com/files/${file.name}`;
  
  await db.fileRecord.create({
    data: {
      consultationId,
      url: fileUrl,
      type,
      name: file.name,
      size: file.size,
    }
  });

  await auditLog("UPLOAD_FILE", { consultationId, fileUrl, type, by: user.id });
  revalidatePath(`/consultations/${consultationId}`);
  return { success: true, url: fileUrl };
}

export async function getConsultation(id: string) {
  return await db.consultation.findUnique({ where: { id } });
}

export async function addOrthopedicData(consultationId: string, data: z.infer<typeof OrthoSchema>) {
  await db.orthopedicRecord.upsert({
    where: { consultationId },
    update: data,
    create: { consultationId, ...data }
  });
  return { success: true };
}

export async function addPediatricData(consultationId: string, data: z.infer<typeof PediatricSchema>) {
  await db.pediatricRecord.upsert({
    where: { consultationId },
    update: data,
    create: { consultationId, ...data }
  });
  return { success: true };
}

export async function addPhysioData(consultationId: string, data: z.infer<typeof PhysioSchema>) {
  await db.physioRecord.upsert({
    where: { consultationId },
    update: data,
    create: { consultationId, ...data }
  });
  return { success: true };
}
