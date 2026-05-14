import { useState } from "react";
import boardIcon from "@/assets/nav/board.png";
import entriesIcon from "@/assets/nav/entries.png";
import feedIcon from "@/assets/nav/feed.png";
import promosIcon from "@/assets/nav/promos.png";
import profileIcon from "@/assets/nav/profile.png";

export type NavTab = "board" | "entries" | "feed" | "promos" | "profile";

const items: { id: NavTab; label: string; src: string }[] = [
  { id: "board", label: "Board", src: boardIcon },
  { id: "entries", label: "My Entries", src: entriesIcon },
  { id: "feed", label: "Feed", src: feedIcon },
  { id: "promos", label: "Promos", src: promosIcon },
  { id: "profile", label: "Profile", src: profileIcon },
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
    <nav className="fixed inset-x-0 bottom-0 z-30 bg-background">
      <div className="mx-auto w-full">

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
                <img
                  src={it.src}
                  alt=""
                  draggable={false}
                  className={`h-[42px] w-[42px] object-contain transition-opacity ${
                    isActive ? "opacity-100" : "opacity-70"
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
