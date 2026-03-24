import { TrendingItem } from "./api";
import { normalizeTag, extractTagsFromText } from "./normalizer";

export interface AggregatedTopic {
  canonicalName: string;
  mentions: TrendingItem[];
  score: number;
  tags: string[];
}

const SOURCE_WEIGHTS: Record<string, number> = {
  'GitHub': 1.5,
  'HackerNews': 1.2,
  'StackOverflow': 1.0,
  'Dev.to': 0.8,
  'Lobsters': 0.8
};

export function aggregateTrends(items: TrendingItem[]): AggregatedTopic[] {
  const topicsMap = new Map<string, AggregatedTopic>();

  for (const item of items) {
    const explicitTags = (item.tags || []).map(normalizeTag);
    const implicitTags = extractTagsFromText(`${item.title} ${item.description}`);
    
    // Combine and deduplicate tags
    let allTags = Array.from(new Set([...explicitTags, ...implicitTags]));
    
    // Better fallback: skip generic titles, only use if descriptive
    if (allTags.length === 0 && item.title.length > 10) {
       const firstWord = item.title.split(/[\s/_-]+/)[0];
       if (firstWord && firstWord.length > 2) {
         allTags = [normalizeTag(firstWord)];
       }
    }

    const weight = SOURCE_WEIGHTS[item.source] || 1.0;
    
    for (const tag of allTags) {
        if (!tag || tag.length < 2) continue;
        
        const canonicalName = tag.charAt(0).toUpperCase() + tag.slice(1);

        if (!topicsMap.has(canonicalName)) {
            topicsMap.set(canonicalName, {
                canonicalName,
                mentions: [],
                score: 0,
                tags: [tag]
            });
        }
        
        const topic = topicsMap.get(canonicalName)!;
        
        if (!topic.mentions.find(m => m.id === item.id)) {
             topic.mentions.push(item);
             // Use source weight instead of flat 1 point
             topic.score += weight;
        }
    }
  }

  // Calculate final cross-platform multipliers
  for (const topic of topicsMap.values()) {
      const sources = new Set(topic.mentions.map(m => m.source));

      // 1 source = 1x, 2 sources = 1.6x, 3 sources = 2.1x, etc.
      const multiplier = 1 + (Math.log2(sources.size) * 0.8);
      topic.score = Number((topic.score * multiplier).toFixed(1));
  }

  return Array.from(topicsMap.values())
    .sort((a, b) => b.score - a.score)
    .filter(t => t.score > 0.5); // Filter out very low signal topics
}

