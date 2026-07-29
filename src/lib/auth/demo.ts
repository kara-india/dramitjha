/** Demo / preview credentials for Staff ERP when Supabase is unavailable. */

export const DEMO_EMAIL = "doctor@dramitjha.in";
export const DEMO_PASSWORD = "demo1234";
export const DEMO_COOKIE = "kh_demo_session";

export const DEMO_USER = {
  id: "demo-doctor-001",
  email: DEMO_EMAIL,
  name: "Dr. Amit Kumar Jha",
  role: "DOCTOR" as const,
  avatar: "",
};

export function isDemoCredentials(email: string, password: string): boolean {
  const e = email.trim().toLowerCase();
  return (
    (e === DEMO_EMAIL || e === "admin@dramitjha.in" || e === "demo@dramitjha.in") &&
    password === DEMO_PASSWORD
  );
}
