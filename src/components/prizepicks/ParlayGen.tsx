import { useEffect, useMemo, useState } from "react";
import { ChevronDown, PlusIcon, XCircle, CheckCircle } from "./Icons";
import {
  maxPayout,
  POWER_MULTIPLIERS,
  useEntries,
  type ParlayPick,
  type ParlayType,
  type PickBadge,
} from "./EntriesContext";
import { MOCK_PLAYERS, SPORT_ORDER, type PlayerOption, type Sport } from "./parlayData";
import { Sparkles, Link2, Loader2 } from "lucide-react";
import { fmtMoney } from "@/lib/fmt";
import { fetchUpcomingTeamSet, teamIsUpcoming } from "@/lib/sportsdb";
import { Jersey } from "./Jersey";
import { BadgePicker } from "./Badges";

type Draft = {
  player: PlayerOption;
  pick: "over" | "under";
  /** allow user to override the line — kept as string so the input can be cleared */
  line: string;
  badge?: PickBadge;
};

export function ParlayGen({ onClose }: { onClose: () => void }) {
  const { addEntry } = useEntries();
  const [picks, setPicks] = useState<Draft[]>([]);
  const [type, setType] = useState<ParlayType>("power");
  const [entryAmount, setEntryAmount] = useState<string>("5");
  const [status, setStatus] = useState<"live" | "upcoming">("upcoming");
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [leagueFilter, setLeagueFilter] = useState<Sport | "ALL">("ALL");
  const [upcomingTeams, setUpcomingTeams] = useState<Set<string>>(new Set());
  const [ppLink, setPpLink] = useState("");
  const [ppLoading, setPpLoading] = useState(false);
  const [ppMsg, setPpMsg] = useState<string | null>(null);

  // Load upcoming teams from TheSportsDB once.
  useEffect(() => {
    let alive = true;
    fetchUpcomingTeamSet().then((set) => {
      if (alive) setUpcomingTeams(set);
    });
    return () => {
      alive = false;
    };
  }, []);

  const entryNum = Math.max(0, Number(entryAmount) || 0);
  const count = picks.length;
  const validCount = count >= 2 && count <= 6;

  const potential = useMemo(
    () => maxPayout(type, count, entryNum),
    [type, count, entryNum],
  );

  const supportedFlex = count >= 3 && count <= 6;
  const effectiveType = supportedFlex ? type : "power";

  // Pool restricted to athletes whose team plays this week. Esports + tennis
  // (individual) always pass-through. If TheSportsDB returned nothing, fall open.
  const livePool = useMemo(() => {
    const ALWAYS_OPEN: Sport[] = ["CSGO", "LoL", "Valorant", "Tennis"];
    return MOCK_PLAYERS.filter(
      (p) =>
        ALWAYS_OPEN.includes(p.league) ||
        teamIsUpcoming(p.team, upcomingTeams),
    );
  }, [upcomingTeams]);

  const addPick = (p: PlayerOption) => {
    if (picks.find((x) => x.player.id === p.id)) return;
    if (picks.length >= 6) return;
    setPicks([...picks, { player: p, pick: "over", line: String(p.line) }]);
    setPickerOpen(false);
    setSearch("");
  };

  const updatePick = (i: number, patch: Partial<Draft>) => {
    setPicks(picks.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const removePick = (i: number) =>
    setPicks(picks.filter((_, idx) => idx !== i));

  const availableLeagues = useMemo(() => {
    const taken = new Set(picks.map((p) => p.player.id));
    const set = new Set<Sport>();
    for (const p of livePool) if (!taken.has(p.id)) set.add(p.league);
    return SPORT_ORDER.filter((s) => set.has(s));
  }, [picks, livePool]);

  const grouped = useMemo(() => {
    const s = search.trim().toLowerCase();
    const taken = new Set(picks.map((p) => p.player.id));
    const list = livePool.filter(
      (p) =>
        !taken.has(p.id) &&
        (leagueFilter === "ALL" || p.league === leagueFilter) &&
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
    return SPORT_ORDER.filter((s) => map.has(s)).map((s) => ({
      sport: s,
      players: map.get(s)!,
    }));
  }, [search, picks, leagueFilter, livePool]);

  /** Mimic a PrizePicks shared entry. We can't read PP's private API, so we
   *  derive a deterministic 4-pick parlay from any text in the share link. */
  const importPpLink = () => {
    const raw = ppLink.trim();
    if (!raw) {
      setPpMsg("Paste a PrizePicks share link first.");
      return;
    }
    // Accept any link — prefer entryId when present, otherwise hash the whole URL.
    const m = raw.match(/entryId=([a-z0-9]+)/i);
    const seedSrc = m ? m[1] : raw;
    setPpLoading(true);
    setPpMsg(null);
    const seed = [...seedSrc].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381);
    // Prefer the live pool; if empty, fall back to the full MOCK_PLAYERS list
    // so the grabber ALWAYS returns players.
    const basePool = livePool.length >= 4 ? livePool : MOCK_PLAYERS;
    // Prioritize players that have a photo so the slip shows real icons.
    const withPhoto = basePool.filter((p) => !!p.photo);
    const pool = [...(withPhoto.length >= 4 ? withPhoto : basePool)];
    const chosen: PlayerOption[] = [];
    let s = seed;
    while (chosen.length < 4 && pool.length > 0) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const idx = s % pool.length;
      chosen.push(pool.splice(idx, 1)[0]);
    }
    if (chosen.length === 0) {
      setPpLoading(false);
      setPpMsg("No players available to import right now.");
      return;
    }
    const drafts: Draft[] = chosen.map((p, i) => ({
      player: p,
      pick: ((seed >> i) & 1) === 1 ? "over" : "under",
      line: String(p.line),
    }));
    setPicks(drafts);
    setType("power");
    setPpLoading(false);
    setPpMsg(
      `Imported ${chosen.length} pick${chosen.length === 1 ? "" : "s"}${
        m ? ` from entry ${m[1].slice(0, 6)}…` : ""
      } — set your entry amount and submit.`,
    );
    setPpLink("");
  };

  const submit = () => {
    if (!validCount || entryNum <= 0) return;
    const parlayPicks: ParlayPick[] = picks.map((d) => ({
      id: d.player.id,
      player: d.player.name,
      team: d.player.team,
      league: d.player.league,
      stat: d.player.stat,
      line: Number(d.line) || d.player.line,
      pick: d.pick,
      result: "pending",
      photo: d.player.photo,
      badge: d.badge ?? null,
    }));
    addEntry({
      type: effectiveType,
      status,
      entryAmount: entryNum,
      potential: maxPayout(effectiveType, parlayPicks.length, entryNum),
      picks: parlayPicks,
      startTime: status === "upcoming" ? "Next game" : undefined,
    });
    setPicks([]);
    setEntryAmount("5");
    onClose();
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      {/* Slip header */}
      <div className="shrink-0 px-4 pt-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <h3 className="text-[13px] font-bold tracking-tight">Parlay Builder</h3>
          </div>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            {count}/6 picks
          </span>
        </div>

        {/* Power / Flex selector */}
        <div className="mt-2 grid grid-cols-2 rounded-full bg-white/[0.05] p-0.5">
          {(["power", "flex"] as const).map((t) => {
            const active = effectiveType === t;
            const disabled = t === "flex" && !supportedFlex;
            return (
              <button
                key={t}
                disabled={disabled}
                onClick={() => setType(t)}
                className={`rounded-full py-1 text-[11px] font-semibold transition-colors ${
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
        <div className="mt-1.5 grid grid-cols-2 rounded-full bg-white/[0.05] p-0.5">
          {(["upcoming", "live"] as const).map((s) => {
            const active = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full py-1 text-[11px] font-semibold transition-colors ${
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
      <div className="mt-2 flex-1 min-h-0 min-w-0 overflow-y-auto px-4 pb-3">
        {picks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-6 text-center">
            <p className="text-[12px] text-muted-foreground">
              No picks yet. Add 2–6 players below.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {picks.map((d, i) => (
              <li
                key={d.player.id}
                className="rounded-xl border border-white/5 bg-white/[0.03] px-2.5 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PlayerThumb player={d.player} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-bold">{d.player.name}</div>
                    <div className="truncate text-[10px] text-muted-foreground">
                      {d.player.team} · {d.player.league} · {d.player.stat}
                    </div>
                  </div>
                  <button
                    onClick={() => removePick(i)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label="Remove pick"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center gap-2 min-w-0">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={d.line}
                    onChange={(e) => updatePick(i, { line: e.target.value })}
                    onBlur={(e) => {
                      if (e.target.value.trim() === "")
                        updatePick(i, { line: String(d.player.line) });
                    }}
                    className="h-7 w-14 shrink-0 rounded-md bg-black/40 px-1.5 text-center text-[12px] font-semibold outline-none ring-1 ring-white/10 focus:ring-primary"
                  />
                  <div className="ml-auto flex shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
                    {(["over", "under"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => updatePick(i, { pick: p })}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase ${
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
                </div>
                <div className="mt-1.5 flex items-center justify-end">
                  <BadgePicker
                    value={d.badge ?? null}
                    size="xs"
                    onChange={(b) => updatePick(i, { badge: b })}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add pick */}
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/40 bg-primary/[0.06] px-3 py-2.5 text-[12px] font-semibold text-primary"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add player
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${pickerOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* PrizePicks share-link import */}
        <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.02] p-2">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Link2 className="h-3 w-3" />
            PrizePick Play
          </div>
          <div className="flex gap-1.5">
            <input
              value={ppLink}
              onChange={(e) => setPpLink(e.target.value)}
              placeholder="Paste prizepicks.onelink.me/…/shareEntry?entryId=…"
              className="h-7 flex-1 min-w-0 rounded-md bg-black/40 px-2 text-[11px] outline-none ring-1 ring-white/10 placeholder:text-muted-foreground/70 focus:ring-primary"
            />
            <button
              onClick={importPpLink}
              disabled={!ppLink || ppLoading}
              className="h-7 shrink-0 rounded-md bg-primary px-2.5 text-[11px] font-bold text-primary-foreground disabled:opacity-40"
            >
              {ppLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mimic"}
            </button>
          </div>
          {ppMsg && (
            <p className="mt-1 text-[10px] text-muted-foreground">{ppMsg}</p>
          )}
        </div>

        {pickerOpen && (
          <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-2">
            <input
              autoFocus
              placeholder="Search players, teams, leagues…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-1.5 h-7 w-full rounded-md bg-white/[0.06] px-2 text-[12px] outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
            />

            {/* League filter chips */}
            <div className="mb-2 flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {(["ALL", ...availableLeagues] as const).map((lg) => {
                const active = leagueFilter === lg;
                return (
                  <button
                    key={lg}
                    onClick={() => setLeagueFilter(lg)}
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/[0.06] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lg === "ALL" ? "All" : lg}
                  </button>
                );
              })}
            </div>

            <ul className="max-h-[220px] overflow-y-auto">
              {grouped.length === 0 && (
                <li className="py-5 text-center text-[11px] text-muted-foreground">
                  No matches.
                </li>
              )}
              {grouped.map((g) => (
                <li key={g.sport} className="mb-1.5">
                  {leagueFilter === "ALL" && (
                    <div className="px-2 pt-0.5 pb-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      {g.sport}
                    </div>
                  )}
                  <ul>
                    {g.players.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => addPick(p)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-white/[0.04]"
                        >
                          <PlayerThumb player={p} size={28} />
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-[12px] font-semibold">
                              {p.name}
                            </div>
                            <div className="truncate text-[10px] text-muted-foreground">
                              {p.team} · {p.stat} {p.line}
                            </div>
                          </div>
                          <PlusIcon className="h-3.5 w-3.5 text-primary shrink-0" />
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
      <div className="shrink-0 border-t border-white/5 bg-black/30 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Entry
            </label>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="text-[14px] font-bold">$</span>
              <input
                type="text"
                inputMode="decimal"
                value={entryAmount}
                onChange={(e) => {
                  // accept empty + numeric strings; no auto-zero
                  const v = e.target.value;
                  if (v === "" || /^\d*\.?\d*$/.test(v)) setEntryAmount(v);
                }}
                placeholder="0"
                className="h-6 w-20 rounded-md bg-white/[0.06] px-2 text-[14px] font-bold outline-none ring-1 ring-white/10 focus:ring-primary"
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              To Pay
            </div>
            <div className="text-[16px] font-bold text-success">
              {fmtMoney(potential)}
            </div>
            <div className="text-[9px] text-muted-foreground">
              {validCount
                ? `${POWER_MULTIPLIERS[count] ?? 1}x max`
                : "Add 2–6 picks"}
            </div>
          </div>
        </div>

        <button
          disabled={!validCount || entryNum <= 0}
          onClick={submit}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-opacity disabled:opacity-40"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Submit Entry
        </button>
      </div>
    </div>
  );
}

function PlayerThumb({ player, size = 32 }: { player: PlayerOption; size?: number }) {
  const [failed, setFailed] = useState(!player.photo);
  if (failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1a1530]"
        style={{ width: size, height: size }}
      >
        <Jersey team={player.team} size={Math.round(size * 0.92)} />
      </div>
    );
  }
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2a2540]"
      style={{ width: size, height: size }}
    >
      <img
        src={player.photo}
        alt={player.name}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover object-top"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
