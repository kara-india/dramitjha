"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600"
      >
        <Activity className="h-10 w-10" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-xl font-semibold font-outfit text-foreground"
      >
        KrishnaHealth ERP
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-2 text-sm text-muted-foreground"
      >
        Loading workspace...
      </motion.p>
    </div>
  )
}
