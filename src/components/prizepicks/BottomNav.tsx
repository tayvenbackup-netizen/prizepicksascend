import { useState } from "react";
import { BoardIcon, EntriesIcon, FeedIcon, PromosIcon, PLogo } from "./Icons";

export type NavTab = "board" | "entries" | "feed" | "promos" | "profile";

const items: {
  id: NavTab;
  label: string;
  Icon: (p: { className?: string }) => JSX.Element;
}[] = [
  { id: "board", label: "Board", Icon: (p) => <BoardIcon {...p} /> },
  { id: "entries", label: "My Entries", Icon: (p) => <EntriesIcon {...p} /> },
  { id: "feed", label: "Feed", Icon: (p) => <FeedIcon {...p} /> },
  { id: "promos", label: "Promos", Icon: (p) => <PromosIcon {...p} /> },
  {
    id: "profile",
    label: "Profile",
    Icon: ({ className }) => (
      <div className={className} style={{ width: 26, height: 26 }}>
        <PLogo size={26} />
      </div>
    ),
  },
];

export function BottomNav({
  active: activeProp,
  onChange,
}: {
  active?: NavTab;
  onChange?: (t: NavTab) => void;
}) {
  const [internal, setInternal] = useState<NavTab>("profile");
  const active = activeProp ?? internal;
  const setActive = (t: NavTab) => {
    setInternal(t);
    onChange?.(t);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto max-w-[480px]">
        <div className="grid grid-cols-5 pt-2 pb-2">
          {items.map((it) => {
            const isActive = active === it.id;
            return (
              <button
                key={it.id}
                type="button"
                aria-label={it.label}
                aria-pressed={isActive}
                onClick={() => setActive(it.id)}
                className="relative flex flex-col items-center justify-center gap-1 py-1.5"
              >
                <it.Icon
                  className={`h-[26px] w-[26px] ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-[11px] ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {it.label}
                </span>
                <span
                  className={`pointer-events-none absolute -bottom-0.5 left-1/2 h-[3px] w-9 -translate-x-1/2 rounded-full bg-primary transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
