import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PLogo } from "./PLogo";
import { Jersey } from "./Jersey";
import { CheckBadge, XBadge, ShareIcon } from "./Icons";
import { useEntries, type Entry, type ParlayPick } from "./EntriesContext";
import { fmtMoney } from "@/lib/fmt";
import { computePayoutWithBadges as computePayout, maxPayoutWithBadges as maxPayout } from "./EntriesContext";
import { BadgeIcon, BadgePicker } from "./Badges";

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
  const { entries, updateEntry, updatePick, removeEntry } = useEntries();
  const entry = useMemo(
    () => entries.find((e) => e.id === entryId) ?? null,
    [entries, entryId],
  );
  const [tab, setTab] = useState<Tab>("entry");
  const [editing, setEditing] = useState(false);

  const y = useMotionValue(0);
  const overlayOpacity = useTransform(y, [0, 400], [1, 0]);

  useEffect(() => {
    if (!open) {
      setEditing(false);
      setTab("entry");
    } else {
      y.set(0);
    }
  }, [open, y]);

  // lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && entry && (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            className="absolute inset-0 bg-black/70"
            style={{ opacity: overlayOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            key="entry-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            style={{ y, top: "calc(env(safe-area-inset-top, 0px) + 56px)" }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140 || info.velocity.y > 700) {
                onOpenChange(false);
              } else {
                y.set(0);
              }
            }}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-background"
          >
            <SheetBody
              entry={entry}
              tab={tab}
              setTab={setTab}
              editing={editing}
              setEditing={setEditing}
              onClose={() => onOpenChange(false)}
              updateEntry={updateEntry}
              updatePick={updatePick}
              removeEntry={removeEntry}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SheetBody({
  entry,
  tab,
  setTab,
  editing,
  setEditing,
  onClose,
  updateEntry,
  updatePick,
  removeEntry,
}: {
  entry: Entry;
  tab: Tab;
  setTab: (t: Tab) => void;
  editing: boolean;
  setEditing: (v: boolean) => void;
  onClose: () => void;
  updateEntry: ReturnType<typeof useEntries>["updateEntry"];
  updatePick: ReturnType<typeof useEntries>["updatePick"];
  removeEntry: ReturnType<typeof useEntries>["removeEntry"];
}) {
  const hits = entry.picks.filter((p) => p.result === "win").length;
  const settled = entry.picks.every((p) => p.result && p.result !== "pending");
  const finalPayout = settled
    ? computePayout(entry.type, entry.picks, entry.entryAmount)
    : maxPayout(entry.type, entry.picks, entry.entryAmount);
  const isPast = entry.status === "past";
  const isWin = isPast && settled && finalPayout > 0;
  const isLoss = isPast && settled && finalPayout === 0;
  const statusLabel: "Win" | "Loss" | "Live" | "Past" = isPast
    ? settled
      ? finalPayout > 0
        ? "Win"
        : "Loss"
      : "Past"
    : settled
    ? finalPayout > 0
      ? "Win"
      : "Loss"
    : "Live";
  const statusClass =
    statusLabel === "Win"
      ? "bg-success/15 text-success"
      : statusLabel === "Loss"
      ? "bg-destructive/15 text-destructive"
      : statusLabel === "Past"
      ? "bg-white/10 text-foreground/70"
      : "bg-destructive/15 text-destructive";

  const planLabel = `${entry.picks.length}-Pick ${
    entry.type === "power" ? "Power" : "Flex"
  } Play`;

  // Group key MUST be stable across edits — do NOT include gameLabel,
  // otherwise editing the label remounts the input and dismisses the keyboard.
  const groups = entry.picks.reduce<Record<string, ParlayPick[]>>((acc, p) => {
    const key = `${p.league ?? "—"}::${p.team ?? "—"}`;
    (acc[key] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="flex h-full max-h-[calc(100vh-env(safe-area-inset-top)-56px)] flex-col">
      {/* Drag handle (drag area lives here too) */}
      <div className="flex justify-center pt-2.5 cursor-grab active:cursor-grabbing">
        <div className="h-1 w-10 rounded-full bg-white/25" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-3">
        <div className="flex items-center gap-3 min-w-0">
          <PLogo size={36} />
          <div className="min-w-0">
            <div className="text-[17px] font-bold leading-tight truncate">
              <span className={isWin ? "text-success" : undefined}>
                {fmtMoney(entry.entryAmount)}
              </span>{" "}
              {isWin ? "paid" : isPast ? "for" : "to pay"}{" "}
              <span className={isWin ? "text-success" : "text-muted-foreground"}>
                {fmtMoney(isWin ? finalPayout : isPast ? maxPayout(entry.type, entry.picks, entry.entryAmount) : finalPayout)}
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
          <button className="text-foreground/90" aria-label="Share">
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setEditing(!editing)}>
                {editing ? "Done editing" : "Edit picks & amount"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  updateEntry(entry.id, {
                    status: "past",
                    playedAt: entry.playedAt ?? new Date().toISOString(),
                  })
                }
                disabled={isPast}
              >
                Move to Past
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateEntry(entry.id, { status: "upcoming" })}
                disabled={!isPast}
              >
                Restore to Open
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
                    updatePick(entry.id, p.id, {
                      result: "pending",
                      currentValue: 0,
                    }),
                  )
                }
              >
                Reset to neutral
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  removeEntry(entry.id);
                  onClose();
                }}
                className="text-destructive focus:text-destructive"
              >
                Delete entry
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
          <label className="text-[12px] text-muted-foreground">Entry amount</label>
          <div className="flex items-center gap-1 rounded-lg bg-surface px-2 py-1.5">
            <span className="text-[13px] text-muted-foreground">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={entry.entryAmount === 0 ? "" : String(entry.entryAmount)}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d*\.?\d*$/.test(v)) {
                  updateEntry(entry.id, { entryAmount: v === "" ? 0 : Number(v) });
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "" || Number(e.target.value) < 1) {
                  updateEntry(entry.id, { entryAmount: 1 });
                }
              }}
              placeholder="0"
              className="w-20 bg-transparent text-right text-[14px] font-semibold outline-none placeholder:text-muted-foreground/40"
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
                gameLabel={picks[0].gameLabel ?? picks[0].team ?? "—"}
                picks={picks}
                editing={editing}
                isPast={isPast}
                onUpdate={(pid, patch) => updatePick(entry.id, pid, patch)}
                onUpdateGroupLabel={(label) =>
                  picks.forEach((p) => updatePick(entry.id, p.id, { gameLabel: label }))
                }
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
  );
}

