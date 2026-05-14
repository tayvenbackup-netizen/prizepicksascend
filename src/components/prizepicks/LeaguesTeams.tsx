import { MOST_PICKED_TEAMS, TOP_LEAGUES } from "./data";

function LeagueBadge({ abbr, bg }: { abbr: string; bg: string }) {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full text-[10px] font-extrabold text-white shadow-inner"
      style={{ background: bg }}
    >
      {abbr}
    </div>
  );
}

export function TopWinningLeagues() {
  return (
    <div className="px-4">
      <div className="flex items-center justify-between pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>League</span>
        <span>Lineups</span>
      </div>
      <div className="divide-y divide-border/60">
        {TOP_LEAGUES.map((l) => (
          <div key={l.name} className="flex items-center gap-3 py-3">
            <LeagueBadge abbr={l.abbr} bg={l.bg} />
            <div className="flex-1 text-[15px] font-semibold">{l.name}</div>
            <div className="text-base font-bold">{l.lineups}</div>
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
          className="flex w-[120px] shrink-0 flex-col items-center rounded-2xl bg-surface p-3"
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
            style={{ background: t.color }}
          >
            {t.abbr}
          </div>
          <div className="mt-3 text-center text-[13px] font-semibold">{t.name}</div>
          <div className="mt-1.5 inline-flex rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-muted-foreground">
            NBA
          </div>
        </div>
      ))}
    </div>
  );
}
