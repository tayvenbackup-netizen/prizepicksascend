import { useState } from "react";
import emptyEntries from "@/assets/empty-entries.png";
import flagIcon from "@/assets/flag-icon.png";
import { useEntries, type Entry } from "./EntriesContext";
import { CheckBadge, XBadge } from "./Icons";
import { fmtMoney } from "@/lib/fmt";
import { EntryDetailSheet } from "./EntryDetailSheet";

export function EntriesView() {
  const [tab, setTab] = useState<"open" | "past">("open");
  const [openEntryId, setOpenEntryId] = useState<string | null>(null);
  const { entries } = useEntries();

  const open = entries.filter((e) => e.status === "live" || e.status === "upcoming");
  const past = entries.filter(
    (e) => e.status !== "live" && e.status !== "upcoming",
  );
  const live = open.filter((e) => e.status === "live");
  const upcoming = open.filter((e) => e.status === "upcoming");

  const totalOpen = open.length;
  const totalPotential = open.reduce((s, e) => s + e.potential, 0);

  const showEmpty = (tab === "open" && open.length === 0) || (tab === "past" && past.length === 0);

  return (
    <div className="relative flex h-full flex-col">

      {/* Sticky header: Open/Past tabs + stat cards */}
      <div className="shrink-0 bg-background">
        <div className="px-4 pt-3">
          <div className="relative grid grid-cols-2">
            {(["open", "past"] as const).map((t) => {
              const isActive = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative pb-2 text-center text-[12px] transition-colors ${
                    isActive ? "text-foreground font-bold" : "text-muted-foreground font-semibold"
                  }`}
                >
                  {t === "open" ? "Open" : "Past"}
                </button>
              );
            })}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/15" />
            <span
              className="pointer-events-none absolute bottom-0 h-[2px] w-1/2 rounded-full bg-primary transition-all duration-200"
              style={{ transform: `translateX(${tab === "open" ? "0%" : "100%"})` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 px-4 pt-3 pb-1.5">
          <div className="rounded-2xl bg-surface px-3 py-3.5 text-center">
            <div className="text-[20px] font-bold leading-none">{totalOpen}</div>
            <div className="mt-1.5 text-[11px] text-foreground/90">Entries Open</div>
          </div>
          <div className="rounded-2xl bg-surface px-3 py-3.5 text-center">
            <div className="text-[20px] font-bold leading-none">
              {fmtMoney(totalPotential)}
            </div>
            <div className="mt-1.5 text-[11px] text-foreground/90">Potential Winnings</div>
          </div>
        </div>
      </div>

      {/* Scrollable area below the tabs */}
      <div className="stats-scroll flex-1 min-h-0 overflow-y-auto pb-24">
        {showEmpty ? (
          <div className="flex flex-col items-center justify-start px-6 pt-6 pb-6">
            <img src={emptyEntries} alt="" className="h-[130px] w-auto object-contain select-none" draggable={false} />
            <h2 className="mt-4 text-[20px] font-bold tracking-tight">
              {tab === "open" ? "No open entries" : "No past entries"}
            </h2>
            <p className="mt-2 text-center text-[12px] leading-snug text-foreground/90">
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

            <button
              type="button"
              className="mt-5 rounded-full bg-primary px-7 py-2.5 text-[12px] font-bold text-primary-foreground shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
            >
              Start an entry
            </button>
          </div>
        ) : (
          <div className="flex flex-col px-4 pt-5 pb-6">
            {tab === "open" ? (
              <>
                {live.length > 0 && (
                  <Section title="Live">
                    {live.map((e) => (
                      <EntryCard key={e.id} entry={e} onClick={() => setOpenEntryId(e.id)} />
                    ))}
                  </Section>
                )}
                {upcoming.length > 0 && (
                  <Section title="Upcoming">
                    {upcoming.map((e) => (
                      <EntryCard key={e.id} entry={e} onClick={() => setOpenEntryId(e.id)} />
                    ))}
                  </Section>
                )}
              </>
            ) : (
              <PastList past={past} onOpen={(id) => setOpenEntryId(id)} />
            )}
          </div>
        )}
      </div>

      {/* Pinned Filter button above bottom nav */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center">
        <div className="pointer-events-auto">
          <FilterPill />
        </div>
      </div>

      <EntryDetailSheet
        entryId={openEntryId}
        open={openEntryId !== null}
        onOpenChange={(v) => !v && setOpenEntryId(null)}
      />
    </div>

  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-[15px] font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function planLabel(entry: Entry) {
  return `${entry.picks.length}-Pick ${entry.type === "power" ? "Power" : "Flex"} Play`;
}

function EntryCard({ entry, onClick }: { entry: Entry; onClick?: () => void }) {
  const visible = entry.picks.slice(0, 4);
  const extra = entry.picks.length - visible.length;
  const namesList = entry.picks
    .slice(0, 5)
    .map((p) => abbrev(p.player))
    .join(", ");
  const namesSuffix = entry.picks.length > 5 ? `, +${entry.picks.length - 5}` : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-white/5 bg-surface p-4 active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-bold">
            {fmtMoney(entry.entryAmount)} to pay {fmtMoney(entry.potential)}
          </div>
          <div className="mt-0.5 text-[13px] text-muted-foreground">
            {planLabel(entry)}
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
          <img src={flagIcon} alt="" className="h-5 w-5 object-contain" draggable={false} />
        </div>
      </div>

      <div className="mt-3 h-px bg-white/5" />

      <div className="mt-3 flex items-center gap-3">
        <div className="flex -space-x-2">
          {visible.map((p) => (
            <PickAvatar key={p.id} pick={p} />
          ))}
          {extra > 0 && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-[12px] font-bold">
              +{extra}
            </div>
          )}
        </div>
        <div className="ml-auto text-right">
          {entry.status === "live" ? (
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              Live
            </div>
          ) : entry.status === "past" ? (
            <PastStatusBadge entry={entry} />
          ) : (
            <>
              <div className="text-[12px] text-muted-foreground">Next game</div>
              <div className="text-[13px] font-semibold">{entry.startTime ?? "—"}</div>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 text-[12px] text-muted-foreground truncate">
        {namesList}
        {namesSuffix}
      </div>
    </button>
  );
}

function PastStatusBadge({ entry }: { entry: Entry }) {
  const hits = entry.picks.filter((p) => p.result === "win").length;
  const losses = entry.picks.filter((p) => p.result === "loss").length;
  const total = entry.picks.length;
  const isWin = entry.type === "power" ? hits === total : hits >= Math.ceil(total / 2);
  const isLoss = losses > 0 && !isWin;
  const label = isWin ? "Win" : isLoss ? "Loss" : "—";
  const tone = isWin
    ? "bg-success/15 text-success"
    : isLoss
    ? "bg-white/[0.06] text-foreground/80"
    : "bg-white/[0.06] text-muted-foreground";
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-[12px] font-semibold ${tone}`}>
      {label}
    </span>
  );
}

function PastList({ past, onOpen }: { past: Entry[]; onOpen: (id: string) => void }) {
  const groups = new Map<string, Entry[]>();
  for (const e of [...past].sort((a, b) => {
    const ad = e_date(a);
    const bd = e_date(b);
    return bd - ad;
  })) {
    const key = fmtDateHeader(e_date(e));
    const arr = groups.get(key) ?? [];
    arr.push(e);
    groups.set(key, arr);
  }
  return (
    <>
      {[...groups.entries()].map(([date, items]) => (
        <div key={date} className="mb-5">
          <h3 className="mb-2 text-[13px] font-semibold text-foreground/90">{date}</h3>
          <div className="space-y-3">
            {items.map((e) => (
              <EntryCard key={e.id} entry={e} onClick={() => onOpen(e.id)} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function e_date(e: Entry): number {
  if (e.playedAt) {
    const t = Date.parse(e.playedAt);
    if (!Number.isNaN(t)) return t;
  }
  return e.createdAt ?? 0;
}

function fmtDateHeader(ms: number): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PickAvatar({ pick }: { pick: Entry["picks"][number] }) {
  const ringColor =
    pick.result === "win"
      ? "var(--success)"
      : pick.result === "loss"
      ? "var(--destructive)"
      : "rgba(255,255,255,0.18)";

  const initials = pick.player
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="relative" style={{ width: 36, height: 36 }}>
      <div
        className="flex h-full w-full items-center justify-center rounded-full"
        style={{ background: ringColor, padding: 2 }}
      >
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#2a2540] text-[11px] font-bold">
          {pick.photo ? (
            <img src={pick.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>
      {pick.result && pick.result !== "pending" && (
        <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-[1.5px]">
          {pick.result === "win" ? (
            <CheckBadge className="h-4 w-4 text-success" />
          ) : (
            <XBadge className="h-4 w-4 text-destructive" />
          )}
        </div>
      )}
    </div>
  );
}

function FilterPill() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full bg-surface-2 px-6 py-3 text-[14px] font-semibold text-foreground/90"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
        <line x1="4" y1="7" x2="14" y2="7" />
        <circle cx="17" cy="7" r="2.2" />
        <line x1="10" y1="17" x2="20" y2="17" />
        <circle cx="7" cy="17" r="2.2" />
      </svg>
      Filter
    </button>
  );
}

function abbrev(name: string) {
  const parts = name.split(" ");
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}

