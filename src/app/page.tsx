import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardClient } from "@/components/DashboardClient";
import { TrendCard } from "@/components/TrendCard";
import { getDashboardData } from "@/lib/api";
import { SearchProvider } from "@/lib/search-context";
import { CommandPalette } from "@/components/CommandPalette";

export const revalidate = 3600;

export default async function Home() {
  const data = await getDashboardData();

  return (
    <SearchProvider items={data.allItems}>
      {/* CMD+K palette available site-wide */}
      <CommandPalette />

      <main className="min-h-screen bg-black text-white p-4 md:p-8 bg-grid-pattern relative overflow-hidden">
        {/* Ambient Background */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto z-10 relative">
          <DashboardHeader />

          <DashboardClient data={data} />
        </div>
      </main>
    </SearchProvider>
  );
}
