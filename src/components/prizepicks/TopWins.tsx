import { TOP_WINS } from "./data";
import { PlayerAvatar } from "./Avatar";

export function TopWins() {
  return (
    <div className="space-y-3 px-4">
      {TOP_WINS.map((w, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-surface p-4 pr-3"
        >
          <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-success" />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[17px] font-bold">
                {w.type} <span className="text-success">{w.payout}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                <span className="text-foreground/90 font-semibold">
                  {w.play.split(" ")[0]}
                </span>{" "}
                {w.play.split(" ").slice(1).join(" ")}
              </div>
            </div>
            <div className="flex shrink-0 -space-x-2">
              {w.players.map((p, idx) => (
                <PlayerAvatar
                  key={idx}
                  initials={p.initials}
                  color={p.color}
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
