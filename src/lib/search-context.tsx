"use client";

import { TrendingItem } from "@/lib/api";
import { createContext, useContext, useState, ReactNode } from "react";

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
