"use server";

import { revalidatePath } from "next/cache";
import { patientSchema, PatientFormValues, Patient } from "./schema";

// Mock database
let patientsDB: Patient[] = [
  {
    id: "1",
    mrn: "KH-2026-000001",
    firstName: "Rajesh",
    lastName: "Kumar",
    dob: "1985-05-12",
    gender: "Male",
    bloodGroup: "O+",
    phone: "9876543210",
    address: "123 Main St",
    city: "Varanasi",
    state: "UP",
    pincode: "221001",
    allergies: [],
    existingConditions: ["Hypertension"],
    emergencyContacts: [{ name: "Suresh Kumar", relationship: "Brother", phone: "9876543211" }],
    status: "Active",
    lastVisit: "2026-07-20",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function createPatient(data: PatientFormValues) {
  const parsed = patientSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  const { firstName, lastName, dob, phone } = parsed.data;

  const isDuplicate = patientsDB.some(
    (p) =>
      p.firstName.toLowerCase() === firstName.toLowerCase() &&
      p.lastName.toLowerCase() === lastName.toLowerCase() &&
      p.dob === dob &&
      p.phone === phone
  );

  if (isDuplicate) {
    throw new Error("Potential duplicate patient found");
  }

  const mrn = `KH-2026-${String(patientsDB.length + 1).padStart(6, "0")}`;
  const newPatient: Patient = {
    ...parsed.data,
    id: Math.random().toString(36).substring(7),
    mrn,
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  patientsDB.push(newPatient);
  revalidatePath("/patients");
  
  return { success: true, patient: newPatient };
}

export async function getPatients(params?: { search?: string; page?: number; limit?: number }) {
  const { search = "", page = 1, limit = 10 } = params || {};
  let filtered = [...patientsDB];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      p => p.mrn.toLowerCase().includes(s) || 
           `${p.firstName} ${p.lastName}`.toLowerCase().includes(s) || 
           p.phone.includes(s)
    );
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    data: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  };
}

export async function getPatient(id: string) {
  const patient = patientsDB.find(p => p.id === id);
  if (!patient) throw new Error("Patient not found");
  return patient;
}

export async function updatePatient(id: string, data: Partial<PatientFormValues>) {
  const index = patientsDB.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Patient not found");

  patientsDB[index] = {
    ...patientsDB[index],
    ...data,
    updatedAt: new Date().toISOString()
  };

  revalidatePath("/patients");
  revalidatePath(`/patients/${id}`);
  
  return { success: true, patient: patientsDB[index] };
}

export async function softDeletePatient(id: string) {
  const index = patientsDB.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Patient not found");

  patientsDB[index].status = "Inactive";
  patientsDB[index].updatedAt = new Date().toISOString();

  revalidatePath("/patients");
  
  return { success: true };
}
