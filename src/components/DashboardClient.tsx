"use client";

import { AggregatedTopic } from "@/lib/aggregation";
import { TrendingItem } from "@/lib/api";
import { ECOSYSTEM_FILTERS, EcosystemKey } from "@/lib/normalizer";
import { useSearch } from "@/lib/search-context";
import { useState, useEffect } from "react";
import { EcosystemFilter } from "./EcosystemFilter";
import { FrameworkSpotlight } from "./FrameworkSpotlight";
import { LanguageHeatmap } from "./LanguageHeatmap";
import { TopicWordCloud } from "./TopicWordCloud";
import { TrendCard } from "./TrendCard";

interface DashboardClientProps {
  data: {
    trendingRepos: TrendingItem[];
    hotQuestions: TrendingItem[];
    topPosts: TrendingItem[];
    techNews: TrendingItem[];
    lobstersNews: TrendingItem[];
    aggregatedTopics: AggregatedTopic[];
    allItems: TrendingItem[];
  };
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [activeFilter, setActiveFilter] = useState<EcosystemKey>("All");
  const { openPalette } = useSearch();

  const filterItems = (items: TrendingItem[]) => {
    if (activeFilter === "All") return items;
    const niceTags = ECOSYSTEM_FILTERS[activeFilter];
    return items.filter((item) => {
        const itemTags = (item.tags || []).map(t => t.toLowerCase());
        return itemTags.some(tag => niceTags.includes(tag));
    });
  };

  const filteredTopics =
    activeFilter === "All"
      ? data.aggregatedTopics
      : data.aggregatedTopics.filter((topic) => {
          const niceTags = ECOSYSTEM_FILTERS[activeFilter];
          return topic.tags.some((tag) => niceTags.includes(tag.toLowerCase()));
        });

  const filteredRepos = filterItems(data.trendingRepos);
  const filteredHN = filterItems(data.techNews);
  const filteredDevTo = filterItems(data.topPosts);
  const filteredLobsters = filterItems(data.lobstersNews);
  const filteredStack = filterItems(data.hotQuestions);

  // Global CMD+K / CTRL+K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openPalette]);

  return (
    <>
      <EcosystemFilter active={activeFilter} onChange={setActiveFilter} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="h-[400px]">
            <FrameworkSpotlight topics={filteredTopics} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full">
              <LanguageHeatmap topics={filteredTopics} />
            </div>
            <div className="h-full">
              <TopicWordCloud topics={filteredTopics} />
            </div>
          </div>
        </div>
        <div className="md:col-span-4 hidden md:block">
            {/* Spotlight Sidebar or extra info could go here */}
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
        Community Pulse
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <h3 className="font-semibold text-zinc-300">GitHub Trending</h3>
          </div>
          {filteredRepos.length > 0 ? (
            filteredRepos.map((repo, i) => (
              <TrendCard key={repo.id} item={repo} index={i} />
            ))
          ) : (
            <p className="text-zinc-600 italic text-sm py-8">No trending repos for this filter.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <h3 className="font-semibold text-zinc-300">Hacker News</h3>
          </div>
          {filteredHN.length > 0 ? (
            filteredHN.map((item, i) => (
              <TrendCard key={item.id} item={item} index={i} />
            ))
          ) : (
            <p className="text-zinc-600 italic text-sm py-8">No tech news for this filter.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="font-semibold text-zinc-300">Dev.to</h3>
          </div>
          {filteredDevTo.length > 0 ? (
            filteredDevTo.map((item, i) => (
              <TrendCard key={item.id} item={item} index={i} />
            ))
          ) : (
            <p className="text-zinc-600 italic text-sm py-8">No top posts for this filter.</p>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
        More From The Community
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredLobsters.map((item, i) => (
          <TrendCard key={item.id} item={item} index={i} />
        ))}
        {filteredStack.map((item, i) => (
          <TrendCard key={item.id} item={item} index={i} />
        ))}
        {(filteredLobsters.length === 0 && filteredStack.length === 0) && (
            <p className="col-span-full text-zinc-600 italic text-sm py-8">No additional community items found.</p>
        )}
      </div>
    </>
  );
}
