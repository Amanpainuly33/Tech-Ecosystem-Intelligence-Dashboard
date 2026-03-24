"use client";

import { GlassCard } from "./ui/GlassCard";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AggregatedTopic } from "@/lib/aggregation";

export function FrameworkSpotlight({ topics }: { topics: AggregatedTopic[] }) {
    const topTopic = topics[0];
    
    const spotlight = topTopic ? {
        name: topTopic.canonicalName,
        tagline: "Trending Cross-Platform",
        description: topTopic.mentions[0]?.description || "Generating significant traction across platforms right now.",
        growth: `Hot (Score: ${topTopic.score.toFixed(1)})`,
        url: topTopic.mentions[0]?.url || "#"
    } : {
        name: "Loading...",
        tagline: "",
        description: "Pulling data from GitHub, HN, and Dev.to",
        growth: "...",
        url: "#"
    };

    return (
        <GlassCard className="h-full bg-gradient-to-br from-black to-zinc-900 border-zinc-800">
            <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            
            <div className="mb-6">
                <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                    Cross-Platform Spotlight
                </span>
            </div>

            <div className="relative z-10 break-words">
                <h3 className="text-4xl font-bold text-white mb-2 line-clamp-1">{spotlight.name}</h3>
                <p className="text-lg text-zinc-400 mb-6 line-clamp-2">{spotlight.description}</p>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-sm max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {spotlight.growth}
                    </div>
                </div>

                <Link href={spotlight.url} target="_blank" 
                    className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors font-medium group text-sm md:text-base">
                    View Source <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
                </Link>
            </div>
            
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        </GlassCard>
    );
}
