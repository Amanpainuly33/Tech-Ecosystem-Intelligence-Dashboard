"use client";

import { GlassCard } from "./ui/GlassCard";
import { motion } from "framer-motion";
import { AggregatedTopic } from "@/lib/aggregation";

const BAR_COLORS = [
  "var(--accent-blue)",
  "var(--accent-amber)",
  "var(--accent-orange)",
  "var(--accent-cyan)",
  "var(--accent-purple)",
];

export function LanguageHeatmap({ topics }: { topics: AggregatedTopic[] }) {
  const top5 = topics.slice(0, 5);

  return (
    <GlassCard className="h-full">
      <h3
        className="text-base font-bold mb-5 flex items-center gap-2"
        style={{ color: "var(--text-primary)" }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "#f87171" }}
        />
        Trending Technologies
      </h3>

      <div className="space-y-4">
        {top5.map((topic, index) => {
          const relativeShare = top5[0]
            ? (topic.score / top5[0].score) * 100
            : 0;
          const barColor = BAR_COLORS[index % BAR_COLORS.length];
          return (
            <motion.div
              key={topic.canonicalName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex justify-between text-xs mb-1.5">
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {topic.canonicalName}
                </span>
                <span
                  className="font-mono"
                  style={{ color: "var(--accent-green)" }}
                >
                  {topic.score.toFixed(1)}
                </span>
              </div>
              <div
                className="h-1.5 w-full rounded-full overflow-hidden"
                style={{ background: "var(--border-subtle)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(8, relativeShare)}%` }}
                  transition={{
                    delay: index * 0.1,
                    duration: 1,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full"
                  style={{ background: barColor, opacity: 0.85 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
