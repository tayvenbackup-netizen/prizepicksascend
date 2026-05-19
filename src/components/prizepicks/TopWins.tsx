import { PlayerAvatar } from "./Avatar";
import { useProfile } from "./ProfileContext";

export function TopWins() {
  const { topWins } = useProfile();
  return (
    <div className="space-y-3 px-4">
      {topWins.map((w, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-surface py-4 pl-5 pr-4"
        >
          <span className="absolute left-2 top-[14px] bottom-[14px] w-[3px] rounded-full bg-success" />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[15px] font-bold">
                {w.pickCount}-Pick win <span className="text-success">{w.payout}</span>
              </div>
              <div className="mt-1 text-[13px] text-muted-foreground">
                <span className="font-bold text-foreground">{w.cost}</span>{" "}
                {w.play}
              </div>
            </div>
            <div className="flex shrink-0 -space-x-2">
              {w.players.map((p, idx) => (
                <PlayerAvatar
                  key={idx}
                  src={p.photo || ""}
                  alt={p.name}
                  size={36}
                  ring={p.hit ? "success" : "danger"}
                  badge={p.hit ? "check" : "x"}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
