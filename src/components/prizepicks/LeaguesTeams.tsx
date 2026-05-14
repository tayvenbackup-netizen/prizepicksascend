import { MOST_PICKED_TEAMS, TOP_LEAGUES } from "./data";

function LeagueIcon({ kind, logo }: { kind: "img" | "nfl" | "cod"; logo: string }) {
  if (kind === "img") {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <img src={logo} alt="" className="h-9 w-9 object-contain" />
      </div>
    );
  }
  if (kind === "nfl") {
    return (
      <div className="flex h-9 w-9 items-center justify-center text-foreground">
        <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <ellipse cx="24" cy="24" rx="20" ry="11" transform="rotate(-25 24 24)" />
          <path d="M16 22l16 4M18 19l3 1M21 17l3 1M24 15l3 1M19 27l3 1M22 29l3 1M25 31l3 1" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center text-foreground">
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round">
        <path d="M8 28l16-16 16 16" />
        <path d="M12 34l12-12 12 12" />
        <path d="M16 40l8-8 8 8" />
      </svg>
    </div>
  );
}

export function TopWinningLeagues() {
  return (
    <div className="px-4">
      <div className="flex items-center justify-between pb-2 text-[14px] text-muted-foreground">
        <span>League</span>
        <span>Lineups</span>
      </div>
      <div className="space-y-2">
        {TOP_LEAGUES.map((l) => (
          <div
            key={l.name}
            className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3"
          >
            <LeagueIcon kind={l.kind} logo={l.logo} />
            <div className="flex-1 text-[16px] font-semibold">{l.name}</div>
            <div className="text-[16px] font-bold text-success">{l.lineups}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MostPickedTeams() {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
      {MOST_PICKED_TEAMS.map((t) => (
        <div
          key={t.name}
          className="flex w-[122px] shrink-0 flex-col items-center rounded-2xl bg-surface px-3 py-4"
        >
          <div className="flex h-16 w-16 items-center justify-center">
            <img src={t.logo} alt={t.name} className="h-14 w-14 object-contain" />
          </div>
          <div className="mt-3 text-center text-[15px] font-semibold">{t.name}</div>
          <div className="mt-2 text-center text-[13px] text-muted-foreground">
            {t.league}
          </div>
        </div>
      ))}
    </div>
  );
}
