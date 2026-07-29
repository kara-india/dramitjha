"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE } from "@/lib/auth/demo";

// Re-exports so existing dashboard action imports keep working
export { getCurrentUser } from "@/lib/auth/get-user";
export type { ActionResult } from "@/types/actions";

/** Logout clears demo cookie. */
export async function logoutAction() {
  try {
    const jar = await cookies();
    jar.delete(DEMO_COOKIE);
  } catch {
    // ignore
  }
  redirect("/login");
}
