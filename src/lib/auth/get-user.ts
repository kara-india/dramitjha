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
        id: session.user.id,
      },
      include: {
        role: true,
        department: true,
        tenant: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return null;
  }
}
