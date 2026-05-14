import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopHeader } from "@/components/prizepicks/Header";
import { ProfileHeader } from "@/components/prizepicks/ProfileHeader";
import { ProfileTabs } from "@/components/prizepicks/Tabs";
import { StatsCards } from "@/components/prizepicks/StatsCards";
import { SectionTitle } from "@/components/prizepicks/SectionTitle";
import { TopWins } from "@/components/prizepicks/TopWins";
import { MostPickedPlayers, TopWinningPlayers } from "@/components/prizepicks/PlayerLists";
import { MostPickedTeams, TopWinningLeagues } from "@/components/prizepicks/LeaguesTeams";
import { BottomNav, type NavTab } from "@/components/prizepicks/BottomNav";
import { EntriesView } from "@/components/prizepicks/EntriesView";
import { ProfileProvider } from "@/components/prizepicks/ProfileContext";
import { EntriesProvider } from "@/components/prizepicks/EntriesContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [nav, setNav] = useState<NavTab>("profile");

  return (
    <ProfileProvider>
      <EntriesProvider>
      <div className="fixed inset-0 overflow-hidden bg-background">
        <div className="mx-auto flex h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-background">
          <div className="shrink-0">
            <TopHeader />
          </div>

          {nav === "profile" && (
            <>
              <div className="shrink-0">
                <ProfileHeader />
                <ProfileTabs />
              </div>
              <div className="stats-scroll flex-1 min-h-0 overflow-y-auto pb-28">
                <StatsCards />
                <SectionTitle>Top Wins</SectionTitle>
                <TopWins />
                <SectionTitle>Top winning players</SectionTitle>
                <TopWinningPlayers />
                <SectionTitle>Most picked players</SectionTitle>
                <MostPickedPlayers />
                <SectionTitle>Top winning leagues</SectionTitle>
                <TopWinningLeagues />
                <SectionTitle>Most picked teams</SectionTitle>
                <MostPickedTeams />
              </div>
            </>
          )}

          {nav === "entries" && (
            <div className="stats-scroll flex-1 min-h-0 overflow-y-auto pb-28">
              <EntriesView />
            </div>
          )}

          {nav !== "profile" && nav !== "entries" && (
            <div className="flex-1 min-h-0 flex items-center justify-center text-muted-foreground text-sm pb-28">
              Coming soon
            </div>
          )}

          <div className="shrink-0">
            <BottomNav active={nav} onChange={setNav} />
          </div>
        </div>
      </div>
      </EntriesProvider>
    </ProfileProvider>
  );
}
