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

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-background pb-28">
      <TopHeader />
      <ProfileHeader />
      <ProfileTabs />
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

      <BottomNav />
    </div>
  );
}
