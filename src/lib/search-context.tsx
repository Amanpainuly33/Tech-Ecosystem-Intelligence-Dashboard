"use client";

import { TrendingItem } from "@/lib/api";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SearchContextValue {
  allItems: TrendingItem[];
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  allItems: [],
  isOpen: false,
  openPalette: () => {},
  closePalette: () => {},
});

export function SearchProvider({
  items,
  children,
}: {
  items: TrendingItem[];
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        allItems: items,
        isOpen,
        openPalette: () => setIsOpen(true),
        closePalette: () => setIsOpen(false),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
