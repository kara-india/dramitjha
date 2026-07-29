import { NextResponse } from "next/server";
import { DEMO_COOKIE, isDemoCredentials } from "@/lib/auth/demo";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!isDemoCredentials(email, password)) {
      return NextResponse.json(
        { error: "Invalid demo credentials. Use doctor@dramitjha.in / demo1234" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true, demo: true });
    res.cookies.set(DEMO_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (e) {
    console.error("demo-login error", e);
    return NextResponse.json({ error: "Demo login failed" }, { status: 500 });
  }
}
