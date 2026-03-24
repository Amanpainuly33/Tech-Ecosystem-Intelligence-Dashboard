"use client";

import { TrendingItem } from "@/lib/api";
import { GlassCard } from "./ui/GlassCard";
import { Github, FileCode, MessageCircle, Newspaper, Terminal, Anchor } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const SourceIcon = ({ source }: { source: TrendingItem['source'] }) => {
  switch (source) {
    case 'GitHub': return <Github className="w-5 h-5 text-purple-400" />;
    case 'StackOverflow': return <Terminal className="w-5 h-5 text-orange-400" />;
    case 'Dev.to': return <FileCode className="w-5 h-5 text-blue-400" />;
    case 'HackerNews': return <Newspaper className="w-5 h-5 text-orange-500" />;
    case 'Lobsters': return <Anchor className="w-5 h-5 text-rose-700" />;
    default: return null;
  }
};

function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query?.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function TrendCard({ item, index, highlightQuery }: { item: TrendingItem; index: number; highlightQuery?: string }) {
  return (
    <GlassCard delay={index * 0.1} className="flex flex-col h-full hover:bg-white/5 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
            <SourceIcon source={item.source} />
            <span className="text-xs text-zinc-400 font-medium">{item.source}</span>
        </div>
        <span className="text-xs text-zinc-500">{item.date}</span>
      </div>
      
      <Link href={item.url} target="_blank" className="flex-1">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
            <Highlight text={item.title} query={highlightQuery} />
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-3 mb-4">
            <Highlight text={item.description} query={highlightQuery} />
        </p>
      </Link>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex gap-2">
            {item.tags?.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-300">
                    {tag}
                </span>
            ))}
        </div>
        <span className="text-xs font-mono text-emerald-400">{item.meta}</span>
      </div>
    </GlassCard>
  );
}
