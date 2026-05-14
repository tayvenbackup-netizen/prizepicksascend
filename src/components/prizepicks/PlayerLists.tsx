import { MOST_PICKED_PLAYERS, TOP_WINNING_PLAYERS } from "./data";
import { PlayerAvatar } from "./Avatar";

export function TopWinningPlayers() {
  return (
    <div className="px-4">
      <div className="flex items-center justify-between pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>Player</span>
        <span>Wins</span>
      </div>
      <div className="divide-y divide-border/60">
        {TOP_WINNING_PLAYERS.map((p) => (
          <div key={p.name} className="flex items-center gap-3 py-3">
            <PlayerAvatar initials={p.initials} color={p.color} size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold truncate">{p.name}</div>
              <div className="mt-0.5 inline-flex items-center rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-muted-foreground">
                {p.league}
              </div>
            </div>
            <div className="text-base font-bold">{p.wins}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MostPickedPlayers() {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
      {MOST_PICKED_PLAYERS.map((p) => (
        <div
          key={p.name}
          className="flex w-[120px] shrink-0 flex-col items-center rounded-2xl bg-surface p-3"
        >
          <PlayerAvatar initials={p.initials} color={p.color} size={56} />
          <div className="mt-3 line-clamp-2 text-center text-[13px] font-semibold leading-tight">
            {p.name}
          </div>
          <div className="mt-1.5 inline-flex rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-muted-foreground">
            {p.league}
          </div>
        </div>
      ))}
    </div>
  );
}
