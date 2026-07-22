"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { motion } from "framer-motion"

export interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  trendLabel?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground font-inter">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-outfit">
          {typeof value === "number" ? (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.span>
          ) : (
            value
          )}
        </div>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span
              className={cn(
                "flex items-center",
                trend > 0 ? "text-emerald-500" : trend < 0 ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {trend > 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-0.5" />
              ) : trend < 0 ? (
                <ArrowDownIcon className="h-3 w-3 mr-0.5" />
              ) : null}
              {Math.abs(trend)}%
            </span>
            <span>{trendLabel || "from last month"}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
