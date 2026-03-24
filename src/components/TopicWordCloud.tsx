"use client";

import { GlassCard } from "./ui/GlassCard";
import { AggregatedTopic } from "@/lib/aggregation";

export function TopicWordCloud({ topics }: { topics: AggregatedTopic[] }) {
    const displayTopics = topics.slice(0, 20);

    return (
        <GlassCard>
            <h3 className="text-xl font-bold mb-6">Top Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
                {displayTopics.map((topic, index) => (
                    <span 
                        key={topic.canonicalName}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-sm font-medium text-zinc-300 border border-white/5 hover:border-white/20 hover:text-white transition-colors cursor-default"
                        title={`Score: ${topic.score.toFixed(1)}`}
                    >
                        {topic.canonicalName}
                    </span>
                ))}
            </div>
        </GlassCard>
    );
}
