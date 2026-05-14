import { useState } from "react";
import { PLogo } from "./PLogo";

type SVGP = React.SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function BoardIcon(p: SVGP) {
  return (
    <svg viewBox="0 0 32 32" {...stroke} {...p}>
      {/* back card */}
      <rect x="11" y="5" width="16" height="20" rx="2.5" />
      {/* front card */}
      <rect x="5" y="9" width="16" height="20" rx="2.5" fill="hsl(var(--bg))" />
      <circle cx="13" cy="16" r="2.6" />
      <path d="M8 25c1.4-2.8 4-4.2 5-4.2s3.6 1.4 5 4.2" />
    </svg>
  );
}

function EntriesIcon(p: SVGP) {
  return (
    <svg viewBox="0 0 32 32" {...stroke} {...p}>
      <path d="M8 4h16v25l-2.7-2-2.6 2-2.7-2-2.7 2-2.6-2L8 29z" />
      <path d="M12 11h8M12 15h8M12 19h6" />
    </svg>
  );
}

function FeedIcon(p: SVGP) {
  return (
    <svg viewBox="0 0 32 32" {...stroke} {...p}>
      <rect x="4" y="11" width="24" height="16" rx="2.5" />
      <rect x="6.5" y="6" width="19" height="6" rx="1.8" />
      <path d="M13 18h6" />
    </svg>
  );
}

function PromosIcon(p: SVGP) {
  return (
    <svg viewBox="0 0 32 32" {...stroke} {...p}>
      <path d="M17 4h9a2 2 0 0 1 2 2v9L15 28a2.8 2.8 0 0 1-4 0L4 21a2.8 2.8 0 0 1 0-4z" />
      <circle cx="22" cy="10" r="1.8" />
    </svg>
  );
}

function ProfileIcon({ active, ...p }: SVGP & { active?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...p}>
      {/* base ring */}
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {active && (
        <circle
          cx="16"
          cy="16"
          r="13"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="22 200"
          transform="rotate(-70 16 16)"
        />
      )}
    </svg>
  );
}

const items = [
  { id: "board", label: "Board", Icon: BoardIcon },
  { id: "entries", label: "My Entries", Icon: EntriesIcon },
  { id: "feed", label: "Feed", Icon: FeedIcon },
  { id: "promos", label: "Promos", Icon: PromosIcon, dot: true },
  { id: "profile", label: "Profile", Icon: null as any },
] as const;

export function BottomNav() {
  const [active, setActive] = useState<string>("profile");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 bg-background">
      <div className="mx-auto grid max-w-[480px] grid-cols-5 px-2 pt-2.5 pb-1">
        {items.map(({ id, label, Icon, dot }: any) => {
          const isActive = active === id;
          const isProfile = id === "profile";
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-label={label}
              className={`group flex flex-col items-center justify-end gap-1.5 py-1.5 text-[13px] transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div className="relative flex h-8 w-8 items-center justify-center">
                {isProfile ? (
                  <>
                    <ProfileIcon active={isActive} className="h-8 w-8" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <PLogo size={16} />
                    </span>
                  </>
                ) : (
                  <Icon className="h-[30px] w-[30px]" />
                )}
                {dot && (
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#ff3da6] ring-2 ring-background" />
                )}
              </div>
              <span className={isActive ? "font-semibold" : "font-medium"}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-center pb-2 pt-0.5">
        <div className="h-[5px] w-32 rounded-full bg-foreground/85" />
      </div>
    </nav>
  );
}
