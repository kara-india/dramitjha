"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE } from "@/lib/auth/demo";

/** Logout clears demo cookie. Supabase sign-out is best-effort. */
export async function logoutAction() {
  try {
    const jar = await cookies();
    jar.delete(DEMO_COOKIE);
  } catch {
    // ignore
  }
  redirect("/login");
}
