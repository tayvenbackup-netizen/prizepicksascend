import { useState } from "react";
import navImg from "@/assets/bottom-nav.jpeg";

const items = [
  { id: "board", label: "Board" },
  { id: "entries", label: "My Entries" },
  { id: "feed", label: "Feed" },
  { id: "promos", label: "Promos" },
  { id: "profile", label: "Profile" },
] as const;

export function BottomNav() {
  const [active, setActive] = useState<string>("profile");

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
