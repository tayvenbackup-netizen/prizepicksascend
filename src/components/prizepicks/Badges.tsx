import demonAsset from "@/assets/demon.png.asset.json";
import goblinAsset from "@/assets/goblin.png.asset.json";
import type { PickBadge } from "./EntriesContext";

export const BADGE_URLS: Record<Exclude<PickBadge, null>, string> = {
  demon: demonAsset.url,
  goblin: goblinAsset.url,
};

/** Small icon shown next to the line/arrow. */
export function BadgeIcon({
  badge,
  size = 14,
  className = "",
}: {
  badge: PickBadge | undefined;
  size?: number;
  className?: string;
}) {
  if (!badge) return null;
  return (
    <img
      src={BADGE_URLS[badge]}
      alt={badge}
      width={size}
      height={size}
      className={`inline-block shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
}

/** 3-button selector: None / Demon / Goblin. */
export function BadgePicker({
  value,
  onChange,
  size = "sm",
}: {
  value: PickBadge | undefined;
  onChange: (b: PickBadge) => void;
  size?: "sm" | "xs";
}) {
  const v = value ?? null;
  const btn =
    size === "xs"
      ? "h-6 px-1.5 text-[10px]"
      : "h-7 px-2 text-[11px]";
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`${btn} rounded-md font-semibold ring-1 ${
          v === null
            ? "bg-white/10 text-foreground ring-white/25"
            : "text-muted-foreground ring-white/10"
        }`}
      >
        None
      </button>
      <button
        type="button"
        onClick={() => onChange("demon")}
        className={`${btn} flex items-center gap-1 rounded-md font-semibold ring-1 ${
          v === "demon"
            ? "bg-red-500/15 text-red-300 ring-red-400/40"
            : "text-muted-foreground ring-white/10"
        }`}
      >
        <BadgeIcon badge="demon" size={12} />
        Demon
      </button>
      <button
        type="button"
        onClick={() => onChange("goblin")}
        className={`${btn} flex items-center gap-1 rounded-md font-semibold ring-1 ${
          v === "goblin"
            ? "bg-green-500/15 text-green-300 ring-green-400/40"
            : "text-muted-foreground ring-white/10"
        }`}
      >
        <BadgeIcon badge="goblin" size={12} />
        Goblin
      </button>
    </div>
  );
}
