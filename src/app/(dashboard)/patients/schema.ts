import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]),
  phone: z.string().min(10, "Valid phone number required"),
  altPhone: z.string().optional(),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode required"),
  allergies: z.array(z.object({
    name: z.string(),
    severity: z.enum(["Mild", "Moderate", "Severe"])
  })).optional().default([]),
  existingConditions: z.array(z.string()).optional().default([]),
  insuranceProvider: z.string().optional(),
  insuranceId: z.string().optional(),
  emergencyContacts: z.array(z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string()
  })).min(1, "At least one emergency contact is required"),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

export type Patient = PatientFormValues & {
  id: string;
  mrn: string;
  lastVisit?: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
};
