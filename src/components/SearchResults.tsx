"use client";

import { TrendingItem } from "@/lib/api";
import { TrendCard } from "./TrendCard";
import { Search } from "lucide-react";

const SOURCE_ORDER: TrendingItem["source"][] = [
  "GitHub", "HackerNews", "Dev.to", "StackOverflow", "Lobsters",
];

interface SearchResultsProps {
  query: string;
  results: TrendingItem[];
}

export function SearchResults({ query, results }: SearchResultsProps) {
  if (!query || query.trim().length < 2) {
    return (
      <div className="text-center py-24 text-zinc-500">
        <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg">Type at least 2 characters to search.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-24 text-zinc-500">
        <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg">No results found for &ldquo;<span className="text-white">{query}</span>&rdquo;</p>
        <p className="text-sm mt-2">Try a different keyword, like a technology or topic name.</p>
      </div>
    );
  }

  // Group by source
  const grouped = SOURCE_ORDER.reduce<Record<string, TrendingItem[]>>((acc, source) => {
    const items = results.filter((r) => r.source === source);
    if (items.length > 0) acc[source] = items;
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([source, items]) => (
        <section key={source}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-white">{source}</h2>
            <span className="text-xs text-zinc-500 border border-white/10 rounded-full px-2 py-0.5">
              {items.length} result{items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <TrendCard key={item.id} item={item} index={i} highlightQuery={query} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
