"use client";

import { TrendingItem } from "@/lib/api";
import { GlassCard } from "./ui/GlassCard";
import { Github, FileCode, Newspaper, Terminal, Anchor } from "lucide-react";
import Link from "next/link";

const SOURCE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  GitHub: {
    icon: <Github className="w-4 h-4" />,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
  },
  StackOverflow: {
    icon: <Terminal className="w-4 h-4" />,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
  },
  "Dev.to": {
    icon: <FileCode className="w-4 h-4" />,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
  },
  HackerNews: {
    icon: <Newspaper className="w-4 h-4" />,
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
  },
  Lobsters: {
    icon: <Anchor className="w-4 h-4" />,
    color: "#fb7185",
    bg: "rgba(251,113,133,0.12)",
  },
};

function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query?.trim()) return <>{text}</>;
  const parts = text.split(
    new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  );
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-400/30 text-yellow-300 rounded px-0.5 not-italic"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function TrendCard({
  item,
  index,
  highlightQuery,
}: {
  item: TrendingItem;
  index: number;
  highlightQuery?: string;
}) {
  const src = SOURCE_CONFIG[item.source] ?? {
    icon: null,
    color: "var(--text-muted)",
    bg: "var(--bg-input)",
  };

  return (
    <GlassCard
      delay={index * 0.07}
      className="flex flex-col h-full hover:border-[var(--border-strong)] group"
    >
      
      <div className="flex justify-between items-center mb-4">
        <div
          className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: src.bg, color: src.color }}
        >
          {src.icon}
          <span>{item.source}</span>
        </div>
        <span
          className="text-xs font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          {item.date}
        </span>
      </div>

      <Link href={item.url} target="_blank" className="flex-1 block">
        <h3
          className="text-base font-semibold mb-2 line-clamp-2 leading-snug group-hover:text-[var(--accent-blue)] transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          <Highlight text={item.title} query={highlightQuery} />
        </h3>
        <p
          className="text-sm line-clamp-3 mb-4 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          <Highlight text={item.description} query={highlightQuery} />
        </p>
      </Link>

      <div
        className="flex items-center justify-between mt-auto pt-3"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <div className="flex gap-1.5 flex-wrap">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "var(--bg-input)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <span
          className="text-xs font-mono font-semibold shrink-0 ml-2"
          style={{ color: "var(--accent-green)" }}
        >
          {item.meta}
        </span>
      </div>
    </GlassCard>
  );
}
