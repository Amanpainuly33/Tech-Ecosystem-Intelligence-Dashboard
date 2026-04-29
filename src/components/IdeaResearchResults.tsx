"use client";

import {
  GitHubRepo,
  DevToArticle,
  RedditPost,
  SOQuestion,
  IdeaSearchResult,
} from "@/lib/api";
import {
  Github,
  BookOpen,
  MessageCircle,
  Terminal,
  Star,
  GitFork,
  AlertCircle,
  Heart,
  ArrowUp,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function SectionHeader({
  icon,
  label,
  count,
  accentColor,
  accentBg,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  accentColor: string;
  accentBg: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <span
            className="p-1.5 rounded-lg"
            style={{ background: accentBg, color: accentColor }}
          >
            {icon}
          </span>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </h2>
          <span
            className="text-xs rounded-full px-2.5 py-0.5 font-mono"
            style={{
              color: "var(--text-muted)",
              border: "1px solid var(--border-default)",
              background: "var(--bg-input)",
            }}
          >
            {count} result{count !== 1 ? "s" : ""}
          </span>
        </div>
        <p
          className="text-sm ml-10"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl p-8 text-center text-sm"
      style={{
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-input)",
        color: "var(--text-muted)",
      }}
    >
      {message}
    </div>
  );
}

function CardShell({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col h-full rounded-xl p-4 transition-all duration-200"
      style={{
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "var(--bg-card-hover)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--border-default)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--border-subtle)";
      }}
    >
      {children}
      <div className="mt-auto pt-3 flex justify-end">
        <ExternalLink
          className="w-3.5 h-3.5 transition-colors"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    </a>
  );
}

