import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ROLE_DASHBOARD, UserRole } from "@/lib/auth/rbac";

export default async function DashboardIndexPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user.user_metadata?.role as UserRole) || "DOCTOR";
  const targetRoute = ROLE_DASHBOARD[role] || "/dashboard/doctor";

  redirect(targetRoute);
}
