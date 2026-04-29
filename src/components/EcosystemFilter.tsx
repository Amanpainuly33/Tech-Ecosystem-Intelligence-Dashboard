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
    <div className="flex flex-wrap gap-2.5 justify-center mb-12">
      {FILTER_KEYS.map((key) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={
              isActive
                ? {
                    background: "var(--accent-blue)",
                    color: "#ffffff",
                    border: "1px solid transparent",
                    boxShadow: "0 0 16px rgba(99,102,241,0.35)",
                  }
                : {
                    background: "var(--bg-input)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-default)",
                  }
            }
          >
            {isActive && (
              <motion.span
                layoutId="ecosystem-active-pill"
                className="absolute inset-0 rounded-full -z-10"
                style={{ background: "var(--accent-blue)" }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {ICONS[key]} {key}
            </span>
          </button>
        );
      })}
    </div>
  );
}
