import { useProfile } from "./ProfileContext";
import { PlayerAvatar } from "./Avatar";
import { Jersey } from "./Jersey";

export function TopWinningPlayers() {
  const { winPlayers } = useProfile();
  return (
    <div className="px-4">
      <div className="flex items-center justify-between pb-2 text-[14px] text-muted-foreground">
        <span>Player</span>
        <span>Wins</span>
      </div>
      <div className="space-y-2">
        {winPlayers.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-2.5"
          >
            {p.photo ? (
              <PlayerAvatar src={p.photo} alt={p.name} size={44} ring="muted" />
            ) : (
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <Jersey team={p.team || p.league} size={36} />
              </div>
            )}
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
  const { pickPlayers } = useProfile();
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
      {pickPlayers.map((p, i) => (
        <div
          key={`${p.name}-${i}`}
          className="flex w-[122px] shrink-0 flex-col items-center rounded-2xl bg-surface px-3 py-4"
        >
          {p.photo ? (
            <PlayerAvatar src={p.photo} alt={p.name} size={64} ring="muted" />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <Jersey team={p.team || p.league} size={52} />
            </div>
          )}
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
