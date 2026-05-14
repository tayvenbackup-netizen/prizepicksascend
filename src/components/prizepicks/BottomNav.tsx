import { useState } from "react";
import navImg from "@/assets/bottom-nav.jpeg";

export type NavTab = "board" | "entries" | "feed" | "promos" | "profile";

const items: { id: NavTab; label: string }[] = [
  { id: "board", label: "Board" },
  { id: "entries", label: "My Entries" },
  { id: "feed", label: "Feed" },
  { id: "promos", label: "Promos" },
  { id: "profile", label: "Profile" },
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
      <div className="mx-auto max-w-[480px]">
        <div className="relative w-full">
          <img
            src={navImg}
            alt=""
            className="block w-full select-none"
            draggable={false}
          />
          <div className="absolute inset-0 grid grid-cols-5">
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                aria-label={it.label}
                aria-pressed={active === it.id}
                onClick={() => setActive(it.id)}
                className="h-full w-full bg-transparent active:bg-white/5 transition-colors"
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
