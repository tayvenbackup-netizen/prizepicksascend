import { CheckCircle, XCircle } from "./Icons";

type Props = {
  initials: string;
  color: string;
  size?: number;
  ring?: "success" | "danger" | "none";
  badge?: "check" | "x" | "none";
};

export function PlayerAvatar({ initials, color, size = 44, ring = "none", badge = "none" }: Props) {
  const ringClass =
    ring === "success" ? "ring-success-glow" : ring === "danger" ? "ring-danger-glow" : "";

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <div
        className={`flex h-full w-full items-center justify-center rounded-full text-white font-bold ${ringClass}`}
        style={{ background: `linear-gradient(135deg, ${color}, ${shade(color, -25)})`, fontSize: size * 0.36 }}
      >
        {initials}
      </div>
      {badge !== "none" && (
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background"
          style={{ padding: 1.5 }}
        >
          {badge === "check" ? (
            <CheckCircle className="text-success" style={{ width: size * 0.34, height: size * 0.34 }} />
          ) : (
            <XCircle className="text-destructive" style={{ width: size * 0.34, height: size * 0.34 }} />
          )}
        </div>
      )}
    </div>
  );
}

function shade(hex: string, percent: number) {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16, G = (f >> 8) & 0xff, B = f & 0xff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}
