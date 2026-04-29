"use client";

import { GlassCard } from "./ui/GlassCard";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AggregatedTopic } from "@/lib/aggregation";

export function FrameworkSpotlight({ topics }: { topics: AggregatedTopic[] }) {
  const topTopic = topics[0];

  const spotlight = topTopic
    ? {
        name: topTopic.canonicalName,
        tagline: "Trending Cross-Platform",
        description:
          topTopic.mentions[0]?.description ||
          "Generating significant traction across platforms right now.",
        growth: `Hot · Score ${topTopic.score.toFixed(1)}`,
        url: topTopic.mentions[0]?.url || "#",
        sourceCount: topTopic.mentions.length,
      }
    : {
        name: "Loading…",
        tagline: "",
        description: "Pulling data from GitHub, HN, and Dev.to",
        growth: "…",
        url: "#",
        sourceCount: 0,
      };

  return (
    <GlassCard className="h-full relative overflow-hidden">
      
      <div className="absolute top-5 right-5">
        <Sparkles
          className="w-5 h-5 animate-float"
          style={{ color: "var(--accent-amber)" }}
        />
      </div>

      <div className="mb-5">
        <span
          className="text-[10px] font-extrabold tracking-[0.2em] uppercase px-3 py-1 rounded-full"
          style={{
            color: "var(--accent-amber)",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          ✦ Cross-Platform Spotlight
        </span>
      </div>

      <div className="relative z-10">
        <h3
          className="text-4xl md:text-5xl font-extrabold mb-3 line-clamp-1 tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {spotlight.name}
        </h3>

        <p
          className="text-sm leading-relaxed mb-6 line-clamp-3 max-w-[90%]"
          style={{ color: "var(--text-secondary)" }}
        >
          {spotlight.description}
        </p>

        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span
            className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "var(--accent-green)",
            }}
          >
            {spotlight.growth}
          </span>

          {spotlight.sourceCount > 1 && (
            <span
              className="px-3 py-1.5 rounded-xl text-xs font-mono"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-default)",
                color: "var(--text-muted)",
              }}
            >
              {spotlight.sourceCount} mentions
            </span>
          )}
        </div>

        <Link
          href={spotlight.url}
          target="_blank"
          className="inline-flex items-center gap-2 text-sm font-semibold group transition-colors"
          style={{ color: "var(--accent-blue)" }}
        >
          View Source{" "}
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "var(--glow-blue)",
          filter: "blur(80px)",
        }}
      />
    </GlassCard>
  );
}
