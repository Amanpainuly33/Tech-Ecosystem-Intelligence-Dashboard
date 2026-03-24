"use client";

import { GlassCard } from "./ui/GlassCard";
import { motion } from "framer-motion";
import { AggregatedTopic } from "@/lib/aggregation";

export function LanguageHeatmap({ topics }: { topics: AggregatedTopic[] }) {
    const top5 = topics.slice(0, 5);
    const colors = ["bg-blue-500", "bg-yellow-500", "bg-orange-600", "bg-cyan-500", "bg-purple-500"];

    return (
        <GlassCard className="h-full">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                Trending Technologies
            </h3>
            
            <div className="space-y-4">
                {top5.map((topic, index) => {
                    // Create visual 'share' based on score relative to top score
                    const relativeShare = top5[0] ? (topic.score / top5[0].score) * 100 : 0;
                    return (
                        <motion.div 
                            key={topic.canonicalName}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: index * 0.1, duration: 1 }}
                        >
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-zinc-300">{topic.canonicalName}</span>
                                <span className="text-green-400">
                                    {topic.score.toFixed(1)} pts
                                </span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.max(10, relativeShare)}%` }}
                                    transition={{ delay: index * 0.1, duration: 1, ease: "easeOut" }}
                                    className={`h-full ${colors[index % colors.length]} opacity-80`}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
