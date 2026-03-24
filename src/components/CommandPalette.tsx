"use client";

import { useSearch } from "@/lib/search-context";
import { TrendingItem } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Github, FileCode, Newspaper, Terminal, Anchor, X, ArrowRight } from "lucide-react";

const SourceIcon = ({ source }: { source: TrendingItem["source"] }) => {
  const cls = "w-4 h-4 shrink-0";
  switch (source) {
    case "GitHub":       return <Github      className={`${cls} text-purple-400`} />;
    case "StackOverflow":return <Terminal    className={`${cls} text-orange-400`} />;
    case "Dev.to":       return <FileCode    className={`${cls} text-blue-400`} />;
    case "HackerNews":   return <Newspaper   className={`${cls} text-orange-500`} />;
    case "Lobsters":     return <Anchor      className={`${cls} text-rose-500`} />;
    default:             return null;
  }
};

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded px-0.5">{part}</mark>
      : part
  );
}

export function CommandPalette() {
  const { allItems, isOpen, closePalette } = useSearch();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim().length < 2 ? [] : allItems.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }).slice(0, 12);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closePalette();
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
      if (e.key === "Enter" && results[cursor]) {
        window.open(results[cursor].url, "_blank");
        closePalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, cursor, closePalette]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) closePalette(); }}
    >
      <div className="w-full max-w-2xl mx-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
            placeholder="Search across GitHub, HN, Dev.to..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 text-xs text-zinc-500 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {query.length >= 2 && results.length === 0 && (
            <div className="py-12 text-center text-zinc-500 text-sm">
              No results for &ldquo;<span className="text-white">{query}</span>&rdquo;
            </div>
          )}

          {results.length > 0 && (
            <ul>
              {results.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={closePalette}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${i === cursor ? "bg-white/10" : "hover:bg-white/5"}`}
                    onMouseEnter={() => setCursor(i)}
                  >
                    <SourceIcon source={item.source} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white line-clamp-1">
                        {highlight(item.title, query)}
                      </div>
                      <div className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {highlight(item.description || "", query)}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 shrink-0 self-center">{item.source}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {results.length > 0 && (
            <div
              className="flex items-center justify-between px-4 py-3 border-t border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => { router.push(`/search?q=${encodeURIComponent(query)}`); closePalette(); }}
            >
              <span className="text-sm text-zinc-400">See all results for &ldquo;<span className="text-white">{query}</span>&rdquo;</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 bg-white/[0.02]">
          <span className="text-xs text-zinc-600">↑↓ navigate</span>
          <span className="text-xs text-zinc-600">↵ open</span>
          <span className="text-xs text-zinc-600">ESC close</span>
        </div>
      </div>
    </div>
  );
}
