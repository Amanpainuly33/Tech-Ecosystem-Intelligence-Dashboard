"use client";

import { ECOSYSTEM_FILTERS, EcosystemKey } from "@/lib/normalizer";
import { motion } from "framer-motion";

const FILTER_KEYS = Object.keys(ECOSYSTEM_FILTERS) as EcosystemKey[];

const ICONS: Record<EcosystemKey, string> = {
  All: "⚡",
  Frontend: "🎨",
  "AI / ML": "🤖",
  Systems: "⚙️",
  Backend: "🗄️",
  DevOps: "🚀",
};

interface EcosystemFilterProps {
  active: EcosystemKey;
  onChange: (key: EcosystemKey) => void;
}

export function EcosystemFilter({ active, onChange }: EcosystemFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-10">
      {FILTER_KEYS.map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
            ${active === key
              ? "bg-white text-black border-white shadow-lg shadow-white/10"
              : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
            }`}
        >
          {active === key && (
            <motion.span
              layoutId="ecosystem-active-pill"
              className="absolute inset-0 rounded-full bg-white -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          {ICONS[key]} {key}
        </button>
      ))}
    </div>
  );
}
