"use client";

import { motion } from "framer-motion";
import { Search, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, KeyboardEvent } from "react";

function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <div className="relative max-w-md mx-auto mt-8 group cursor-text">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-blue-500/40 transition-all">
        <Search className="w-4 h-4 text-zinc-500" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Research a project idea... (e.g. 'trello clone')"
          className="flex-1 bg-transparent text-sm text-zinc-400 placeholder-zinc-600 outline-none"
        />
        <div className="flex items-center gap-1 text-xs text-zinc-600 border border-white/10 rounded px-1.5 py-0.5 shrink-0">
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const date = mounted ? new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";

  if (!mounted) return <header className="mb-10 min-h-[300px]" />;

  return (
    <header className="mb-10 text-center relative z-10">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
          <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
            Global Developer Intelligence
          </span>
        </div> */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Global Developer <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Intelligence
          </span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Real-time insights aggregated from GitHub, StackOverflow, Creator
          Communities, and Tech News.
        </p>
        <div className="mt-4 text-sm text-zinc-500 font-mono">
          LIVE ANALYTICS • {date}
        </div>

        <SearchBar />
      </motion.div>
    </header>
  );
}
