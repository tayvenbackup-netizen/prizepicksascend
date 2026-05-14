import { useState } from "react";
import emptyEntries from "@/assets/empty-entries.png";

export function EntriesView() {
  const [tab, setTab] = useState<"open" | "past">("open");

  return (
    <div className="flex h-full flex-col">
      {/* Open / Past tabs */}
      <div className="px-4 pt-4">
        <div className="relative grid grid-cols-2">
          {(["open", "past"] as const).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative pb-2.5 text-center text-[15px] transition-colors ${
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground font-semibold"
                }`}
              >
                {t === "open" ? "Open" : "Past"}
              </button>
            );
          })}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/15" />
          <span
            className="pointer-events-none absolute bottom-0 h-[3px] w-1/2 rounded-full bg-primary transition-all duration-200"
            style={{ transform: `translateX(${tab === "open" ? "0%" : "100%"})` }}
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div className="rounded-2xl bg-surface px-4 py-5 text-center">
          <div className="text-[26px] font-bold leading-none">0</div>
          <div className="mt-2 text-[13px] text-foreground/90">Entries Open</div>
        </div>
        <div className="rounded-2xl bg-surface px-4 py-5 text-center">
          <div className="text-[26px] font-bold leading-none">$0</div>
          <div className="mt-2 text-[13px] text-foreground/90">Potential Winnings</div>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-1 flex-col items-center justify-start px-6 pt-10 pb-8">
        <img
          src={emptyEntries}
          alt=""
          className="h-[180px] w-auto object-contain select-none"
          draggable={false}
        />
        <h2 className="mt-6 text-[28px] font-bold tracking-tight">
          {tab === "open" ? "No open entries" : "No past entries"}
        </h2>
        <p className="mt-3 text-center text-[15px] leading-snug text-foreground/90">
          {tab === "open" ? (
            <>
              Your open entries will appear here.
              <br />
              Start a new entry below!
            </>
          ) : (
            <>Your past entries will appear here.</>
          )}
        </p>

        {tab === "open" && (
          <button
            type="button"
            className="mt-7 rounded-full bg-primary px-10 py-3.5 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
          >
            Start an entry
          </button>
        )}

        {/* Filter pill */}
        <button
          type="button"
          className="mt-auto flex items-center gap-2 rounded-full bg-surface-2 px-6 py-3 text-[14px] font-semibold text-foreground/90"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
            <line x1="4" y1="7" x2="14" y2="7" />
            <circle cx="17" cy="7" r="2.2" />
            <line x1="10" y1="17" x2="20" y2="17" />
            <circle cx="7" cy="17" r="2.2" />
          </svg>
          Filter
        </button>
      </div>
    </div>
  );
}
