import { Suspense } from "react";
import { AdminDashboardClient } from "./admin-client";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AdminDashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  // Simulating a server fetch delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-teal-900 dark:text-teal-100">
          Good morning, Dr. Amit Jha
        </h2>
        <div className="text-sm text-muted-foreground">{currentDate} (IST)</div>
      </div>
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Skeleton className="col-span-4 h-[400px] w-full rounded-xl" />
              <Skeleton className="col-span-3 h-[400px] w-full rounded-xl" />
            </div>
          </div>
        }
      >
        <AdminDashboardClient />
      </Suspense>
    </div>
  );
}
