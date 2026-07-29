"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE, DEMO_USER } from "@/lib/auth/demo";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/**
 * Current staff user for dashboard server actions.
 * Supports demo cookie session without Prisma/Supabase.
 */
export async function getCurrentUser() {
  try {
    const jar = await cookies();
    if (jar.get(DEMO_COOKIE)?.value === "1") {
      return {
        id: DEMO_USER.id,
        tenantId: "default-tenant-id",
        email: DEMO_USER.email,
        firstName: "Dr. Amit",
        lastName: "Jha",
        role: "ADMIN" as const,
        department: "ORTHOPEDIC" as const,
        isActive: true,
      };
    }
  } catch {
    // ignore cookie errors
  }

  // Optional Supabase path — never throw out of this function
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    return {
      id: session.user.id,
      tenantId: "default-tenant-id",
      email: session.user.email || "admin@dramitjha.in",
      firstName: "Dr. Amit",
      lastName: "Jha",
      role: "ADMIN" as const,
      department: "ORTHOPEDIC" as const,
      isActive: true,
    };
  } catch {
    return null;
  }
}

export async function logoutAction() {
  try {
    const jar = await cookies();
    jar.delete(DEMO_COOKIE);
  } catch {
    // ignore
  }
  redirect("/login");
}
