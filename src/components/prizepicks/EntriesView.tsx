import { useState } from "react";
import emptyEntries from "@/assets/empty-entries.png";
import flagIcon from "@/assets/flag-icon.png";
import { useEntries, type Entry } from "./EntriesContext";
import { CheckCircle, XCircle } from "./Icons";

export function EntriesView() {
  const [tab, setTab] = useState<"open" | "past">("open");
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
                  isActive ? "text-foreground font-bold" : "text-muted-foreground font-semibold"
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
          <div className="text-[26px] font-bold leading-none">{totalOpen}</div>
          <div className="mt-2 text-[13px] text-foreground/90">Entries Open</div>
        </div>
        <div className="rounded-2xl bg-surface px-4 py-5 text-center">
          <div className="text-[26px] font-bold leading-none">
            ${totalPotential.toFixed(2).replace(/\.00$/, "")}
          </div>
          <div className="mt-2 text-[13px] text-foreground/90">Potential Winnings</div>
        </div>
      </div>

      {showEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-start px-6 pt-10 pb-8">
          <img src={emptyEntries} alt="" className="h-[180px] w-auto object-contain select-none" draggable={false} />
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

          <button
            type="button"
            className="mt-7 rounded-full bg-primary px-10 py-3.5 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
          >
            Start an entry
          </button>

          <FilterPill />
        </div>
      ) : (
        <div className="flex flex-1 flex-col px-4 pt-5 pb-6">
          {tab === "open" ? (
            <>
              {live.length > 0 && (
                <Section title="Live">
                  {live.map((e) => <EntryCard key={e.id} entry={e} />)}
                </Section>
              )}
              {upcoming.length > 0 && (
                <Section title="Upcoming">
                  {upcoming.map((e) => <EntryCard key={e.id} entry={e} />)}
                </Section>
              )}
            </>
          ) : (
            <Section title="Past">
              {past.map((e) => <EntryCard key={e.id} entry={e} />)}
            </Section>
          )}

          <div className="mt-auto flex justify-center pt-6">
            <FilterPill />
          </div>
        </div>
      )}
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

function EntryCard({ entry }: { entry: Entry }) {
  const visible = entry.picks.slice(0, 4);
  const extra = entry.picks.length - visible.length;
  const namesList = entry.picks
    .slice(0, 5)
    .map((p) => abbrev(p.player))
    .join(", ");
  const namesSuffix = entry.picks.length > 5 ? `, +${entry.picks.length - 5}` : "";

  return (
    <div className="rounded-2xl border border-white/5 bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-bold">
            ${entry.entryAmount} to pay ${formatMoney(entry.potential)}
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
    </div>
  );
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
        <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-[1px]">
          {pick.result === "win" ? (
            <CheckCircle className="h-3.5 w-3.5 text-success" />
          ) : (
            <XCircle className="h-3.5 w-3.5 text-destructive" />
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

function formatMoney(n: number) {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
}
