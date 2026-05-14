import { MOST_PICKED_PLAYERS, TOP_WINNING_PLAYERS } from "./data";
import { PlayerAvatar } from "./Avatar";

export function TopWinningPlayers() {
  return (
    <div className="px-4">
      <div className="flex items-center justify-between pb-2 text-[14px] text-muted-foreground">
        <span>Player</span>
        <span>Wins</span>
      </div>
      <div className="space-y-2">
        {TOP_WINNING_PLAYERS.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-2.5"
          >
            <PlayerAvatar src={p.img} alt={p.name} size={44} ring="muted" />
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <div className="text-[16px] font-semibold truncate">{p.name}</div>
              <span className="text-[13px] font-medium text-muted-foreground">
                {p.league}
              </span>
            </div>
            <div className="text-[16px] font-bold text-success">{p.wins}</div>
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
          className="flex w-[122px] shrink-0 flex-col items-center rounded-2xl bg-surface px-3 py-4"
        >
          <PlayerAvatar src={p.img} alt={p.name} size={64} ring="muted" />
          <div className="mt-3 line-clamp-2 min-h-[40px] text-center text-[15px] font-semibold leading-tight">
            {p.name}
          </div>
          <div className="mt-2 text-center text-[13px] text-muted-foreground">
            {p.league}
          </div>
        </div>
      ))}
    </div>
  );
}
