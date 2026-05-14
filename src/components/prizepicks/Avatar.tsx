import { CheckBadge, XBadge } from "./Icons";

type Props = {
  src?: string;
  alt?: string;
  size?: number;
  ring?: "success" | "danger" | "muted" | "none";
  badge?: "check" | "x" | "none";
  bg?: string;
};

export function PlayerAvatar({
  src,
  alt = "",
  size = 44,
  ring = "none",
  badge = "none",
  bg = "#2a2540",
}: Props) {
  const ringColor =
    ring === "success"
      ? "var(--success)"
      : ring === "danger"
      ? "var(--destructive)"
      : ring === "muted"
      ? "rgba(255,255,255,0.18)"
      : "transparent";

  const ringWidth = ring === "none" ? 0 : 2;
  const inner = size - ringWidth * 2;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <div
        className="flex h-full w-full items-center justify-center rounded-full"
        style={{
          background: ringColor,
          padding: ringWidth,
          boxShadow:
            ring === "success"
              ? "0 0 10px -2px color-mix(in oklab, var(--success) 55%, transparent)"
              : ring === "danger"
              ? "0 0 10px -2px color-mix(in oklab, var(--destructive) 55%, transparent)"
              : "none",
        }}
      >
        <div
          className="flex items-center justify-center overflow-hidden rounded-full"
          style={{ width: inner, height: inner, background: bg }}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="h-full w-full object-cover object-top"
              draggable={false}
            />
          ) : null}
        </div>
      </div>

      {badge !== "none" && (
        <div
          className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-background"
          style={{ padding: 1.5 }}
        >
          {badge === "check" ? (
            <CheckBadge
              className="text-success"
              style={{ width: Math.max(14, size * 0.46), height: Math.max(14, size * 0.46) }}
            />
          ) : (
            <XBadge
              className="text-destructive"
              style={{ width: Math.max(14, size * 0.46), height: Math.max(14, size * 0.46) }}
            />
          )}
        </div>
      )}
    </div>
  );
}
