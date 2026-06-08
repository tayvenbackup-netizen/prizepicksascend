import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type PickBadge = "demon" | "goblin" | null;

export type ParlayPick = {
  id: string;
  player: string;
  team?: string;
  league?: string;
  stat: string;
  line: number;
  pick: "over" | "under";
  /** result: pending while live/upcoming, win/loss after settlement */
  result?: "pending" | "win" | "loss";
  photo?: string;
  /** Current/final stat value used to fill the progress bar. Defaults to 0 (neutral). */
  currentValue?: number;
  /** Optional “demon” (harder) or “goblin” (easier) modifier shown next to the line. */
  badge?: PickBadge;
  /** Per-pick game label shown above the player (e.g. "ATL 12 vs IND 18"). Editable for past entries. */
  gameLabel?: string;
};

export type ParlayType = "power" | "flex";

export type Entry = {
  id: string;
  type: ParlayType;
  status: "live" | "upcoming" | "past";
  entryAmount: number;
  potential: number;
  picks: ParlayPick[];
  startTime?: string;
  /** ISO timestamp of the earliest pick's game start. */
  startsAt?: string;
  /** ISO date (for past entries) */
  playedAt?: string;
  createdAt: number;
};

type Ctx = {
  entries: Entry[];
  addEntry: (e: Omit<Entry, "id" | "createdAt">) => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, patch: Partial<Omit<Entry, "id" | "createdAt">>) => void;
  updatePick: (entryId: string, pickId: string, patch: Partial<ParlayPick>) => void;
};

const EntriesContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "pp_entries_v1";

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Entry[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore quota */
    }
  }, [entries]);

  const addEntry: Ctx["addEntry"] = (e) => {
    setEntries((prev) => [
      {
        ...e,
        id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const removeEntry = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const updateEntry: Ctx["updateEntry"] = (id, patch) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const updatePick: Ctx["updatePick"] = (entryId, pickId, patch) =>
    setEntries((prev) =>
      prev.map((e) =>
        e.id !== entryId
          ? e
          : { ...e, picks: e.picks.map((p) => (p.id === pickId ? { ...p, ...patch } : p)) },
      ),
    );

  return (
    <EntriesContext.Provider
      value={{ entries, addEntry, removeEntry, updateEntry, updatePick }}
    >
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error("useEntries must be inside EntriesProvider");
  return ctx;
}

/* ====== PrizePicks payout math ====== */

export const POWER_MULTIPLIERS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 5,
  4: 10,
  5: 20,
  6: 25,
};

export const FLEX_TABLE: Record<number, Record<number, number>> = {
  3: { 3: 2.25, 2: 1.25 },
  4: { 4: 5, 3: 1.5 },
  5: { 5: 10, 4: 2, 3: 0.4 },
  6: { 6: 25, 5: 2, 4: 0.4 },
};

export function computePayout(
  type: ParlayType,
  pickCount: number,
  hits: number,
  entryAmount: number,
): number {
  if (type === "power") {
    if (hits < pickCount) return 0;
    return entryAmount * (POWER_MULTIPLIERS[pickCount] ?? 1);
  }
  const table = FLEX_TABLE[pickCount];
  if (!table) return entryAmount * (POWER_MULTIPLIERS[pickCount] ?? 1);
  const mult = table[hits] ?? 0;
  return entryAmount * mult;
}

export function maxPayout(
  type: ParlayType,
  pickCount: number,
  entryAmount: number,
): number {
  return computePayout(type, pickCount, pickCount, entryAmount);
}

/**
 * Official PrizePicks badge multipliers, applied per-pick on top of the base
 * power/flex payout.
 *  - Goblin: 0.65x — easier line, smaller payout
 *  - Demon:  1.5x  — harder line, bigger payout
 *  - none:   1x    — standard 50/50 line
 */
export const BADGE_MULTIPLIERS = {
  demon: 1.5,
  goblin: 0.65,
  none: 1,
} as const;

export function badgeMult(badge: PickBadge | undefined): number {
  if (badge === "demon") return BADGE_MULTIPLIERS.demon;
  if (badge === "goblin") return BADGE_MULTIPLIERS.goblin;
  return BADGE_MULTIPLIERS.none;
}

/** Product of badge multipliers across all picks (used for max/potential). */
export function badgeMultiplierForBadges(
  badges: (PickBadge | undefined)[],
): number {
  return badges.reduce((m, b) => m * badgeMult(b), 1);
}

/** Product of badge multipliers across winning picks only (final payouts). */
export function badgeMultiplierForWins(picks: ParlayPick[]): number {
  return picks.reduce(
    (m, p) => (p.result === "win" ? m * badgeMult(p.badge ?? null) : m),
    1,
  );
}

/** Convenience: settled payout including badge multipliers. */
export function computePayoutWithBadges(
  type: ParlayType,
  picks: ParlayPick[],
  entryAmount: number,
): number {
  const hits = picks.filter((p) => p.result === "win").length;
  const base = computePayout(type, picks.length, hits, entryAmount);
  if (base === 0) return 0;
  return base * badgeMultiplierForWins(picks);
}

/** Convenience: max payout including badge multipliers. */
export function maxPayoutWithBadges(
  type: ParlayType,
  picks: { badge?: PickBadge | null }[],
  entryAmount: number,
): number {
  const base = maxPayout(type, picks.length, entryAmount);
  return (
    base *
    badgeMultiplierForBadges(picks.map((p) => p.badge ?? null))
  );
}
