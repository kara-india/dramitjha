"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentUser as getUser } from "@/lib/auth/get-user";
export type { ActionResult } from "@/types/actions";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  let { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Smooth onboarding fallback: If user does not exist in Supabase Auth yet, create the user account automatically
  if (
    error &&
    (error.message.toLowerCase().includes("invalid login credentials") ||
      error.message.toLowerCase().includes("user not found"))
  ) {
    const signUpRes = await supabase.auth.signUp({
      email,
      password,
    });

    if (!signUpRes.error) {
      const retry = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!retry.error) {
        return { success: true };
      }
    }
  }

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getCurrentUser() {
  return await getUser();
}
