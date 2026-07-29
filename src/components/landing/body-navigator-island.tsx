"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Flame, Zap, Target, Bone, Compass, Users,
  ChevronRight, CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Icon map — passed as data so this file stays self-contained
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame, Zap, Target, Bone, Compass, Users,
};

export type BodyPart = {
  id: string;
  name: string;
  icon: string; // key into ICON_MAP
  subtitle: string;
  conditions: string[];
  solution: string;
  recovery: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function BodyNavigatorIsland({ bodyParts }: { bodyParts: BodyPart[] }) {
  const [selected, setSelected] = useState(bodyParts[0]);

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Body part list */}
      <div
        className="lg:col-span-5 space-y-3"
        role="listbox"
        aria-label="Select body part"
        aria-activedescendant={`bodypart-${selected.id}`}
      >
        {bodyParts.map((bp, idx) => {
          const Icon = ICON_MAP[bp.icon];
          const isSelected = selected.id === bp.id;
          return (
            <motion.div
              key={bp.id}
              id={`bodypart-${bp.id}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={idx}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => setSelected(bp)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(bp);
                }
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#d5f14c] ${
                isSelected
                  ? "bg-slate-900 border-teal-400 text-white shadow-xl"
                  : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-teal-400 text-[#102321]"
                        : "bg-slate-800 text-teal-400"
                    }`}
                    aria-hidden="true"
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{bp.name}</h3>
                    <p className="text-xs text-slate-400">{bp.subtitle}</p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 transition-transform ${
                    isSelected ? "translate-x-1 text-teal-400" : "text-slate-600"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Condition detail panel */}
      <div className="lg:col-span-7" aria-live="polite" aria-atomic="true">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="glass-card border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="text-2xl font-black text-white font-heading">
                {selected.name} Conditions
              </h3>
              <Badge className="bg-teal-950/80 text-teal-300 border-teal-700/50 text-xs font-mono">
                {selected.recovery}
              </Badge>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                // COMMONLY DIAGNOSED CONDITIONS
              </h4>
              <ul className="grid sm:grid-cols-2 gap-3" role="list">
                {selected.conditions.map((cond, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 bg-[#0c1a18] p-3 rounded-xl border border-slate-800/80 text-xs font-medium text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" aria-hidden="true" />
                    {cond}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                // CLINICAL TREATMENT APPROACH
              </h4>
              <p className="text-sm text-teal-300 font-semibold leading-relaxed">
                {selected.solution}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
