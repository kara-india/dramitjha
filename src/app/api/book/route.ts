import { NextResponse } from "next/server";
import { addAppointment } from "@/lib/appointments-store";

/** Public site booking — same store as Staff ERP appointments. */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const appointment = addAppointment({
      patientName: name,
      patientPhone: phone,
      doctorId: "DOC-001",
      doctorName: "Dr. Amit Jha",
      type: "CONSULTATION",
      status: "SCHEDULED",
      date: body.date || new Date().toISOString().split("T")[0],
      time: body.time || "11:00",
      duration: 30,
      partId: body.partId,
      source: "public",
    });

    return NextResponse.json({
      success: true,
      appointment,
      message: "Appointment request received",
    });
  } catch (e) {
    console.error("book error", e);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
