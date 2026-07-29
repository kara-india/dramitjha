import { NextResponse } from "next/server";
import { captureMessage } from "@/lib/monitoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { feedback, rating } = body || {};

    if (!feedback) {
      return NextResponse.json(
        { error: "Validation Error: Feedback text is required." },
        { status: 400 }
      );
    }

    const feedbackId = `fb_${Date.now()}`;
    captureMessage(`[API /api/feedback] Rating: ${rating || 5}★ — "${feedback}"`, "info");

    return NextResponse.json(
      {
        ok: true,
        feedbackId,
        message: "Thank you! Your feedback has been recorded.",
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
