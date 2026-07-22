/**
 * KrishnaHealth ERP — RBAC (Role-Based Access Control)
 * Dr. Amit Jha Sports Injury Clinic, Varanasi
 *
 * Permissions are additive. Admin has all permissions.
 * The `withAuth` wrapper enforces permissions at the server action level.
 */

export type UserRole =
  | "ADMIN"
  | "RECEPTIONIST"
  | "DOCTOR"
  | "PHYSIOTHERAPIST"
  | "PHARMACIST"
  | "ACCOUNTANT";

// Permission strings following resource:action format
export type Permission =
  // Patient permissions
  | "patients:read"
  | "patients:write"
  | "patients:delete"
  // Appointment permissions
  | "appointments:read"
  | "appointments:write"
  | "appointments:cancel"
  // Consultation permissions
  | "consultations:read"
  | "consultations:write"
  | "consultations:sign_off"
  // EMR permissions
  | "emr:read"
  | "emr:write"
  // Prescription permissions
  | "prescriptions:read"
  | "prescriptions:write"
  // Inventory permissions
  | "inventory:read"
  | "inventory:write"
  | "inventory:dispense"
  | "inventory:purchase"
  // Billing permissions
  | "billing:read"
  | "billing:write"
  | "billing:discount"
  | "billing:refund"
  // Accounting permissions
  | "accounting:read"
  | "accounting:write"
  // Reports permissions
  | "reports:own"
  | "reports:department"
  | "reports:financial"
  | "reports:all"
  // OT permissions
  | "ot:read"
  | "ot:write"
  // Admin permissions
  | "admin:users"
  | "admin:settings"
  | "admin:audit";

// Permissions matrix per role
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "patients:read",
    "patients:write",
    "patients:delete",
    "appointments:read",
    "appointments:write",
    "appointments:cancel",
    "consultations:read",
    "consultations:write",
    "consultations:sign_off",
    "emr:read",
    "emr:write",
    "prescriptions:read",
    "prescriptions:write",
    "inventory:read",
    "inventory:write",
    "inventory:dispense",
    "inventory:purchase",
    "billing:read",
    "billing:write",
    "billing:discount",
    "billing:refund",
    "accounting:read",
    "accounting:write",
    "reports:all",
    "ot:read",
    "ot:write",
    "admin:users",
    "admin:settings",
    "admin:audit",
  ],
  RECEPTIONIST: [
    "patients:read",
    "patients:write",
    "appointments:read",
    "appointments:write",
    "appointments:cancel",
    "billing:read",
    "billing:write",
    "billing:discount",
    "ot:read",
    "reports:own",
  ],
  DOCTOR: [
    "patients:read",
    "appointments:read",
    "appointments:write",
    "consultations:read",
    "consultations:write",
    "consultations:sign_off",
    "emr:read",
    "emr:write",
    "prescriptions:read",
    "prescriptions:write",
    "inventory:read",
    "ot:read",
    "ot:write",
    "reports:department",
    "reports:own",
  ],
  PHYSIOTHERAPIST: [
    "patients:read",
    "appointments:read",
    "appointments:write",
    "consultations:read",
    "consultations:write",
    "consultations:sign_off",
    "emr:read",
    "emr:write",
    "prescriptions:read",
    "ot:read",
    "reports:own",
    "reports:department",
  ],
  PHARMACIST: [
    "patients:read",
    "prescriptions:read",
    "inventory:read",
    "inventory:write",
    "inventory:dispense",
    "inventory:purchase",
    "billing:read",
    "reports:own",
  ],
  ACCOUNTANT: [
    "billing:read",
    "billing:write",
    "billing:discount",
    "billing:refund",
    "accounting:read",
    "accounting:write",
    "reports:financial",
    "reports:all",
    "inventory:read",
  ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(
  role: UserRole | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return permissions.includes(permission);
}

/**
 * Check if a role has ANY of the given permissions.
 */
export function hasAnyPermission(
  role: UserRole | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Check if a role has ALL of the given permissions.
 */
export function hasAllPermissions(
  role: UserRole | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role.
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Dashboard route per role.
 */
export const ROLE_DASHBOARD: Record<UserRole, string> = {
  ADMIN: "/admin",
  RECEPTIONIST: "/reception",
  DOCTOR: "/doctor",
  PHYSIOTHERAPIST: "/physio",
  PHARMACIST: "/pharmacy",
  ACCOUNTANT: "/accounts",
};

/**
 * Sidebar navigation items per role.
 * Used to filter navigation based on permissions.
 */
export type NavItem = {
  title: string;
  href: string;
  icon: string;
  permission?: Permission;
  badge?: "count" | "alert";
  children?: NavItem[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/doctor",
    icon: "LayoutDashboard",
  },
  {
    title: "Patients",
    href: "/patients",
    icon: "Users",
    permission: "patients:read",
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: "Calendar",
    permission: "appointments:read",
  },
  {
    title: "OT Schedule",
    href: "/ot",
    icon: "Stethoscope",
    permission: "ot:read",
  },
  {
    title: "Consultations",
    href: "/consultations",
    icon: "ClipboardList",
    permission: "consultations:read",
  },
  {
    title: "Departments",
    href: "/doctor",
    icon: "Building2",
    permission: "emr:read",
    children: [
      {
        title: "Orthopedic",
        href: "/doctor",
        icon: "Bone",
        permission: "emr:read",
      },
      {
        title: "Pediatrics",
        href: "/doctor",
        icon: "Baby",
        permission: "emr:read",
      },
      {
        title: "Physiotherapy",
        href: "/physio",
        icon: "Activity",
        permission: "emr:read",
      },
    ],
  },
  {
    title: "Inventory",
    href: "/pharmacy",
    icon: "Package",
    permission: "inventory:read",
  },
  {
    title: "Billing",
    href: "/accounts",
    icon: "Receipt",
    permission: "billing:read",
  },
  {
    title: "Accounting",
    href: "/accounts",
    icon: "BookOpen",
    permission: "accounting:read",
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: "BarChart3",
    permission: "reports:own",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
    permission: "admin:settings",
  },
];

/**
 * Role display configuration
 */
export const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; description: string }
> = {
  ADMIN: {
    label: "Administrator",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    description: "Full system access",
  },
  RECEPTIONIST: {
    label: "Receptionist",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    description: "Patient registration, appointments, billing",
  },
  DOCTOR: {
    label: "Doctor",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    description: "Consultations, EMR, prescriptions",
  },
  PHYSIOTHERAPIST: {
    label: "Physiotherapist",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    description: "Physio sessions, treatment plans",
  },
  PHARMACIST: {
    label: "Pharmacist",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    description: "Inventory, dispensing",
  },
  ACCOUNTANT: {
    label: "Accountant",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    description: "Billing, accounting, reports",
  },
};
