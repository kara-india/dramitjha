import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

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
      // Fallback for development if db seed user isn't linked yet
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
    return null;
  }
}
