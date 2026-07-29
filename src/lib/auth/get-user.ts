import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { DEMO_COOKIE, DEMO_USER } from "@/lib/auth/demo";

export async function getCurrentUser() {
  // Demo Staff ERP session (no Supabase / Prisma required)
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
    // cookies() may fail in edge contexts
  }

  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          supabaseUserId: session.user.id,
        },
        include: {
          tenant: true,
        },
      });

      if (!user) {
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
      }

      return user;
    } catch (error) {
      console.error("Error fetching user from database:", error);
      // Fallback so dashboard actions don't hard-crash without DB
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
    }
  } catch (error) {
    console.error("getCurrentUser auth error:", error);
    return null;
  }
}
