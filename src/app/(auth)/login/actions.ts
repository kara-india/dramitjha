"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE, DEMO_USER } from "@/lib/auth/demo";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export type StaffRole =
  | "ADMIN"
  | "DOCTOR"
  | "PHYSIOTHERAPIST"
  | "NURSE"
  | "RECEPTIONIST"
  | "PHARMACIST"
  | "STAFF";

export type StaffUser = {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  department: string;
  isActive: boolean;
};

/**
 * Current staff user for dashboard server actions.
 * Supports demo cookie session without Prisma/Supabase.
 */
export async function getCurrentUser(): Promise<StaffUser | null> {
  try {
    const jar = await cookies();
    if (jar.get(DEMO_COOKIE)?.value === "1") {
      const user: StaffUser = {
        id: DEMO_USER.id,
        tenantId: "default-tenant-id",
        email: DEMO_USER.email,
        firstName: "Dr. Amit",
        lastName: "Jha",
        role: "ADMIN",
        department: "ORTHOPEDIC",
        isActive: true,
      };
      return user;
    }
  } catch {
    // ignore cookie errors
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    const metaRole = session.user.user_metadata?.role as StaffRole | undefined;

    const user: StaffUser = {
      id: session.user.id,
      tenantId: "default-tenant-id",
      email: session.user.email || "admin@dramitjha.in",
      firstName: "Dr. Amit",
      lastName: "Jha",
      role: metaRole || "ADMIN",
      department: "ORTHOPEDIC",
      isActive: true,
    };
    return user;
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
