"use client";

import { useSearch } from "@/lib/search-context";
import { TrendingItem } from "@/lib/api";
import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Github,
  FileCode,
  Newspaper,
  Terminal,
  Anchor,
  X,
  ArrowRight,
} from "lucide-react";

const SourceIcon = ({ source }: { source: TrendingItem["source"] }) => {
  const cls = "w-4 h-4 shrink-0";
  switch (source) {
    case "GitHub":
      return <Github className={`${cls} text-purple-400`} />;
    case "StackOverflow":
      return <Terminal className={`${cls} text-orange-400`} />;
    case "Dev.to":
      return <FileCode className={`${cls} text-blue-400`} />;
    case "HackerNews":
      return <Newspaper className={`${cls} text-orange-500`} />;
    case "Lobsters":
      return <Anchor className={`${cls} text-rose-500`} />;
    default:
      return null;
  }
};

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(
    new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  );
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function CommandPalette() {
  const { allItems, isOpen, closePalette } = useSearch();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [allItems, query]);

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
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter") {
        if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
          closePalette();
        } else if (results[cursor]) {
          window.open(results[cursor].url, "_blank");
          closePalette();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, cursor, closePalette, query, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closePalette();
      }}
    >
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
        }}
      >
        
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <Search
            className="w-5 h-5 shrink-0"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Research a project idea… e.g. 'trello clone'"
            className="flex-1 bg-transparent text-base outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ color: "var(--text-muted)" }}
              className="hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            className="hidden sm:flex items-center gap-1 text-xs rounded-lg px-2 py-1 font-mono"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--border-default)",
              background: "var(--bg-input)",
            }}
          >
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {query.length >= 2 && results.length === 0 && (
            <div
              className="py-12 text-center text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No results for &ldquo;
              <span style={{ color: "var(--text-primary)" }}>{query}</span>
              &rdquo;
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
                    className="flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors"
                    style={{
                      background:
                        i === cursor
                          ? "var(--bg-card-hover)"
                          : "transparent",
                    }}
                    onMouseEnter={() => setCursor(i)}
                  >
                    <SourceIcon source={item.source} />
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium line-clamp-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {highlight(item.title, query)}
                      </div>
                      <div
                        className="text-xs line-clamp-1 mt-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {highlight(item.description || "", query)}
                      </div>
                    </div>
                    <span
                      className="text-xs shrink-0 self-center font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.source}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {results.length > 0 && (
            <div
              className="flex items-center justify-between px-5 py-3 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                closePalette();
              }}
            >
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                See all results for &ldquo;
                <span style={{ color: "var(--text-primary)" }}>{query}</span>
                &rdquo;
              </span>
              <ArrowRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-5 px-5 py-2.5 text-xs font-mono"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-input)",
            color: "var(--text-muted)",
          }}
        >
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>ESC close</span>
        </div>
      </div>
    </div>
  );
}
