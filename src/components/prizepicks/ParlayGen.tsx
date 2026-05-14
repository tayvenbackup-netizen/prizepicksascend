import { useMemo, useState } from "react";
import { ChevronDown, PlusIcon, XCircle, CheckCircle } from "./Icons";
import {
  computePayout,
  maxPayout,
  POWER_MULTIPLIERS,
  useEntries,
  type ParlayPick,
  type ParlayType,
} from "./EntriesContext";
import { MOCK_PLAYERS, SPORT_ORDER, type PlayerOption, type Sport } from "./parlayData";
import { Sparkles } from "lucide-react";

type Draft = {
  player: PlayerOption;
  pick: "over" | "under";
  /** allow user to override the line */
  line: number;
};

export function ParlayGen({ onClose }: { onClose: () => void }) {
  const { addEntry } = useEntries();
  const [picks, setPicks] = useState<Draft[]>([]);
  const [type, setType] = useState<ParlayType>("power");
  const [entryAmount, setEntryAmount] = useState<number>(5);
  const [status, setStatus] = useState<"live" | "upcoming">("upcoming");
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const count = picks.length;
  const validCount = count >= 2 && count <= 6;

  const potential = useMemo(
    () => maxPayout(type, count, entryAmount),
    [type, count, entryAmount],
  );

  const supportedFlex = count >= 3 && count <= 6;
  const effectiveType = supportedFlex ? type : "power";

  const addPick = (p: PlayerOption) => {
    if (picks.find((x) => x.player.id === p.id)) return;
    if (picks.length >= 6) return;
    setPicks([...picks, { player: p, pick: "over", line: p.line }]);
    setPickerOpen(false);
    setSearch("");
  };

  const updatePick = (i: number, patch: Partial<Draft>) => {
    setPicks(picks.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const removePick = (i: number) => setPicks(picks.filter((_, idx) => idx !== i));

  const grouped = useMemo(() => {
    const s = search.trim().toLowerCase();
    const taken = new Set(picks.map((p) => p.player.id));
    const list = MOCK_PLAYERS.filter(
      (p) =>
        !taken.has(p.id) &&
        (s === "" ||
          p.name.toLowerCase().includes(s) ||
          p.team.toLowerCase().includes(s) ||
          p.league.toLowerCase().includes(s) ||
          p.stat.toLowerCase().includes(s)),
    );
    const map = new Map<Sport, PlayerOption[]>();
    for (const p of list) {
      if (!map.has(p.league)) map.set(p.league, []);
      map.get(p.league)!.push(p);
    }
    return SPORT_ORDER
      .filter((s) => map.has(s))
      .map((s) => ({ sport: s, players: map.get(s)! }));
  }, [search, picks]);

  const submit = () => {
    if (!validCount || entryAmount <= 0) return;
    const parlayPicks: ParlayPick[] = picks.map((d) => ({
      id: d.player.id,
      player: d.player.name,
      team: d.player.team,
      league: d.player.league,
      stat: d.player.stat,
      line: d.line,
      pick: d.pick,
      result: "pending",
      photo: d.player.photo,
    }));
    addEntry({
      type: effectiveType,
      status,
      entryAmount,
      potential: maxPayout(effectiveType, parlayPicks.length, entryAmount),
      picks: parlayPicks,
      startTime: status === "upcoming" ? "Next game" : undefined,
    });
    setPicks([]);
    setEntryAmount(5);
    onClose();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Slip header */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-[14px] font-bold tracking-tight">Parlay Builder</h3>
          </div>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {count}/6 picks
          </span>
        </div>

        {/* Power / Flex selector */}
        <div className="mt-3 grid grid-cols-2 rounded-full bg-white/[0.05] p-1">
          {(["power", "flex"] as const).map((t) => {
            const active = effectiveType === t;
            const disabled = t === "flex" && !supportedFlex;
            return (
              <button
                key={t}
                disabled={disabled}
                onClick={() => setType(t)}
                className={`rounded-full py-1.5 text-[12px] font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                } ${disabled ? "opacity-40" : ""}`}
              >
                {t === "power" ? "Power Play" : "Flex Play"}
              </button>
            );
          })}
        </div>

        {/* Status */}
        <div className="mt-2 grid grid-cols-2 rounded-full bg-white/[0.05] p-1">
          {(["upcoming", "live"] as const).map((s) => {
            const active = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full py-1.5 text-[12px] font-semibold transition-colors ${
                  active ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                {s === "live" ? "Live" : "Upcoming"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Picks list */}
      <div className="mt-3 flex-1 overflow-y-auto px-5 pb-4">
        {picks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <p className="text-[13px] text-muted-foreground">
              No picks yet. Add 2–6 players below.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {picks.map((d, i) => (
              <li
                key={d.player.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3"
              >
                <PlayerThumb player={d.player} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-bold">{d.player.name}</div>
                  <div className="truncate text-[12px] text-muted-foreground">
                    {d.player.team} · {d.player.league} · {d.player.stat}
                  </div>
                </div>
                <input
                  type="number"
                  step="0.5"
                  value={d.line}
                  onChange={(e) =>
                    updatePick(i, { line: Number(e.target.value) || 0 })
                  }
                  className="h-8 w-16 rounded-md bg-black/40 px-1.5 text-center text-[14px] font-semibold outline-none ring-1 ring-white/10 focus:ring-primary"
                />
                <div className="flex overflow-hidden rounded-md ring-1 ring-white/10">
                  {(["over", "under"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => updatePick(i, { pick: p })}
                      className={`px-2.5 py-1.5 text-[11px] font-bold uppercase ${
                        d.pick === p
                          ? p === "over"
                            ? "bg-success text-background"
                            : "bg-destructive text-background"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => removePick(i)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove pick"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add pick */}
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/[0.06] px-3 py-3 text-[13px] font-semibold text-primary"
        >
          <PlusIcon className="h-4 w-4" />
          Add player
          <ChevronDown
            className={`h-4 w-4 transition-transform ${pickerOpen ? "rotate-180" : ""}`}
          />
        </button>

        {pickerOpen && (
          <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-2">
            <input
              autoFocus
              placeholder="Search players, teams, leagues…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2 h-8 w-full rounded-md bg-white/[0.06] px-2 text-[13px] outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
            />
            <ul className="max-h-[260px] overflow-y-auto">
              {grouped.length === 0 && (
                <li className="py-6 text-center text-[12px] text-muted-foreground">
                  No matches.
                </li>
              )}
              {grouped.map((g) => (
                <li key={g.sport} className="mb-2">
                  <div className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {g.sport}
                  </div>
                  <ul>
                    {g.players.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => addPick(p)}
                          className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left hover:bg-white/[0.04]"
                        >
                          <PlayerThumb player={p} size={32} />
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-[13px] font-semibold">
                              {p.name}
                            </div>
                            <div className="truncate text-[11px] text-muted-foreground">
                              {p.team} · {p.stat} {p.line}
                            </div>
                          </div>
                          <PlusIcon className="h-4 w-4 text-primary" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer / payout */}
      <div className="border-t border-white/5 bg-black/30 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Entry
            </label>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="text-[16px] font-bold">$</span>
              <input
                type="number"
                min={1}
                value={entryAmount}
                onChange={(e) =>
                  setEntryAmount(Math.max(0, Number(e.target.value) || 0))
                }
                className="h-7 w-20 rounded-md bg-white/[0.06] px-2 text-[15px] font-bold outline-none ring-1 ring-white/10 focus:ring-primary"
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              To Pay
            </div>
            <div className="text-[18px] font-bold text-success">
              ${potential.toFixed(2)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {validCount
                ? `${(POWER_MULTIPLIERS[count] ?? 1)}x max`
                : "Add 2–6 picks"}
            </div>
          </div>
        </div>

        <button
          disabled={!validCount || entryAmount <= 0}
          onClick={submit}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-[14px] font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-opacity disabled:opacity-40"
        >
          <CheckCircle className="h-4 w-4" />
          Submit Entry
        </button>
      </div>
    </div>
  );
}

function PlayerThumb({ player, size = 36 }: { player: PlayerOption; size?: number }) {
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2a2540] text-[11px] font-bold"
      style={{ width: size, height: size }}
    >
      {player.photo ? (
        <img
          src={player.photo}
          alt={player.name}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover object-top"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}
      <span className="absolute inset-0 -z-10 flex items-center justify-center">
        {initials}
      </span>
    </div>
  );
}
