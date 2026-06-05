import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PLogo } from "./PLogo";
import { Jersey } from "./Jersey";
import { CheckBadge, XBadge, ShareIcon } from "./Icons";
import { useEntries, type Entry, type ParlayPick } from "./EntriesContext";
import { fmtMoney } from "@/lib/fmt";
import { computePayout } from "./EntriesContext";

type Tab = "entry" | "pulse" | "details";

export function EntryDetailSheet({
  entryId,
  open,
  onOpenChange,
}: {
  entryId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { entries, updateEntry, updatePick } = useEntries();
  const entry = useMemo(
    () => entries.find((e) => e.id === entryId) ?? null,
    [entries, entryId],
  );
  const [tab, setTab] = useState<Tab>("entry");
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!open) {
      setEditing(false);
      setTab("entry");
    }
  }, [open]);

  if (!entry) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[92vh] rounded-t-3xl border-0 bg-background p-0"
        />
      </Sheet>
    );
  }

  const hits = entry.picks.filter((p) => p.result === "win").length;
  const losses = entry.picks.filter((p) => p.result === "loss").length;
  const settled = entry.picks.every((p) => p.result && p.result !== "pending");
  const finalPayout = settled
    ? computePayout(entry.type, entry.picks.length, hits, entry.entryAmount)
    : entry.potential;
  const statusLabel: "Win" | "Loss" | "Live" = settled
    ? finalPayout > 0
      ? "Win"
      : "Loss"
    : "Live";
  const statusClass =
    statusLabel === "Win"
      ? "bg-success/15 text-success"
      : statusLabel === "Loss"
      ? "bg-white/10 text-foreground/80"
      : "bg-destructive/15 text-destructive";

  const planLabel = `${entry.picks.length}-Pick ${
    entry.type === "power" ? "Power" : "Flex"
  } Play`;

  // group picks by league + matchup (using team only, since matchup unknown)
  const groups = entry.picks.reduce<Record<string, ParlayPick[]>>((acc, p) => {
    const key = `${p.league ?? "—"}::${p.team ?? "—"}`;
    (acc[key] ||= []).push(p);
    return acc;
  }, {});

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[92vh] rounded-t-3xl border-0 bg-background p-0 [&>button]:hidden"
      >
        <div className="flex h-full flex-col">
          {/* Drag handle */}
          <div className="flex justify-center pt-2.5">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-3">
            <div className="flex items-center gap-3 min-w-0">
              <PLogo size={36} />
              <div className="min-w-0">
                <div className="text-[17px] font-bold leading-tight truncate">
                  {fmtMoney(entry.entryAmount)} to pay{" "}
                  <span className="text-muted-foreground">
                    {fmtMoney(finalPayout)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span>{planLabel}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1 shrink-0">
              <button className="text-foreground/90">
                <ShareIcon className="h-5 w-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center text-foreground/90 outline-none">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <circle cx="5" cy="12" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="19" cy="12" r="1.8" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => setEditing((v) => !v)}>
                    {editing ? "Done editing" : "Edit picks & amount"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      entry.picks.forEach((p) =>
                        updatePick(entry.id, p.id, { result: "win" }),
                      )
                    }
                  >
                    Mark all as Win
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      entry.picks.forEach((p) =>
                        updatePick(entry.id, p.id, { result: "loss" }),
                      )
                    }
                  >
                    Mark all as Loss
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      entry.picks.forEach((p) =>
                        updatePick(entry.id, p.id, { result: "pending" }),
                      )
                    }
                  >
                    Reset to pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 grid grid-cols-3 px-5">
            {(["entry", "pulse", "details"] as Tab[]).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative pb-2 text-center text-[14px] capitalize transition-colors ${
                    active ? "font-bold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="h-px bg-white/10" />

          {/* Edit bar */}
          {editing && (
            <div className="flex items-center justify-between gap-3 px-5 py-3">
              <label className="text-[12px] text-muted-foreground">
                Entry amount
              </label>
              <div className="flex items-center gap-1 rounded-lg bg-surface px-2 py-1.5">
                <span className="text-[13px] text-muted-foreground">$</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={entry.entryAmount}
                  onChange={(e) =>
                    updateEntry(entry.id, {
                      entryAmount: Math.max(1, Number(e.target.value) || 0),
                    })
                  }
                  className="w-20 bg-transparent text-right text-[14px] font-semibold outline-none"
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-8">
            {tab === "entry" ? (
              <div className="space-y-3">
                {Object.entries(groups).map(([key, picks]) => (
                  <MatchupGroup
                    key={key}
                    league={picks[0].league ?? "—"}
                    team={picks[0].team ?? "—"}
                    picks={picks}
                    editing={editing}
                    onUpdate={(pid, patch) => updatePick(entry.id, pid, patch)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground">
                {tab === "pulse" ? "Pulse coming soon." : "No additional details."}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MatchupGroup({
  league,
  team,
  picks,
  editing,
  onUpdate,
}: {
  league: string;
  team: string;
  picks: ParlayPick[];
  editing: boolean;
  onUpdate: (pickId: string, patch: Partial<ParlayPick>) => void;
}) {
  return (
    <div className="rounded-2xl bg-surface">
      <div className="flex items-center justify-between px-3 py-2.5 text-[12px]">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-semibold text-foreground/90">
            {league}
          </span>
          <span className="text-foreground/80">{team}</span>
        </div>
        <span className="text-muted-foreground">Final</span>
      </div>
      <div className="px-3 pb-3 space-y-3">
        {picks.map((p, i) => (
          <div key={p.id}>
            {i > 0 && <div className="-mx-3 mb-3 h-px bg-white/5" />}
            <PickRow pick={p} editing={editing} onUpdate={onUpdate} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PickRow({
  pick,
  editing,
  onUpdate,
}: {
  pick: ParlayPick;
  editing: boolean;
  onUpdate: (pickId: string, patch: Partial<ParlayPick>) => void;
}) {
  const current = pick.currentValue ?? pick.line;
  const line = pick.line || 1;
  // Bar fill: relative to line; >= line = full, otherwise fraction of line.
  const ratio = pick.pick === "over"
    ? Math.min(1, Math.max(0.06, current / line))
    : Math.min(1, Math.max(0.06, line / Math.max(current, line * 0.1)));
  const result = pick.result ?? "pending";
  const barColor =
    result === "win"
      ? "bg-success"
      : result === "loss"
      ? "bg-white/20"
      : "bg-primary";
  const valueColor =
    result === "win"
      ? "border-success text-success"
      : result === "loss"
      ? "border-destructive text-destructive"
      : "border-white/30 text-foreground/90";

  return (
    <div>
      <div className="flex items-start gap-3">
        <PickAvatar pick={pick} />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-bold leading-tight truncate">
            {pick.player}
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground truncate">
            {pick.team ?? "—"} · {pick.league ?? "—"}
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.04] px-3 py-2 text-right ring-1 ring-white/10">
          <div className="flex items-center justify-end gap-1 text-[14px] font-bold">
            <span className="text-success">😈</span>
            <span>{pick.pick === "over" ? "↑" : "↓"}</span>
            <span>{pick.line}</span>
          </div>
          <div className="text-[11px] text-muted-foreground">{pick.stat}</div>
        </div>
      </div>

      {/* Progress bar with value chip */}
      <div className="relative mt-3 h-2 rounded-full bg-white/[0.06]">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${barColor} transition-all`}
          style={{ width: `${ratio * 100}%` }}
        />
        <div
          className="absolute -top-2.5 -translate-x-1/2"
          style={{ left: `${ratio * 100}%` }}
        >
          <div
            className={`min-w-[34px] rounded-full border bg-background px-2 py-0.5 text-center text-[11px] font-bold ${valueColor}`}
          >
            {Number.isInteger(current) ? current : current.toFixed(1)}
          </div>
        </div>
      </div>

      {editing && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-surface-2 px-2 py-1">
            <span className="text-[11px] text-muted-foreground">Value</span>
            <input
              type="number"
              step="0.5"
              value={current}
              onChange={(e) =>
                onUpdate(pick.id, { currentValue: Number(e.target.value) })
              }
              className="w-16 bg-transparent text-right text-[13px] font-semibold outline-none"
            />
          </div>
          <div className="ml-auto flex gap-1">
            {(["win", "pending", "loss"] as const).map((r) => (
              <button
                key={r}
                onClick={() => onUpdate(pick.id, { result: r })}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold capitalize ring-1 ${
                  result === r
                    ? r === "win"
                      ? "bg-success/20 text-success ring-success/40"
                      : r === "loss"
                      ? "bg-destructive/20 text-destructive ring-destructive/40"
                      : "bg-white/10 text-foreground/90 ring-white/20"
                    : "text-muted-foreground ring-white/10"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PickAvatar({ pick }: { pick: ParlayPick }) {
  const result = pick.result ?? "pending";
  const ring =
    result === "win"
      ? "var(--success)"
      : result === "loss"
      ? "var(--destructive)"
      : "rgba(255,255,255,0.18)";
  return (
    <div className="relative shrink-0">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ background: ring, padding: 2 }}
      >
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#2a2540]">
          {pick.photo ? (
            <img src={pick.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <Jersey team={pick.team ?? "??"} size={40} />
          )}
        </div>
      </div>
      {result !== "pending" && (
        <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-[1.5px]">
          {result === "win" ? (
            <CheckBadge className="h-4 w-4 text-success" />
          ) : (
            <XBadge className="h-4 w-4 text-destructive" />
          )}
        </div>
      )}
    </div>
  );
}
