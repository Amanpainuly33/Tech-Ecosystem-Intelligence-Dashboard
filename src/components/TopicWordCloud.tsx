"use client";

import { GlassCard } from "./ui/GlassCard";
import { AggregatedTopic } from "@/lib/aggregation";

const TAG_COLORS = [
  { color: "var(--accent-blue)", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)" },
  { color: "var(--accent-purple)", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)" },
  { color: "var(--accent-cyan)", bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.2)" },
  { color: "var(--accent-pink)", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)" },
  { color: "var(--accent-amber)", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
];

export function TopicWordCloud({ topics }: { topics: AggregatedTopic[] }) {
  const displayTopics = topics.slice(0, 20);

  return (
    <GlassCard className="h-full">
      <h3
        className="text-base font-bold mb-5"
        style={{ color: "var(--text-primary)" }}
      >
        Top Trending Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {displayTopics.map((topic, i) => {
          const palette = TAG_COLORS[i % TAG_COLORS.length];
          return (
            <span
              key={topic.canonicalName}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-default hover:scale-105"
              style={{
                background: palette.bg,
                color: palette.color,
                border: `1px solid ${palette.border}`,
              }}
              title={`Score: ${topic.score.toFixed(1)}`}
            >
              {topic.canonicalName}
            </span>
          );
        })}
      </div>
    </GlassCard>
  );
}
