import { useProfile } from "./ProfileContext";
import { Jersey } from "./Jersey";

function LeagueBadge({ name, badge }: { name: string; badge: string | null }) {
  if (badge) {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <img src={badge} alt={name} className="h-9 w-9 object-contain" />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-foreground">
      {name.slice(0, 3).toUpperCase()}
    </div>
  );
}

export function TopWinningLeagues() {
  const { winLeagues } = useProfile();
  return (
    <div className="px-4">
      <div className="flex items-center justify-between pb-2 text-[14px] text-muted-foreground">
        <span>League</span>
        <span>Lineups</span>
      </div>
      <div className="space-y-2">
        {winLeagues.map((l, i) => (
          <div
            key={`${l.name}-${i}`}
            className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3"
          >
            <LeagueBadge name={l.name} badge={l.badge} />
            <div className="flex-1 text-[16px] font-semibold">{l.name}</div>
            <div className="text-[16px] font-bold text-success">{l.lineups}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MostPickedTeams() {
  const { pickTeams } = useProfile();
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
      {pickTeams.map((t, i) => (
        <div
          key={`${t.name}-${i}`}
          className="flex w-[122px] shrink-0 flex-col items-center rounded-2xl bg-surface px-3 py-4"
        >
          <div className="flex h-16 w-16 items-center justify-center">
            {t.badge ? (
              <img src={t.badge} alt={t.name} className="h-14 w-14 object-contain" />
            ) : (
              <Jersey team={t.name} size={56} />
            )}
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