function MatchupGroup({
  league,
  gameLabel,
  picks,
  editing,
  isPast,
  onUpdate,
  onUpdateGroupLabel,
}: {
  league: string;
  gameLabel: string;
  picks: ParlayPick[];
  editing: boolean;
  isPast: boolean;
  onUpdate: (pickId: string, patch: Partial<ParlayPick>) => void;
  onUpdateGroupLabel: (label: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-surface">
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-[12px]">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-semibold text-foreground/90 shrink-0">
            {league}
          </span>
          {editing && isPast ? (
            <input
              type="text"
              value={gameLabel}
              onChange={(e) => onUpdateGroupLabel(e.target.value)}
              placeholder="ATL 0 vs IND 0"
              className="min-w-0 flex-1 rounded-md bg-black/40 px-2 py-0.5 text-[12px] text-foreground/90 outline-none ring-1 ring-white/10 focus:ring-primary"
            />
          ) : (
            <span className="truncate text-foreground/80">{gameLabel}</span>
          )}
        </div>
        <span className="text-muted-foreground shrink-0">
          {isPast ? "Final" : "Live"}
        </span>
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
  // Default to 0 / neutral unless explicitly set by the client.
  const current = pick.currentValue ?? 0;
  const line = pick.line || 1;
  const result = pick.result ?? "pending";
  const isNeutral = result === "pending" && current === 0;
  // Bar fill ALWAYS reflects current value vs line, regardless of win/loss.
  // For both Over and Under, ratio = current / line (clamped 0–1+).
  // We allow it to visually cap at 100% but the underlying value is preserved
  // for the chip. The bar color still reflects the result.
  let ratio: number;
  if (current <= 0 || line <= 0) {
    ratio = 0;
  } else {
    ratio = Math.min(1, current / line);
  }

  const barColor =
    result === "win"
      ? "bg-success"
      : result === "loss"
      ? "bg-destructive/70"
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
          <div className="text-[15px] font-bold leading-tight truncate">{pick.player}</div>
          <div className="mt-0.5 text-[12px] text-muted-foreground truncate">
            {pick.team ?? "—"} · {pick.league ?? "—"}
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.04] px-3 py-2 text-right ring-1 ring-white/10">
          <div className="flex items-center justify-end gap-1 text-[14px] font-bold">
            {pick.badge && <BadgeIcon badge={pick.badge} size={14} />}
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
              type="text"
              inputMode="decimal"
              value={current === 0 ? "" : String(current)}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d*\.?\d*$/.test(v)) {
                  onUpdate(pick.id, { currentValue: v === "" ? 0 : Number(v) });
                }
              }}
              placeholder="0"
              className="w-16 bg-transparent text-right text-[13px] font-semibold outline-none placeholder:text-muted-foreground/40"
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
      {editing && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Modifier
          </span>
          <BadgePicker
            value={pick.badge ?? null}
            size="xs"
            onChange={(b) => onUpdate(pick.id, { badge: b })}
          />
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
