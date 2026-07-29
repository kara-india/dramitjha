import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partId, name, phone } = body || {};

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Validation Error: Name and phone are required fields." },
        { status: 400 }
      );
    }

    // Process appointment request
    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.log(`[API /api/book] New appointment for ${name} (${phone}), region: ${partId || 'general'}`);

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
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
