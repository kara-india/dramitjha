import { NextResponse } from "next/server";
import { captureException, captureMessage } from "@/lib/monitoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partId, name, phone } = body || {};

    if (!name || !phone) {
      captureMessage(`[API /api/book] Validation failed: missing name or phone`, "warning");
      return NextResponse.json(
        { error: "Validation Error: Name and phone are required fields." },
        { status: 400 }
      );
    }

    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    captureMessage(`[API /api/book] Successful appointment ${bookingId} for ${name} (${phone}), region: ${partId || 'general'}`, "info");

    return NextResponse.json(
      {
        ok: true,
        bookingId,
        message: "Appointment request received successfully.",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    captureException(err, { context: { route: "/api/book", method: "POST" } });
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
