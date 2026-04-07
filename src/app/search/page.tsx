import { searchAllPlatforms } from "@/lib/api";
import { getDashboardData } from "@/lib/api";
import { SearchProvider } from "@/lib/search-context";
import { CommandPalette } from "@/components/CommandPalette";
import { IdeaResearchResults } from "@/components/IdeaResearchResults";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Search } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const EXAMPLE_IDEAS = [
  "trello clone",
  "AI PDF summarizer",
  "habit tracker app",
  "realtime chat app",
  "expense tracker",
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = "" } = await searchParams;
  const trimmedQuery = query.trim();

  // Fetch dashboard items for the CommandPalette overlay
  const data = await getDashboardData();
  const allItems = [
    ...data.trendingRepos,
    ...data.hotQuestions,
    ...data.topPosts,
    ...data.techNews,
    ...data.lobstersNews,
  ];

  // Live-search all platforms if query is present
  const results =
    trimmedQuery.length >= 2 ? await searchAllPlatforms(trimmedQuery) : null;

  const totalResults = results
    ? results.github.length +
      results.devto.length +
      results.reddit.length +
      results.stackoverflow.length
    : 0;

  return (
    <SearchProvider items={allItems}>
      <CommandPalette />
      <main className="min-h-screen bg-black text-white p-4 md:p-8 bg-grid-pattern">
        {/* Ambient Background */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400 tracking-wider uppercase">
                Idea Researcher
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {trimmedQuery ? (
                <>
                  Results for{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    &ldquo;{trimmedQuery}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  Research Your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Project Idea
                  </span>
                </>
              )}
            </h1>
            {results && totalResults > 0 && (
              <p className="text-zinc-400 text-base">
                Found{" "}
                <span className="text-white font-semibold">{totalResults}</span>{" "}
                resources across GitHub, Dev.to, Reddit &amp; StackOverflow
              </p>
            )}
          </div>

          {/* Search Input */}
          <form action="/search" method="GET" className="mb-12">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
              <input
                name="q"
                defaultValue={trimmedQuery}
                placeholder="e.g. trello clone, AI writing assistant, habit tracker..."
                autoFocus={!trimmedQuery}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-white placeholder-zinc-500 text-base transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Research
              </button>
            </div>
          </form>

          {/* Empty / No-query State */}
          {!results && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                What do you want to build?
              </h2>
              <p className="text-zinc-500 text-sm max-w-md mx-auto mb-8">
                Type a project idea above and we&apos;ll search GitHub, Dev.to, Reddit, and
                StackOverflow to give you reference code, tutorials, discussions, and
                common gotchas — all in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLE_IDEAS.map((idea) => (
                  <a
                    key={idea}
                    href={`/search?q=${encodeURIComponent(idea)}`}
                    className="px-3 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    {idea}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {results && totalResults === 0 && (
            <div className="text-center py-20 text-zinc-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">
                No results found for &ldquo;
                <span className="text-white">{trimmedQuery}</span>&rdquo;
              </p>
              <p className="text-sm mt-2">
                Try a broader phrase, like the type of app instead of its name.
              </p>
            </div>
          )}

          {results && totalResults > 0 && <IdeaResearchResults results={results} />}
        </div>
      </main>
    </SearchProvider>
  );
}