function GitHubCard({
  repo,
  isSelected,
  onToggle,
}: {
  repo: GitHubRepo;
  isSelected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <CardShell href={repo.url}>
      {onToggle && (
        <div
          className="absolute top-4 right-4 z-10 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
        >
          <div
            className="w-5 h-5 rounded border flex items-center justify-center transition-colors"
            style={
              isSelected
                ? { background: "var(--accent-purple)", borderColor: "var(--accent-purple)" }
                : {
                    background: "var(--bg-input)",
                    borderColor: "var(--border-default)",
                  }
            }
          >
            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>
      )}
      <p
        className="text-xs font-mono mb-1 truncate pr-8"
        style={{ color: "var(--accent-purple)" }}
      >
        {repo.fullName}
      </p>
      <p
        className="text-sm font-semibold line-clamp-2 leading-snug mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {repo.description}
      </p>
      <div
        className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs mt-auto"
        style={{ color: "var(--text-secondary)" }}
      >
        {repo.language && (
          <span className="inline-flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--accent-purple)" }}
            />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400" />
          {repo.stars.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="w-3 h-3" />
          {repo.forks.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-rose-400" />
          {repo.openIssues} issues
        </span>
      </div>
    </CardShell>
  );
}

function DevToCard({ article }: { article: DevToArticle }) {
  return (
    <CardShell href={article.url}>
      <p
        className="text-sm font-semibold line-clamp-2 leading-snug mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {article.title}
      </p>
      {article.description && (
        <p
          className="text-xs line-clamp-2 mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          {article.description}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded-md font-mono"
            style={{
              background: "rgba(99,102,241,0.1)",
              color: "var(--accent-blue)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
      <div
        className="flex items-center gap-4 text-xs mt-auto"
        style={{ color: "var(--text-muted)" }}
      >
        <span>by {article.author}</span>
        {article.date && <span>{article.date}</span>}
        <span className="ml-auto flex items-center gap-1">
          <Heart className="w-3 h-3 text-rose-400" />
          {article.reactions}
        </span>
      </div>
    </CardShell>
  );
}

function RedditCard({ post }: { post: RedditPost }) {
  return (
    <CardShell href={post.permalink}>
      <p
        className="text-[11px] mb-1 font-mono"
        style={{ color: "var(--accent-orange)" }}
      >
        {post.subreddit}
      </p>
      <p
        className="text-sm font-semibold line-clamp-3 leading-snug mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {post.title}
      </p>
      <div
        className="flex items-center gap-4 text-xs mt-auto"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="inline-flex items-center gap-1">
          <ArrowUp className="w-3 h-3 text-orange-400" />
          {post.score.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {post.comments.toLocaleString()} comments
        </span>
      </div>
    </CardShell>
  );
}

function SOCard({ question }: { question: SOQuestion }) {
  return (
    <CardShell href={question.url}>
      <div className="flex items-start gap-2 mb-2">
        {question.isAnswered ? (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <HelpCircle
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: "var(--text-muted)" }}
          />
        )}
        <p
          className="text-sm font-semibold line-clamp-2 leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {question.title}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded-md font-mono"
            style={{
              background: "rgba(245,158,11,0.1)",
              color: "var(--accent-amber)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div
        className="flex items-center gap-4 text-xs mt-auto"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="inline-flex items-center gap-1">
          <ArrowUp className="w-3 h-3" /> {question.score}
        </span>
        <span
          className="text-xs font-medium"
          style={{
            color:
              question.answerCount > 0
                ? "var(--accent-green)"
                : "var(--text-muted)",
          }}
        >
          {question.answerCount} answer{question.answerCount !== 1 ? "s" : ""}
        </span>
      </div>
    </CardShell>
  );
}

interface IdeaResearchResultsProps {
  results: IdeaSearchResult;
}

export function IdeaResearchResults({ results }: IdeaResearchResultsProps) {
  const { github, devto, reddit, stackoverflow } = results;

  const [selectedRepos, setSelectedRepos] = useState<GitHubRepo[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const toggleRepo = (repo: GitHubRepo) => {
    setSelectedRepos((prev) =>
      prev.some((r) => r.id === repo.id)
        ? prev.filter((r) => r.id !== repo.id)
        : [...prev, repo]
    );
  };

  const handleCompare = async () => {
    if (selectedRepos.length < 2) return;
    setIsComparing(true);
    setComparisonResult(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos: selectedRepos }),
      });
      const data = await res.json();
      if (data.markdown) {
        setComparisonResult(data.markdown);
      } else {
        setComparisonResult(
          "Failed to generate comparison. " + (data.error || "")
        );
      }
    } catch {
      setComparisonResult("An error occurred during comparison.");
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-14">
      
      <section>
        <SectionHeader
          icon={<Github className="w-4 h-4" />}
          label="Reference Code"
          count={github.length}
          accentColor="var(--accent-purple)"
          accentBg="rgba(139,92,246,0.12)"
          description="Open-source repos to study architecture and pick your tech stack"
        />
        {github.length > 0 ? (
          <>
            {selectedRepos.length >= 2 && (
              <div
                className="mb-6 p-4 rounded-xl flex items-center justify-between gap-4"
                style={{
                  border: "1px solid rgba(139,92,246,0.3)",
                  background: "rgba(139,92,246,0.08)",
                }}
              >
                <div>
                  <h3
                    className="font-semibold mb-1 flex items-center gap-2 text-sm"
                    style={{ color: "var(--accent-purple)" }}
                  >
                    <Sparkles className="w-4 h-4" /> Compare Selected
                    Repositories
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Analyze features, similarities, and differences.
                  </p>
                </div>
                <button
                  onClick={handleCompare}
                  disabled={isComparing}
                  className="px-4 py-2 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-opacity disabled:opacity-50 shrink-0"
                  style={{ background: "var(--accent-purple)" }}
                >
                  {isComparing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isComparing ? "Analyzing…" : "Compare Features"}
                </button>
              </div>
            )}

            {(comparisonResult || isComparing) && (
              <div
                className="mb-8 rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: "1px solid var(--border-default)" }}
              >
                {isComparing ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 gap-4"
                    style={{ color: "var(--accent-purple)" }}
                  >
                    <Loader2 className="w-10 h-10 animate-spin opacity-80" />
                    <div className="text-center">
                      <p
                        className="text-base font-medium mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Analyzing Architecture
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Cross-referencing READMEs...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ children }) => (
                          <table className="w-full text-left border-collapse min-w-[600px]">
                            {children}
                          </table>
                        ),
                        thead: ({ children }) => (
                          <thead
                            className="uppercase tracking-wider text-[10px] font-bold"
                            style={{
                              background: "var(--bg-input)",
                              borderBottom: "1px solid var(--border-default)",
                              color: "var(--accent-purple)",
                            }}
                          >
                            {children}
                          </thead>
                        ),
                        tbody: ({ children }) => (
                          <tbody
                            style={{
                              borderColor: "var(--border-subtle)",
                            }}
                            className="divide-y"
                          >
                            {children}
                          </tbody>
                        ),
                        th: ({ children }) => (
                          <th className="px-6 py-4 font-semibold">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td
                            className="px-6 py-4 text-xs leading-relaxed align-top"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {children}
                          </td>
                        ),
                        strong: ({ children }) => (
                          <strong
                            className="font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {children}
                          </strong>
                        ),
                      }}
                    >
                      {comparisonResult || ""}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {github.map((repo) => (
                <GitHubCard
                  key={repo.id}
                  repo={repo}
                  isSelected={selectedRepos.some((r) => r.id === repo.id)}
                  onToggle={() => toggleRepo(repo)}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptySection message="Couldn't find any repos for this idea." />
        )}
      </section>

      <section>
        <SectionHeader
          icon={<BookOpen className="w-4 h-4" />}
          label="Tutorials & Guides"
          count={devto.length}
          accentColor="var(--accent-blue)"
          accentBg="rgba(99,102,241,0.12)"
          description="Step-by-step articles to help you go from idea to implementation"
        />
        {devto.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devto.map((article) => (
              <DevToCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptySection message="Couldn't find any articles for this." />
        )}
      </section>

      <section>
        <SectionHeader
          icon={<MessageCircle className="w-4 h-4" />}
          label="Community Discussions"
          count={reddit.length}
          accentColor="var(--accent-orange)"
          accentBg="rgba(249,115,22,0.12)"
          description="What the developer community is saying — opinions, comparisons, gotchas"
        />
        {reddit.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reddit.map((post) => (
              <RedditCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptySection message="No Reddit threads found." />
        )}
      </section>

      <section>
        <SectionHeader
          icon={<Terminal className="w-4 h-4" />}
          label="Common Blockers"
          count={stackoverflow.length}
          accentColor="var(--accent-amber)"
          accentBg="rgba(245,158,11,0.12)"
          description="Technical problems you'll likely hit — anticipate them before you start"
        />
        {stackoverflow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stackoverflow.map((q) => (
              <SOCard key={q.id} question={q} />
            ))}
          </div>
        ) : (
          <EmptySection message="No questions found." />
        )}
      </section>
    </div>
  );
}
