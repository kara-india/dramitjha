"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, LogOut, ChevronLeft, ChevronRight, LayoutDashboard, Users, Calendar, Stethoscope, ClipboardList, Building2, Package, Receipt, FileText, Settings } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { NAV_ITEMS, hasPermission } from "@/lib/auth/rbac";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardUser } from "./dashboard-layout";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: DashboardUser;
}

const itemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -20 },
};

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  ClipboardList,
  Building2,
  Package,
  Receipt,
  FileText,
  Settings,
};

export function Sidebar({ isCollapsed, setIsCollapsed, user }: SidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS.filter((item) => !item.permission || hasPermission(user.role, item.permission));

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "280px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full border-r bg-card/50 backdrop-blur-xl z-20 hidden lg:flex"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 bg-teal-600 rounded-lg flex items-center justify-center text-white shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-teal-800 dark:text-teal-400 leading-none">
                KrishnaHealth
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Dr. Amit Jha Clinic
              </span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {navItems.map((item, i) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = iconMap[item.icon] || Activity;
          
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                custom={i}
                initial="closed"
                animate="open"
                variants={itemVariants}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group relative mb-1",
                  isActive 
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-teal-600 dark:text-teal-400" : "")} />
                {!isCollapsed && (
                  <span className="font-medium text-sm truncate">{item.title}</span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-card">
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
          <Avatar className="h-9 w-9 border border-teal-100 dark:border-teal-900 shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-teal-100 text-teal-700 font-medium">{initials(user.name, "")}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
          )}
          {!isCollapsed && (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive shrink-0">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
