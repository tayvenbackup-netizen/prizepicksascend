import { createContext, useContext, useState, ReactNode } from "react";

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
  /** Current/final stat value used to fill the progress bar. */
  currentValue?: number;
};

export type ParlayType = "power" | "flex";

export type Entry = {
  id: string;
  type: ParlayType;
  status: "live" | "upcoming";
  entryAmount: number;
  potential: number;
  picks: ParlayPick[];
  startTime?: string;
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

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);

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

/**
 * Power Play (all picks must hit) multipliers used by PrizePicks.
 * 2:3x, 3:5x, 4:10x, 5:20x, 6:25x (1-pick is not a real PP entry; treated as 1x).
 */
export const POWER_MULTIPLIERS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 5,
  4: 10,
  5: 20,
  6: 25,
};

/**
 * Flex Play partial-payout table (1 miss allowed for 4–6 picks, additional misses pay less).
 * Returns { hits: multiplier } for a given pick count.
 */
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

/**
 * Maximum potential payout (all picks hit) used to display "to pay $X" on entry cards.
 */
export function maxPayout(
  type: ParlayType,
  pickCount: number,
  entryAmount: number,
): number {
  return computePayout(type, pickCount, pickCount, entryAmount);
}
