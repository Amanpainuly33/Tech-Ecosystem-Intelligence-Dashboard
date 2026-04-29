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

function SectionHeading({
  label,
  dot,
}: {
  label: string;
  dot?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {dot && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: dot }}
        />
      )}
      <h2
        className="text-2xl font-bold tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </h2>
      <div
        className="flex-1 h-px"
        style={{ background: "var(--border-subtle)" }}
      />
    </div>
  );
}

function ColumnHeader({ label, dot }: { label: string; dot: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
      <h3 className="font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>
        {label}
      </h3>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p
      className="italic text-sm py-8 text-center"
      style={{ color: "var(--text-muted)" }}
    >
      {message}
    </p>
  );
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [activeFilter, setActiveFilter] = useState<EcosystemKey>("All");
  const { openPalette } = useSearch();

  const filterItems = (items: TrendingItem[]) => {
    if (activeFilter === "All") return items;
    const niceTags = ECOSYSTEM_FILTERS[activeFilter];
    return items.filter((item) => {
      const itemTags = (item.tags || []).map((t) => t.toLowerCase());
      return itemTags.some((tag) => niceTags.includes(tag));
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-14">
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="h-[380px]">
            <FrameworkSpotlight topics={filteredTopics} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LanguageHeatmap topics={filteredTopics} />
            <TopicWordCloud topics={filteredTopics} />
          </div>
        </div>
        
        <div className="md:col-span-4 hidden md:flex flex-col gap-4">
          
        </div>
      </div>

      <SectionHeading label="Community Pulse" dot="#a78bfa" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div className="flex flex-col">
          <ColumnHeader label="GitHub Trending" dot="#a78bfa" />
          {filteredRepos.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredRepos.map((repo, i) => (
                <TrendCard key={repo.id} item={repo} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState message="No trending repos for this filter." />
          )}
        </div>

        <div className="flex flex-col">
          <ColumnHeader label="Hacker News" dot="#f97316" />
          {filteredHN.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredHN.map((item, i) => (
                <TrendCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState message="No tech news for this filter." />
          )}
        </div>

        <div className="flex flex-col">
          <ColumnHeader label="Dev.to" dot="#60a5fa" />
          {filteredDevTo.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredDevTo.map((item, i) => (
                <TrendCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState message="No top posts for this filter." />
          )}
        </div>
      </div>

      {(filteredLobsters.length > 0 || filteredStack.length > 0) && (
        <>
          <SectionHeading label="More From The Community" dot="#06b6d4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {filteredLobsters.map((item, i) => (
              <TrendCard key={item.id} item={item} index={i} />
            ))}
            {filteredStack.map((item, i) => (
              <TrendCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
