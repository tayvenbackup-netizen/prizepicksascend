import { useState } from "react";

export function ProfileTabs({ onChange }: { onChange?: (t: "picks" | "stats") => void }) {
  const [active, setActive] = useState<"picks" | "stats">("stats");
  const set = (t: "picks" | "stats") => {
    setActive(t);
    onChange?.(t);
  };
  return (
    <div className="mt-6 px-4">
      <div className="grid grid-cols-2 border-b border-border/70">
        {(["picks", "stats"] as const).map((t) => {
          const isActive = active === t;
          return (
            <button
              key={t}
              onClick={() => set(t)}
              className={`relative py-3 text-center text-base font-semibold transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t === "picks" ? "PicksPass" : "Stats"}
              <span
                className={`pointer-events-none absolute inset-x-0 -bottom-[2px] h-[3px] rounded-full transition-all ${
                  isActive ? "bg-primary opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
