import { cache } from 'react';
import { aggregateTrends, AggregatedTopic } from './aggregation';

export interface TrendingItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: 'GitHub' | 'StackOverflow' | 'Dev.to' | 'HackerNews' | 'Lobsters';
  meta?: string; // e.g., "1.2k stars", "50 comments"
  tags?: string[];
  author?: string;
  date?: string;
}

export interface DashboardData {
  trendingRepos: TrendingItem[];
  hotQuestions: TrendingItem[];
  topPosts: TrendingItem[];
  techNews: TrendingItem[];
  lobstersNews: TrendingItem[];
  allItems: TrendingItem[];
  aggregatedTopics: AggregatedTopic[];
}

import * as cheerio from 'cheerio';

// GitHub Trending Scraper (Official Page)
export const getGitHubTrends = cache(async (): Promise<TrendingItem[]> => {
  try {
    const res = await fetch('https://github.com/trending?since=weekly', {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch GitHub trends page');
    const html = await res.text();
    const $ = cheerio.load(html);
    const trends: TrendingItem[] = [];

    $('.Box-row').each((_, element) => {
      if (trends.length >= 5) return;

      const titleElement = $(element).find('h2 a');
      const relativeUrl = titleElement.attr('href');
      const author = relativeUrl?.split('/')[1] || '';
      const name = relativeUrl?.split('/')[2] || '';
      const description = $(element).find('p').text().trim();
      
      // Get stars today/this week
      const metaText = $(element).find('.f6.color-fg-muted.mt-2').text();
      const starsMatch = metaText.match(/(\d+,?\d*) stars today/) || metaText.match(/(\d+,?\d*) stars this week/);
      const starsGained = starsMatch ? `+${starsMatch[1]} stars` : 'Trending';
      
      // Language
      const language = $(element).find('[itemprop="programmingLanguage"]').text().trim();

      if (titleElement.length) {
        trends.push({
            id: relativeUrl || name,
            title: `${author}/${name}`,
            description: description || 'No description available',
            url: `https://github.com${relativeUrl}`,
            source: 'GitHub',
            meta: starsGained,
            tags: language ? [language] : [],
            author: author,
        });
      }
    });

    return trends;
  } catch (error) {
    console.error('GitHub Trending Scraper Error:', error);
    return [];
  }
});

// StackExchange API
// Docs: https://api.stackexchange.com/docs/questions
export const getStackOverflowTrends = cache(async (): Promise<TrendingItem[]> => {
  try {
    const res = await fetch('https://api.stackexchange.com/2.3/questions?order=desc&sort=hot&site=stackoverflow&pagesize=5', {
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error('Failed to fetch StackOverflow trends');
    const data = await res.json();

    return data.items.map((item: any) => ({
      id: String(item.question_id),
      title: item.title,
      description: `Score: ${item.score} | Answers: ${item.answer_count}`,
      url: item.link,
      source: 'StackOverflow',
      meta: `${item.view_count} views`,
      tags: item.tags.slice(0, 3),
      author: item.owner.display_name,
      date: new Date(item.creation_date * 1000).toLocaleDateString(),
    }));
  } catch (error) {
    console.error('StackOverflow API Error:', error);
    return [];
  }
});

// Dev.to API
// Docs: https://developers.forem.com/api/v1#tag/articles/operation/getArticles
export const getDevToTrends = cache(async (): Promise<TrendingItem[]> => {
  try {
    const res = await fetch('https://dev.to/api/articles?top=7&per_page=5', {
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error('Failed to fetch Dev.to trends');
    const data = await res.json();

    return data.map((item: any) => ({
      id: String(item.id),
      title: item.title,
      description: item.description,
      url: item.url,
      source: 'Dev.to',
      meta: `♥ ${item.positive_reactions_count}`,
      tags: item.tag_list,
      author: item.user.name,
      date: item.readable_publish_date,
    }));
  } catch (error) {
    console.error('Dev.to API Error:', error);
    return [];
  }
});

// Hacker News API
// Docs: https://github.com/HackerNews/API
export const getHackerNewsTrends = cache(async (): Promise<TrendingItem[]> => {
  try {
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty', {
      next: { revalidate: 3600 }
    });
    
    if (!topStoriesRes.ok) throw new Error('Failed to fetch HN IDs');
    const ids = await topStoriesRes.json();
    const top5Ids = ids.slice(0, 5);

    const stories = await Promise.all(top5Ids.map(async (id: number) => {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`, {
        next: { revalidate: 3600 }
      });
      return storyRes.json();
    }));

    return stories.map((item: any) => ({
      id: String(item.id),
      title: item.title,
      description: `By ${item.by}`,
      url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
      source: 'HackerNews',
      meta: `${item.score} points`,
      tags: [],
      date: new Date(item.time * 1000).toLocaleDateString(),
    }));
  } catch (error) {
    console.error('HackerNews API Error:', error);
    return [];
  }
});

// Lobsters API
// Docs: https://lobste.rs/about
export const getLobstersTrends = cache(async (): Promise<TrendingItem[]> => {
  try {
    const res = await fetch('https://lobste.rs/hottest.json', {
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error('Failed to fetch Lobsters trends');
    const data = await res.json();

    return data.slice(0, 5).map((item: any) => ({
      id: item.short_id,
      title: item.title,
      description: `u/${item.submitter_user.username} • ${item.comment_count} comments`,
      url: item.url,
      source: 'Lobsters',
      meta: `↑ ${item.score}`,
      tags: item.tags,
      date: new Date(item.created_at).toLocaleDateString(),
    }));
  } catch (error) {
    console.error('Lobsters API Error:', error);
    return [];
  }
});

export const getDashboardData = cache(async (): Promise<DashboardData> => {
    try {
        // Parallel data fetching
        const [trendingRepos, hotQuestions, topPosts, techNews, lobstersNews] = await Promise.all([
            getGitHubTrends(),
            getStackOverflowTrends(),
            getDevToTrends(),
            getHackerNewsTrends(),
            getLobstersTrends()
        ]);

        const allItems = [...trendingRepos, ...hotQuestions, ...topPosts, ...techNews, ...lobstersNews];
        const aggregatedTopics = aggregateTrends(allItems);

        return {
            trendingRepos,
            hotQuestions,
            topPosts,
            techNews,
            lobstersNews,
            allItems,
            aggregatedTopics
        }
    } catch (error) {
        console.error('getDashboardData Critical Error:', error);
        return {
            trendingRepos: [],
            hotQuestions: [],
            topPosts: [],
            techNews: [],
            lobstersNews: [],
            allItems: [],
            aggregatedTopics: []
        };
    }
});
