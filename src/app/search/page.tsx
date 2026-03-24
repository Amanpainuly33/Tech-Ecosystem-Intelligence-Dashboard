import { getDashboardData, TrendingItem } from "@/lib/api";
import { SearchProvider } from "@/lib/search-context";
import { CommandPalette } from "@/components/CommandPalette";
import { SearchResults } from "@/components/SearchResults";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = "" } = await searchParams;
  const data = await getDashboardData();

  const allItems: TrendingItem[] = [
    ...data.trendingRepos,
    ...data.hotQuestions,
    ...data.topPosts,
    ...data.techNews,
    ...data.lobstersNews,
  ];

  const results = query.trim().length >= 2
    ? allItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <SearchProvider items={allItems}>
      <CommandPalette />
      <main className="min-h-screen bg-black text-white p-4 md:p-8 bg-grid-pattern">
        {/* Ambient Background */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <h1 className="text-4xl font-bold">
              {query ? (
                <>
                  Results for{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    &ldquo;{query}&rdquo;
                  </span>
                </>
              ) : (
                "Search"
              )}
            </h1>
            {results.length > 0 && (
              <p className="text-zinc-400 mt-2">
                Found <span className="text-white font-semibold">{results.length}</span> results across all platforms
              </p>
            )}
          </div>

          <SearchResults query={query} results={results} />
        </div>
      </main>
    </SearchProvider>
  );
}
