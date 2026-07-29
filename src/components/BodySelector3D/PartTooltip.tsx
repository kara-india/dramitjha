// src/components/BodySelector3D/PartTooltip.tsx
// Floating label that appears above the hovered/focused part.
// Rendered outside the Canvas (plain DOM) so screen readers can reach it.

"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { FC } from "react";

interface Props {
  label: string | null;
}

export const PartTooltip: FC<Props> = ({ label }) => (
  <AnimatePresence>
    {label && (
      <motion.div
        key={label}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.15 }}
        className={[
          "pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-20",
          "px-4 py-2 rounded-xl text-sm font-bold text-white",
          "bg-slate-900/90 border border-slate-700 shadow-xl backdrop-blur-sm",
        ].join(" ")}
      >
        {label}
      </motion.div>
    )}
  </AnimatePresence>
);
