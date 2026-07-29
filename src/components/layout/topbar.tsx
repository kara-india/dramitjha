"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn, initials } from "@/lib/utils";
import { DashboardUser } from "./dashboard-layout";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface TopbarProps {
  user: DashboardUser;
  toggleSidebar: () => void;
  onMobileMenu: () => void;
}

export function Topbar({ user, toggleSidebar, onMobileMenu }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const formatBreadcrumb = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length <= 1) return "Dashboard";
    return (
      parts[parts.length - 1].charAt(0).toUpperCase() +
      parts[parts.length - 1].slice(1).replace(/-/g, " ")
    );
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/demo-logout", { method: "POST" });
    } catch {
      // ignore
    }
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-3 border-b bg-card/80 px-3 backdrop-blur-xl sm:gap-x-4 sm:px-6 lg:px-8">
      {/* Mobile: open drawer */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onMobileMenu}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop: collapse sidebar */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex shrink-0"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-x-3 self-stretch min-w-0">
        <div className="flex flex-1 min-w-0">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-medium truncate">
            <span className="font-outfit font-medium text-foreground truncate">
              Dr. Amit Jha Sports Injury Clinic
            </span>
            <span className="text-border shrink-0">/</span>
            <span className="text-foreground capitalize shrink-0">
              {formatBreadcrumb(pathname)}
            </span>
          </div>
          <div className="md:hidden text-sm font-semibold text-foreground truncate">
            {formatBreadcrumb(pathname)}
          </div>
        </div>

        <div className="flex items-center gap-x-1.5 sm:gap-x-3 shrink-0">
          <Button
            variant="outline"
            className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 text-muted-foreground bg-muted/50 border-muted"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 xl:mr-2" />
            <span className="hidden xl:inline-flex">Search patients...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-card px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Search Patients</CommandItem>
                <CommandItem>New Appointment</CommandItem>
                <CommandItem>View Schedule</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs font-semibold text-foreground">
              {mounted
                ? new Date().toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "..."}
            </span>
            <span className="text-[10px] text-muted-foreground">Varanasi, India (IST)</span>
          </div>

          <div className="h-6 w-px bg-border hidden lg:block" aria-hidden="true" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="-m-1.5 flex items-center p-1.5 hover:bg-transparent"
              >
                <span className="sr-only">Open user menu</span>
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-teal-100 text-teal-700">
                    {initials(user.name, "")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex lg:items-center">
                  <Badge
                    variant="secondary"
                    className="ml-2 text-[10px] uppercase bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-none font-bold"
                  >
                    {user.role}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
