"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentUser as getUser } from "@/lib/auth/get-user";
import { DEMO_COOKIE, isDemoCredentials } from "@/lib/auth/demo";
export type { ActionResult } from "@/types/actions";

export async function loginAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim() ?? "";
    const password = (formData.get("password") as string) ?? "";

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    // ── Demo path (always works for preview / Vercel without valid Supabase users)
    if (isDemoCredentials(email, password)) {
      const jar = await cookies();
      jar.set(DEMO_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12, // 12 hours
      });
      return { success: true, demo: true };
    }

    // ── Supabase path
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (
      error &&
      (error.message.toLowerCase().includes("invalid login credentials") ||
        error.message.toLowerCase().includes("user not found"))
    ) {
      const signUpRes = await supabase.auth.signUp({ email, password });
      if (!signUpRes.error) {
        const retry = await supabase.auth.signInWithPassword({ email, password });
        if (!retry.error) {
          return { success: true };
        }
      }
    }

    if (error) {
      return {
        error: `${error.message}. For a demo login use: doctor@dramitjha.in / demo1234`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("loginAction error:", err);
    return {
      error:
        "Login service temporarily unavailable. Use demo credentials: doctor@dramitjha.in / demo1234",
    };
  }
}

export async function logoutAction() {
  try {
    const jar = await cookies();
    jar.delete(DEMO_COOKIE);
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
  redirect("/login");
}

export async function getCurrentUser() {
  return await getUser();
}
