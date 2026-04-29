"use client";

import { motion } from "framer-motion";
import { Search, Command, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, KeyboardEvent } from "react";
import { useTheme } from "@/lib/theme-context";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle-knob">
        {theme === "dark" ? (
          <Moon className="w-3 h-3" style={{ color: "#6366f1" }} />
        ) : (
          <Sun className="w-3 h-3" style={{ color: "#f59e0b" }} />
        )}
      </span>
    </button>
  );
}

function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <div className="relative max-w-lg mx-auto mt-8 group">
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200"
        style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-default)",
        }}
        onFocus={() => {}}
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Research a project idea… e.g. 'trello clone'"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{
            color: "var(--text-primary)",
          }}
        />
        <div
          className="hidden sm:flex items-center gap-1 text-xs rounded-lg px-2 py-1 shrink-0 font-mono"
          style={{
            color: "var(--text-muted)",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-input)",
          }}
        >
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>
    </div>
  );
}

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const date = mounted
    ? new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (!mounted) return <header className="mb-10 min-h-[320px]" />;

  return (
    <header className="mb-12 text-center relative z-10">
      
      <div className="absolute top-0 right-0 flex items-center gap-3">
        <span
          className="text-xs font-medium hidden sm:block"
          style={{ color: "var(--text-muted)" }}
        >
          Theme
        </span>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "var(--accent-blue)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live Analytics
        </motion.div>

        <h1
          className="text-5xl md:text-7xl font-extrabold mb-5 tracking-tight leading-none"
          style={{ color: "var(--text-primary)" }}
        >
          Global Developer{" "}
          <span className="text-gradient">Intelligence</span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Real-time insights aggregated from GitHub, StackOverflow, Creator
          Communities, and Tech News.
        </p>

        <div
          className="mt-4 text-xs font-mono tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {date}
        </div>

        <SearchBar />
      </motion.div>
    </header>
  );
}
