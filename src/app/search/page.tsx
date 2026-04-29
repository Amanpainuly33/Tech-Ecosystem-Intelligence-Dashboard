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

  const data = await getDashboardData();
  const allItems = [
    ...data.trendingRepos,
    ...data.hotQuestions,
    ...data.topPosts,
    ...data.techNews,
    ...data.lobstersNews,
  ];

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
      <main
        className="min-h-screen p-4 md:p-8 bg-grid-pattern relative overflow-hidden"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full"
            style={{ background: "var(--glow-purple)", filter: "blur(120px)" }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full"
            style={{ background: "var(--glow-blue)", filter: "blur(120px)" }}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-xs font-semibold tracking-wider uppercase text-yellow-400">
                Idea Researcher
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {trimmedQuery ? (
                <>
                  Results for{" "}
                  <span className="text-gradient">
                    &ldquo;{trimmedQuery}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  Research Your{" "}
                  <span className="text-gradient">Project Idea</span>
                </>
              )}
            </h1>
            {results && totalResults > 0 && (
              <p className="text-base" style={{ color: "var(--text-secondary)" }}>
                Found{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {totalResults}
                </span>{" "}
                resources across GitHub, Dev.to, Reddit &amp; StackOverflow
              </p>
            )}
          </div>

          <form action="/search" method="GET" className="mb-12">
            <div className="relative max-w-2xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                name="q"
                defaultValue={trimmedQuery}
                placeholder="e.g. trello clone, AI writing assistant, habit tracker..."
                autoFocus={!trimmedQuery}
                className="w-full pl-12 pr-32 py-4 rounded-xl text-base outline-none transition-all"
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
                style={{ background: "var(--accent-blue)" }}
              >
                Research
              </button>
            </div>
          </form>

          {!results && (
            <div className="text-center py-20">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                <Lightbulb className="w-8 h-8" style={{ color: "var(--accent-blue)" }} />
              </div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                What do you want to build?
              </h2>
              <p
                className="text-sm max-w-md mx-auto mb-8"
                style={{ color: "var(--text-muted)" }}
              >
                Type a project idea above and we&apos;ll search GitHub, Dev.to,
                Reddit, and StackOverflow to give you reference code, tutorials,
                discussions, and common gotchas — all in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLE_IDEAS.map((idea) => (
                  <a
                    key={idea}
                    href={`/search?q=${encodeURIComponent(idea)}`}
                    className="px-3 py-1.5 rounded-full text-sm transition-all hover:opacity-80"
                    style={{
                      background: "var(--bg-input)",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {idea}
                  </a>
                ))}
              </div>
            </div>
          )}

          {results && totalResults === 0 && (
            <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">
                No results found for &ldquo;
                <span style={{ color: "var(--text-primary)" }}>{trimmedQuery}</span>
                &rdquo;
              </p>
              <p className="text-sm mt-2">
                Try a broader phrase, like the type of app instead of its name.
              </p>
            </div>
          )}

          {results && totalResults > 0 && (
            <IdeaResearchResults results={results} />
          )}
        </div>

        <footer
          className="max-w-6xl mx-auto mt-12 pt-6 text-center text-xs font-mono"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          Developer Intelligence Dashboard · Idea Researcher · Built with Next.js
        </footer>
      </main>
    </SearchProvider>
  );
}
