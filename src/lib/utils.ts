/**
 * KrishnaHealth ERP — Utility Functions
 * Dr. Amit Jha Sports Injury Clinic, Varanasi
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

// ============================================================
// CLASS MERGING
// ============================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// MRN GENERATION
// ============================================================

/**
 * Generate a Medical Record Number in format: KH-YYYY-XXXXXX
 * The XXXXXX is a zero-padded sequential number per tenant per year.
 * In practice, the sequential number comes from the DB, but this
 * function formats the final MRN string.
 */
export function formatMRN(year: number, sequence: number): string {
  const paddedSeq = sequence.toString().padStart(6, "0");
  return `KH-${year}-${paddedSeq}`;
}

/**
 * Generate document numbers for various entities.
 */
export function generateDocumentNumber(
  prefix: string,
  sequence: number
): string {
  const year = new Date().getFullYear();
  const paddedSeq = sequence.toString().padStart(5, "0");
  return `${prefix}-${year}-${paddedSeq}`;
}

// ============================================================
// DATE & TIME UTILITIES (IST Timezone)
// ============================================================

export const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Format a date for display in IST.
 */
export function formatDate(
  date: Date | string | null | undefined,
  formatStr: string = "dd MMM yyyy"
): string {
  if (!date) return "—";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "—";
  const istDate = toZonedTime(dateObj, IST_TIMEZONE);
  return format(istDate, formatStr);
}

/**
 * Format date and time in IST.
 */
export function formatDateTime(
  date: Date | string | null | undefined
): string {
  return formatDate(date, "dd MMM yyyy, hh:mm a");
}

/**
 * Format time only in IST.
 */
export function formatTime(date: Date | string | null | undefined): string {
  return formatDate(date, "hh:mm a");
}

/**
 * Format relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(
  date: Date | string | null | undefined
): string {
  if (!date) return "—";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "—";
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Get current date/time in IST.
 */
export function nowIST(): Date {
  return toZonedTime(new Date(), IST_TIMEZONE);
}

/**
 * Convert HH:mm string to display format (e.g., "09:00" → "9:00 AM").
 */
