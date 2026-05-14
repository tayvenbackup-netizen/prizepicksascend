import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/prizepicks/Header";
import { ProfileHeader } from "@/components/prizepicks/ProfileHeader";
import { ProfileTabs } from "@/components/prizepicks/Tabs";
import { StatsCards } from "@/components/prizepicks/StatsCards";
import { SectionTitle } from "@/components/prizepicks/SectionTitle";
import { TopWins } from "@/components/prizepicks/TopWins";
import { MostPickedPlayers, TopWinningPlayers } from "@/components/prizepicks/PlayerLists";
import { MostPickedTeams, TopWinningLeagues } from "@/components/prizepicks/LeaguesTeams";
import { BottomNav } from "@/components/prizepicks/BottomNav";
import { ProfileProvider } from "@/components/prizepicks/ProfileContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <ProfileProvider>
      <div className="fixed inset-0 overflow-hidden bg-background">
        <div className="mx-auto flex h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-background">
          <div className="shrink-0">
            <TopHeader />
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

          <div className="shrink-0">
            <BottomNav />
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
