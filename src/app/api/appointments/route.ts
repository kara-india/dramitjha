import { NextResponse } from "next/server";
import { addAppointment, listAppointments } from "@/lib/appointments-store";

export async function GET() {
  try {
    return NextResponse.json({ appointments: listAppointments() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ appointments: [], error: "Failed to list" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const name = String(body.name || body.patientName || "").trim();
    const phone = String(body.phone || body.patientPhone || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Patient name is required" }, { status: 400 });
    }

    const row = addAppointment({
      patientName: name,
      patientPhone: phone || "—",
      doctorId: body.doctorId || "DOC-001",
      doctorName: body.doctorName || "Dr. Amit Jha",
      type: body.type || "CONSULTATION",
      status: "SCHEDULED",
      date: body.date || new Date().toISOString().split("T")[0],
      time: body.time || "11:00",
      duration: Number(body.duration) || 30,
      partId: body.partId,
      source: body.source === "staff" ? "staff" : "public",
    });

    return NextResponse.json({ success: true, appointment: row });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
