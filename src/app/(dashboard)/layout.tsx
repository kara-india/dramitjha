import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UserRole } from "@/lib/auth/rbac";

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const user = {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.user_metadata?.name || "Dr. User",
    role: (session.user.user_metadata?.role as UserRole) || "DOCTOR",
    avatar: session.user.user_metadata?.avatar || "",
  };

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
