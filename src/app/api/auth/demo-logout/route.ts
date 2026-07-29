import { NextResponse } from "next/server";
import { DEMO_COOKIE } from "@/lib/auth/demo";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(DEMO_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
