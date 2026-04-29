"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass-card rounded-2xl p-6 relative overflow-hidden group",
        className
      )}
      style={{
        transition:
          "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, transparent 60%)",
        }}
      />
      {children}
    </motion.div>
  );
}
