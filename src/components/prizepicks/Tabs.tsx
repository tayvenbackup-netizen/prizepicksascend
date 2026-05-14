import { useState } from "react";

export function ProfileTabs({
  onChange,
}: {
  onChange?: (t: "picks" | "stats") => void;
}) {
  const [active, setActive] = useState<"picks" | "stats">("stats");
  const set = (t: "picks" | "stats") => {
    setActive(t);
    onChange?.(t);
  };
  return (
    <div className="mt-6 px-4">
      <div className="relative grid grid-cols-2">
        {(["picks", "stats"] as const).map((t) => {
          const isActive = active === t;
          return (
            <button
              key={t}
              onClick={() => set(t)}
              className={`relative pb-2.5 text-center text-[15px] transition-colors ${
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground font-semibold"
              }`}
            >
              {t === "picks" ? "PicksPass" : "Stats"}
            </button>
          );
        })}
        {/* baseline */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/15" />
        {/* active underline */}
        <span
          className="pointer-events-none absolute bottom-0 h-[3px] w-1/2 rounded-full bg-primary transition-all duration-200"
          style={{
            transform: `translateX(${active === "picks" ? "0%" : "100%"})`,
            width: "50%",
          }}
        />
      </div>
    </div>
  );
}
