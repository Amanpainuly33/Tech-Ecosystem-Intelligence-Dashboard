import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardClient } from "@/components/DashboardClient";
import { getDashboardData } from "@/lib/api";
import { SearchProvider } from "@/lib/search-context";
import { CommandPalette } from "@/components/CommandPalette";

export const revalidate = 3600;

export default async function Home() {
  const data = await getDashboardData();

  return (
    <SearchProvider items={data.allItems}>
      <CommandPalette />

      <main
        className="min-h-screen p-4 md:p-8 bg-grid-pattern relative overflow-hidden"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div
            className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full"
            style={{
              background: "var(--glow-purple)",
              filter: "blur(120px)",
              animation: "pulse 6s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full"
            style={{
              background: "var(--glow-blue)",
              filter: "blur(120px)",
              animation: "pulse 8s ease-in-out infinite 2s",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto z-10 relative">
          <DashboardHeader />
          <DashboardClient data={data} />
        </div>

        <footer
          className="max-w-7xl mx-auto mt-12 pt-6 text-center text-xs font-mono"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          Developer Intelligence Dashboard · Data refreshes every hour · Built
          with Next.js
        </footer>
      </main>
    </SearchProvider>
  );
}