export function formatTimeString(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * Physiotherapy slots — 30-min intervals:
 * Morning: 11:00-13:30 (11:00, 11:30, 12:00, 12:30, 13:00)
 * Evening: 15:30-20:30 (15:30, 16:00, 16:30, 17:00, 17:30, 18:00, 18:30, 19:00, 19:30, 20:00)
 */
export const PHYSIO_SLOTS = [
  // Morning session
  "11:00", "11:30", "12:00", "12:30", "13:00",
  // Evening session
  "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00",
];

export function getPhysioSlotDisplay(
  slot: string
): { time: string; session: "morning" | "evening" } {
  const hour = parseInt(slot.split(":")[0]);
  return {
    time: formatTimeString(slot),
    session: hour < 14 ? "morning" : "evening",
  };
}

// ============================================================
// CURRENCY FORMATTING
// ============================================================

/**
 * Format amount in Indian Rupees.
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  showSymbol: boolean = true
): string {
  if (amount === null || amount === undefined) return "₹0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0.00";

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return showSymbol ? formatted : formatted.replace("₹", "").trim();
}

/**
 * Format number in Indian numbering system (with lakhs/crores).
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

// ============================================================
// GST CALCULATION
// ============================================================

export type GSTType = "CGST_SGST" | "IGST" | "EXEMPT";

export interface GSTCalculation {
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalWithTax: number;
}

/**
 * Calculate GST based on taxable amount and rates.
 * Clinic is in Uttar Pradesh, so:
 * - Intrastate (UP patients): CGST + SGST
 * - Interstate: IGST
 * Medical services (SAC 9993) are generally exempt.
 */
export function calculateGST(
  taxableAmount: number,
  gstRate: number, // e.g., 18 for 18%
  gstType: GSTType = "CGST_SGST"
): GSTCalculation {
  if (gstType === "EXEMPT" || gstRate === 0) {
    return {
      taxableAmount,
      cgstRate: 0, cgstAmount: 0,
      sgstRate: 0, sgstAmount: 0,
      igstRate: 0, igstAmount: 0,
      totalTax: 0,
      totalWithTax: taxableAmount,
    };
  }

  if (gstType === "IGST") {
    const igstAmount = (taxableAmount * gstRate) / 100;
    return {
      taxableAmount,
      cgstRate: 0, cgstAmount: 0,
      sgstRate: 0, sgstAmount: 0,
      igstRate: gstRate, igstAmount: Math.round(igstAmount * 100) / 100,
      totalTax: Math.round(igstAmount * 100) / 100,
      totalWithTax: taxableAmount + Math.round(igstAmount * 100) / 100,
    };
  }

  // CGST + SGST (intrastate)
  const halfRate = gstRate / 2;
  const cgstAmount = (taxableAmount * halfRate) / 100;
  const sgstAmount = (taxableAmount * halfRate) / 100;
  const totalTax = cgstAmount + sgstAmount;

  return {
    taxableAmount,
    cgstRate: halfRate, cgstAmount: Math.round(cgstAmount * 100) / 100,
    sgstRate: halfRate, sgstAmount: Math.round(sgstAmount * 100) / 100,
    igstRate: 0, igstAmount: 0,
    totalTax: Math.round(totalTax * 100) / 100,
    totalWithTax: taxableAmount + Math.round(totalTax * 100) / 100,
  };
}

// ============================================================
// AGE CALCULATION
// ============================================================

export function calculateAge(dateOfBirth: Date | string): string {
  const dob = typeof dateOfBirth === "string" ? parseISO(dateOfBirth) : dateOfBirth;
  const now = new Date();
  const years = now.getFullYear() - dob.getFullYear();
  const months = now.getMonth() - dob.getMonth();

  if (years === 0) {
    const totalMonths = months < 0 ? months + 12 : months;
    if (totalMonths === 0) {
      const days = now.getDate() - dob.getDate();
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
    return `${totalMonths} month${totalMonths !== 1 ? "s" : ""}`;
  }

  if (years < 5) {
    const adjustedMonths = months < 0 ? months + 12 : months;
    return `${years}y ${adjustedMonths}m`;
  }

  const adjustedYears =
    months < 0 || (months === 0 && now.getDate() < dob.getDate())
      ? years - 1
      : years;
  return `${adjustedYears} yrs`;
}

export function calculateAgeInMonths(dateOfBirth: Date | string): number {
  const dob = typeof dateOfBirth === "string" ? parseISO(dateOfBirth) : dateOfBirth;
  const now = new Date();
  return (now.getFullYear() - dob.getFullYear()) * 12 +
    (now.getMonth() - dob.getMonth());
}

// ============================================================
// VITALS / BMI
// ============================================================

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): {
  category: string;
  color: string;
} {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
  if (bmi < 25) return { category: "Normal", color: "text-green-600" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
  return { category: "Obese", color: "text-red-600" };
}

// ============================================================
// PEDIATRIC DOSING
// ============================================================

/**
 * Calculate pediatric dose based on weight.
 * Returns recommended dose with max dose cap.
 */
export function calculatePediatricDose(
  weightKg: number,
  dosePerKgMg: number,
  maxDoseMg?: number
): number {
  const calculatedDose = weightKg * dosePerKgMg;
  if (maxDoseMg) {
    return Math.min(calculatedDose, maxDoseMg);
  }
  return Math.round(calculatedDose * 10) / 10;
}

// ============================================================
// INVENTORY / FEFO
// ============================================================

/**
 * Check if a batch is near expiry (within given days).
 */
export function isNearExpiry(expiryDate: Date | string, daysThreshold: number = 30): boolean {
  const expiry = typeof expiryDate === "string" ? parseISO(expiryDate) : expiryDate;
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= daysThreshold && diffDays > 0;
}

export function isExpired(expiryDate: Date | string): boolean {
  const expiry = typeof expiryDate === "string" ? parseISO(expiryDate) : expiryDate;
  return expiry < new Date();
}

export function daysUntilExpiry(expiryDate: Date | string): number {
  const expiry = typeof expiryDate === "string" ? parseISO(expiryDate) : expiryDate;
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ============================================================
// APPOINTMENT STATUS
// ============================================================

export const APPOINTMENT_STATUS_CONFIG = {
  REQUESTED: { label: "Requested", color: "bg-gray-100 text-gray-700", icon: "Clock" },
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-700", icon: "CalendarCheck" },
  CONFIRMED: { label: "Confirmed", color: "bg-indigo-100 text-indigo-700", icon: "CheckCircle" },
  CHECKED_IN: { label: "Checked In", color: "bg-purple-100 text-purple-700", icon: "LogIn" },
  IN_TRIAGE: { label: "In Triage", color: "bg-yellow-100 text-yellow-700", icon: "Activity" },
  READY_FOR_DOCTOR: { label: "Ready", color: "bg-orange-100 text-orange-700", icon: "UserCheck" },
  IN_CONSULTATION: { label: "Consulting", color: "bg-teal-100 text-teal-700", icon: "Stethoscope" },
  PENDING_DIAGNOSTICS: { label: "Diagnostics", color: "bg-cyan-100 text-cyan-700", icon: "FlaskConical" },
  REVIEW_READY: { label: "Review Ready", color: "bg-lime-100 text-lime-700", icon: "ClipboardCheck" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700", icon: "CheckCircle2" },
  NO_SHOW: { label: "No Show", color: "bg-gray-100 text-gray-500", icon: "UserX" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: "XCircle" },
} as const;

// ============================================================
// TRUNCATION & TEXT UTILITIES
// ============================================================

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

// ============================================================
// VALIDATION HELPERS
// ============================================================

export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

// ============================================================
// API RESPONSE HELPERS
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  timestamp: string;
}

export function successResponse<T>(
  data: T,
  meta?: ApiResponse["meta"]
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(
  code: string,
  message: string,
  details?: unknown
): ApiResponse {
  return {
    success: false,
    error: { code, message, details },
    timestamp: new Date().toISOString(),
  };
}
