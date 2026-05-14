import { useState } from "react";
import { BoardIcon, EntriesIcon, FeedIcon, PromosIcon } from "./Icons";

const items = [
  { id: "board", label: "Board", Icon: BoardIcon },
  { id: "entries", label: "My Entries", Icon: EntriesIcon },
  { id: "feed", label: "Feed", Icon: FeedIcon },
  { id: "promos", label: "Promos", Icon: PromosIcon, dot: true },
  { id: "profile", label: "Profile", Icon: ProfileGlyph },
] as const;

function ProfileGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M11 9h7a4 4 0 0 1 0 8h-4v4l-3 3V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BottomNav() {
  const [active, setActive] = useState("profile");
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="grid grid-cols-5">
        {items.map(({ id, label, Icon, dot }: any) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${isActive && id === "profile" ? "text-primary" : ""}`} />
                {dot && (
                  <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                )}
              </div>
              <span className={isActive ? "font-semibold" : ""}>{label}</span>
            </button>
          );
        })}
      </div>
      {/* Home indicator */}
      <div className="flex justify-center pb-1.5 pt-0.5">
        <div className="h-1 w-32 rounded-full bg-foreground/80" />
      </div>
    </nav>
  );
}
