/** In-memory appointment store (demo / preview). Survives warm serverless instances. */

export type AppointmentStatus =
  | "SCHEDULED"
  | "CHECKED_IN"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "CANCELLED";

export type StoredAppointment = {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  type: string;
  status: AppointmentStatus;
  date: string;
  time: string;
  duration: number;
  partId?: string;
  source: "public" | "staff" | "seed";
  createdAt: string;
};

type GlobalStore = {
  __kh_appointments?: StoredAppointment[];
};

function store(): StoredAppointment[] {
  const g = globalThis as unknown as GlobalStore;
  if (!g.__kh_appointments) {
    const today = new Date().toISOString().split("T")[0];
    g.__kh_appointments = [
      {
        id: "APT-1001",
        patientId: "PAT-001",
        patientName: "Rahul Kumar",
        patientMrn: "KH-2026-0001",
        patientPhone: "9876500001",
        doctorId: "DOC-001",
        doctorName: "Dr. Amit Jha",
        type: "CONSULTATION",
        status: "SCHEDULED",
        date: today,
        time: "10:00",
        duration: 30,
        source: "seed",
        createdAt: new Date().toISOString(),
      },
      {
        id: "APT-1002",
        patientId: "PAT-002",
        patientName: "Sneha Sharma",
        patientMrn: "KH-2026-0002",
        patientPhone: "9876500002",
        doctorId: "DOC-001",
        doctorName: "Dr. Amit Jha",
        type: "FOLLOW_UP",
        status: "CHECKED_IN",
        date: today,
        time: "10:30",
        duration: 15,
        source: "seed",
        createdAt: new Date().toISOString(),
      },
      {
        id: "APT-1003",
        patientId: "PAT-003",
        patientName: "Vikram Patel",
        patientMrn: "KH-2026-0003",
        patientPhone: "9876500003",
        doctorId: "DOC-001",
        doctorName: "Dr. Amit Jha",
        type: "PHYSIOTHERAPY",
        status: "IN_CONSULTATION",
        date: today,
        time: "11:00",
        duration: 45,
        source: "seed",
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return g.__kh_appointments;
}

export function listAppointments(): StoredAppointment[] {
  return [...store()].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.time.localeCompare(b.time);
  });
}

export function addAppointment(
  input: Omit<StoredAppointment, "id" | "createdAt" | "patientMrn" | "patientId"> & {
    patientMrn?: string;
    patientId?: string;
  }
): StoredAppointment {
  const id = `APT-${Date.now().toString().slice(-8)}`;
  const patientId = input.patientId || `PAT-${Date.now().toString().slice(-6)}`;
  const patientMrn =
    input.patientMrn || `KH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  const row: StoredAppointment = {
    id,
    patientId,
    patientMrn,
    patientName: input.patientName,
    patientPhone: input.patientPhone,
    doctorId: input.doctorId || "DOC-001",
    doctorName: input.doctorName || "Dr. Amit Jha",
    type: input.type || "CONSULTATION",
    status: input.status || "SCHEDULED",
    date: input.date || new Date().toISOString().split("T")[0],
    time: normalizeTime(input.time),
    duration: input.duration ?? 30,
    partId: input.partId,
    source: input.source || "public",
    createdAt: new Date().toISOString(),
  };

  store().unshift(row);
  return row;
}

function normalizeTime(t: string): string {
  if (!t) return "11:00";
  // "10:00 AM" → "10:00", "01:00 PM" → "13:00"
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return t.slice(0, 5);
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ap = (m[3] || "").toUpperCase();
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}
