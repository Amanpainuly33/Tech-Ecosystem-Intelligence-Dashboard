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
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  label,
  count,
  accent,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  accent: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <div className={`flex items-center gap-2.5 mb-1`}>
          <span className={`p-1.5 rounded-lg ${accent} bg-opacity-10`}>{icon}</span>
          <h2 className="text-lg font-bold text-white">{label}</h2>
          <span className="text-xs text-zinc-500 border border-white/10 rounded-full px-2 py-0.5">
            {count} result{count !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-sm text-zinc-500 ml-10">{description}</p>
      </div>
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-zinc-600 text-sm">
      {message}
    </div>
  );
}

function CardShell({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col h-full rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 p-4 transition-all duration-200"
    >
      {children}
      <div className="mt-auto pt-3 flex justify-end">
        <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>
    </a>
  );
}

// ─── Platform Cards ───────────────────────────────────────────────────────────

function GitHubCard({ repo }: { repo: GitHubRepo }) {
  return (
    <CardShell href={repo.url}>
      <p className="text-xs text-purple-400 font-mono mb-1 truncate">{repo.fullName}</p>
      <p className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-3">
        {repo.description}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-400 mt-auto">
        {repo.language && (
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
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
      <p className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-2">
        {article.title}
      </p>
      {article.description && (
        <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{article.description}</p>
      )}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto">
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
      <p className="text-[11px] text-orange-400 mb-1">{post.subreddit}</p>
      <p className="text-sm font-semibold text-white line-clamp-3 leading-snug mb-3">
        {post.title}
      </p>
      <div className="flex items-center gap-4 text-xs text-zinc-400 mt-auto">
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
          <HelpCircle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
        )}
        <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">
          {question.title}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto">
        <span className="inline-flex items-center gap-1">
          <ArrowUp className="w-3 h-3" /> {question.score}
        </span>
        <span
          className={`text-xs font-medium ${
            question.answerCount > 0 ? "text-emerald-400" : "text-zinc-500"
          }`}
        >
          {question.answerCount} answer{question.answerCount !== 1 ? "s" : ""}
        </span>
      </div>
    </CardShell>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface IdeaResearchResultsProps {
  results: IdeaSearchResult;
}

export function IdeaResearchResults({ results }: IdeaResearchResultsProps) {
  const { github, devto, reddit, stackoverflow } = results;

  return (
    <div className="space-y-14">
      {/* GitHub */}
      <section>
        <SectionHeader
          icon={<Github className="w-4 h-4 text-purple-400" />}
          label="Reference Code"
          count={github.length}
          accent="text-purple-400"
          description="Open-source repos to study architecture and pick your tech stack"
        />
        {github.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {github.map((repo) => <GitHubCard key={repo.id} repo={repo} />)}
          </div>
        ) : (
          <EmptySection message="No GitHub repositories found for this idea." />
        )}
      </section>

      {/* Dev.to */}
      <section>
        <SectionHeader
          icon={<BookOpen className="w-4 h-4 text-blue-400" />}
          label="Tutorials & Guides"
          count={devto.length}
          accent="text-blue-400"
          description="Step-by-step articles to help you go from idea to implementation"
        />
        {devto.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devto.map((article) => <DevToCard key={article.id} article={article} />)}
          </div>
        ) : (
          <EmptySection message="No Dev.to articles found for this idea." />
        )}
      </section>

      {/* Reddit */}
      <section>
        <SectionHeader
          icon={<MessageCircle className="w-4 h-4 text-orange-400" />}
          label="Community Discussions"
          count={reddit.length}
          accent="text-orange-400"
          description="What the developer community is saying — feature requests, opinions, comparisons"
        />
        {reddit.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reddit.map((post) => <RedditCard key={post.id} post={post} />)}
          </div>
        ) : (
          <EmptySection message="No Reddit discussions found for this idea." />
        )}
      </section>

      {/* StackOverflow */}
      <section>
        <SectionHeader
          icon={<Terminal className="w-4 h-4 text-amber-400" />}
          label="Common Blockers"
          count={stackoverflow.length}
          accent="text-amber-400"
          description="Technical problems you'll likely hit — anticipate them before you start"
        />
        {stackoverflow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stackoverflow.map((q) => <SOCard key={q.id} question={q} />)}
          </div>
        ) : (
          <EmptySection message="No StackOverflow questions found for this idea." />
        )}
      </section>
    </div>
  );
}
