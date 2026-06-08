import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X, Search, Sparkles, Link2, Loader2, ChevronRight, Plus, Check, Trash2 } from "lucide-react";
import {
  maxPayoutWithBadges as maxPayout,
  POWER_MULTIPLIERS,
  useEntries,
  type ParlayPick,
  type ParlayType,
  type PickBadge,
} from "./EntriesContext";
import { SUPPORTED_SPORTS, marketsFor, type Market, type SportKey } from "@/lib/sportsMarkets";
import { fmtMoney } from "@/lib/fmt";
import { Jersey } from "./Jersey";
import { BadgePicker } from "./Badges";

type Game = {
  id: string;
  date: string; // ISO
  shortLabel: string; // "6/8"
  home: TeamLite;
  away: TeamLite;
};

type TeamLite = {
  id: string;
  name: string;
  abbr: string;
  logo: string | null;
};

type Player = {
  id: string;
  name: string;
  team: string;
  position?: string;
  photo: string | null;
};

type Step =
  | { kind: "sports" }
  | { kind: "games"; sport: SportKey }
  | { kind: "teams"; sport: SportKey; game: Game }
  | { kind: "roster"; sport: SportKey; team: TeamLite; gameLabel: string; startsAt?: string }
  | { kind: "pastTeams"; sport: SportKey }
  | { kind: "markets"; sport: SportKey; player: Player; gameLabel?: string; startsAt?: string };

type Draft = {
  key: string;
  player: Player;
  sport: SportKey;
  market: Market;
  pick: "over" | "under";
  line: string;
  badge?: PickBadge;
  gameLabel?: string;
  startsAt?: string;
};

function fmtShort(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return "";
  }
}

export function ShareParlayBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addEntry } = useEntries();
  const [step, setStep] = useState<Step>({ kind: "sports" });
  const [picks, setPicks] = useState<Draft[]>([]);
  const [type, setType] = useState<ParlayType>("power");
  const [entryAmount, setEntryAmount] = useState("5");
  const [showSlip, setShowSlip] = useState(false);
  const [ppLink, setPpLink] = useState("");
  const [ppMsg, setPpMsg] = useState<string | null>(null);
  const [ppLoading, setPpLoading] = useState(false);
  // Past-pick mode lets the user log a parlay that already happened.
  const [pastMode, setPastMode] = useState(false);
  const [pastDate, setPastDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [results, setResults] = useState<Record<string, "pending" | "win" | "loss">>({});

  useEffect(() => {
    if (!open) {
      setStep({ kind: "sports" });
      setShowSlip(false);
      setPpMsg(null);
      setPpLink("");
      setPastMode(false);
      setResults({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const entryNum = Math.max(0, Number(entryAmount) || 0);
  const count = picks.length;
  const validCount = count >= 2 && count <= 6;
  const supportedFlex = count >= 3 && count <= 6;
  const effectiveType = supportedFlex ? type : "power";
  const potential = useMemo(
    () => maxPayout(effectiveType, picks.map((p) => ({ badge: p.badge ?? null })), entryNum),
    [effectiveType, picks, entryNum],
  );

  const addPick = (d: Draft) => {
    if (picks.length >= 6) return;
    if (picks.find((p) => p.key === d.key)) return;
    setPicks([...picks, d]);
    setStep({ kind: "sports" });
  };

  const removePick = (key: string) => {
    setPicks(picks.filter((p) => p.key !== key));
    setResults((r) => {
      const { [key]: _omit, ...rest } = r;
      return rest;
    });
  };

  const submit = () => {
    if (!validCount || entryNum <= 0) return;
    const parlayPicks: ParlayPick[] = picks.map((d) => ({
      id: d.key,
      player: d.player.name,
      team: d.player.team,
      league: d.sport,
      stat: d.market.label,
      line: Number(d.line) || d.market.line,
      pick: d.pick,
      result: pastMode ? (results[d.key] ?? "pending") : "pending",
      photo: d.player.photo || undefined,
      // Always start neutral; client edits the value later.
      currentValue: 0,
      badge: d.badge ?? null,
      gameLabel: d.gameLabel,
    }));
    // Earliest startsAt across picks becomes the entry's game time.
    const startTimes = picks
      .map((d) => (d.startsAt ? Date.parse(d.startsAt) : NaN))
      .filter((n) => Number.isFinite(n));
    const earliest = startTimes.length ? new Date(Math.min(...startTimes)).toISOString() : undefined;
    addEntry({
      type: effectiveType,
      status: pastMode ? "past" : "upcoming",
      entryAmount: entryNum,
      potential: maxPayout(effectiveType, parlayPicks, entryNum),
      picks: parlayPicks,
      startTime: pastMode
        ? new Date(pastDate).toLocaleDateString()
        : "Next game",
      startsAt: pastMode ? undefined : earliest,
      playedAt: pastMode ? new Date(pastDate).toISOString() : undefined,
    });
    setPicks([]);
    setResults({});
    setEntryAmount("5");
    setPastMode(false);
    onClose();
  };

  /** Mimic a PrizePicks share — we can't read PP's private API, so we just flag the slip. */
  const importPpLink = async () => {
    const raw = ppLink.trim();
    if (!raw) {
      setPpMsg("Paste a PrizePicks share link first.");
      return;
    }
    setPpLoading(true);
    setPpMsg(null);
    setTimeout(() => {
      setPpLoading(false);
      setPpMsg("Official PrizePicks links can't be auto-imported. Build the matching slip below.");
    }, 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="share-builder"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.32 }}
          className="fixed inset-0 z-[70] flex flex-col bg-[#050614]"
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)",
          }}
        >
          <Header
            step={step}
            picks={picks}
            onBack={() => {
              if (step.kind === "markets") {
                if (pastMode) setStep({ kind: "pastTeams", sport: step.sport });
                else setStep({ kind: "roster", sport: step.sport, team: { id: step.player.team, name: step.player.team, abbr: step.player.team, logo: null }, gameLabel: step.gameLabel ?? "" });
              }
              else if (step.kind === "roster") setStep(pastMode ? { kind: "pastTeams", sport: step.sport } : { kind: "sports" });
              else if (step.kind === "pastTeams") setStep({ kind: "sports" });
              else if (step.kind === "teams") setStep({ kind: "games", sport: step.sport });
              else if (step.kind === "games") setStep({ kind: "sports" });
              else onClose();
            }}
            onSlip={() => setShowSlip(true)}
            onClose={onClose}
          />

          <div className="flex-1 min-h-0 overflow-hidden">
            {step.kind === "sports" && (
              <SportsScreen
                pastMode={pastMode}
                onTogglePast={setPastMode}
                onPick={(s) =>
                  setStep(pastMode ? { kind: "pastTeams", sport: s } : { kind: "games", sport: s })
                }
              />
            )}
            {step.kind === "games" && (
              <GamesScreen
                sport={step.sport}
                onPickGame={(g) => setStep({ kind: "teams", sport: step.sport, game: g })}
                onPickAthlete={(p) =>
                  setStep({ kind: "markets", sport: step.sport, player: p })
                }
              />
            )}
            {step.kind === "teams" && (
              <TeamsScreen
                game={step.game}
                onPick={(t) =>
                  setStep({
                    kind: "roster",
                    sport: step.sport,
                    team: t,
                    gameLabel: `${step.game.away.abbr} vs ${step.game.home.abbr} · ${step.game.shortLabel}`,
                  })
                }
              />
            )}
            {step.kind === "pastTeams" && (
              <PastTeamsScreen
                sport={step.sport}
                onPickTeam={(t) =>
                  setStep({ kind: "roster", sport: step.sport, team: t, gameLabel: "" })
                }
                onPickPlayer={(p) =>
                  setStep({ kind: "markets", sport: step.sport, player: p })
                }
              />
            )}
            {step.kind === "roster" && (
              <RosterScreen
                sport={step.sport}
                team={step.team}
                gameLabel={step.gameLabel}
                onPick={(p) => setStep({ kind: "markets", sport: step.sport, player: p, gameLabel: step.gameLabel })}
              />
            )}
            {step.kind === "markets" && (
              <MarketsScreen
                sport={step.sport}
                player={step.player}
                onAdd={(market, pick, line) =>
                  addPick({
                    key: `${step.player.id}-${market.id}`,
                    player: step.player,
                    sport: step.sport,
                    market,
                    pick,
                    line,
                    gameLabel: step.gameLabel,
                  })
                }
              />
            )}
          </div>

          {/* Footer: slip button */}
          <div className="shrink-0 border-t border-white/[0.06] bg-[#0a0d18] px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-white/45">Slip</p>
                <p className="text-[12px] font-bold text-white">
                  {count}/6 picks · {fmtMoney(potential)} max
                </p>
              </div>
              <button
                onClick={() => setShowSlip(true)}
                className="rounded-full bg-[#7c3aed] px-4 py-2 text-[12px] font-bold text-white"
              >
                View Slip
              </button>
            </div>
          </div>

          {/* Slip drawer */}
          <AnimatePresence>
            {showSlip && (
              <motion.div
                key="slip"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.28 }}
                className="absolute inset-x-0 bottom-0 top-[12%] z-[80] flex flex-col rounded-t-2xl border-t border-white/10 bg-[#0a0d18]"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)" }}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#7c3aed]" />
                    <h3 className="text-[14px] font-bold text-white">Parlay Slip</h3>
                    <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/70">
                      {count}/6
                    </span>
                  </div>
                  <button onClick={() => setShowSlip(false)} className="p-1 text-white/70">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Type */}
                <div className="px-4">
                  <div className="grid grid-cols-2 rounded-full bg-white/[0.05] p-0.5">
                    {(["power", "flex"] as const).map((t) => {
                      const active = effectiveType === t;
                      const disabled = t === "flex" && !supportedFlex;
                      return (
                        <button
                          key={t}
                          disabled={disabled}
                          onClick={() => setType(t)}
                          className={`rounded-full py-1.5 text-[11px] font-semibold transition-colors ${
                            active ? "bg-[#7c3aed] text-white" : "text-white/60"
                          } ${disabled ? "opacity-40" : ""}`}
                        >
                          {t === "power" ? "Power Play" : "Flex Play"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Past mode toggle */}
                <div className="mt-2 px-4">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                    <div>
                      <div className="text-[11px] font-bold text-white">Log as past pick</div>
                      <div className="text-[10px] text-white/55">Record an already-played parlay.</div>
                    </div>
                    <button
                      onClick={() => setPastMode((v) => !v)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${pastMode ? "bg-[#7c3aed]" : "bg-white/15"}`}
                      aria-label="Toggle past mode"
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${pastMode ? "left-[18px]" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                  {pastMode && (
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                      <label className="text-[10px] uppercase tracking-wider text-white/55">Date</label>
                      <input
                        type="date"
                        value={pastDate}
                        onChange={(e) => setPastDate(e.target.value)}
                        className="ml-auto h-7 rounded-md bg-black/40 px-2 text-[11px] text-white outline-none ring-1 ring-white/10 focus:ring-[#7c3aed]"
                      />
                    </div>
                  )}
                </div>

                {/* PP import */}
                <div className="mt-3 px-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/55">
                      <Link2 className="h-3 w-3" />
                      Add from PrizePicks Link
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        value={ppLink}
                        onChange={(e) => setPpLink(e.target.value)}
                        placeholder="Paste PrizePicks share link…"
                        className="h-7 flex-1 min-w-0 rounded-md bg-black/40 px-2 text-[11px] text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-[#7c3aed]"
                      />
                      <button
                        onClick={importPpLink}
                        disabled={!ppLink || ppLoading}
                        className="h-7 shrink-0 rounded-md bg-[#7c3aed] px-2.5 text-[11px] font-bold text-white disabled:opacity-40"
                      >
                        {ppLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Import"}
                      </button>
                    </div>
                    {ppMsg && (
                      <p className="mt-1 text-[10px] text-white/55">{ppMsg}</p>
                    )}
                  </div>
                </div>

                {/* Picks */}
                <div className="mt-3 flex-1 overflow-y-auto px-4">
                  {picks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-8 text-center text-[12px] text-white/55">
                      No picks yet. Browse sports and add 2–6 players.
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {picks.map((d) => (
                        <li
                          key={d.key}
                          className="rounded-xl border border-white/5 bg-white/[0.03] px-2.5 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar player={d.player} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[12px] font-bold text-white">
                                {d.player.name}
                              </div>
                              <div className="truncate text-[10px] text-white/55">
                                {d.player.team} · {d.sport} · {d.market.label}
                              </div>
                            </div>
                            <button
                              onClick={() => removePick(d.key)}
                              className="text-white/40 hover:text-red-400"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <input
                              value={d.line}
                              onChange={(e) =>
                                setPicks((arr) =>
                                  arr.map((p) =>
                                    p.key === d.key ? { ...p, line: e.target.value } : p,
                                  ),
                                )
                              }
                              className="h-7 w-16 shrink-0 rounded-md bg-black/40 px-1.5 text-center text-[12px] font-semibold text-white outline-none ring-1 ring-white/10 focus:ring-[#7c3aed]"
                            />
                            <div className="ml-auto flex shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
                              {(["over", "under"] as const).map((p) => (
                                <button
                                  key={p}
                                  onClick={() =>
                                    setPicks((arr) =>
                                      arr.map((x) =>
                                        x.key === d.key ? { ...x, pick: p } : x,
                                      ),
                                    )
                                  }
                                  className={`px-2.5 py-1 text-[10px] font-bold uppercase ${
                                    d.pick === p
                                      ? p === "over"
                                        ? "bg-green-500 text-black"
                                        : "bg-red-500 text-black"
                                      : "text-white/55"
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                              Modifier
                            </span>
                            <BadgePicker
                              value={d.badge ?? null}
                              size="xs"
                              onChange={(b) =>
                                setPicks((arr) =>
                                  arr.map((x) => (x.key === d.key ? { ...x, badge: b } : x)),
                                )
                              }
                            />
                          </div>
                          {pastMode && (
                            <div className="mt-2 flex gap-1">
                              {(["win", "pending", "loss"] as const).map((r) => {
                                const sel = (results[d.key] ?? "pending") === r;
                                return (
                                  <button
                                    key={r}
                                    onClick={() =>
                                      setResults((cur) => ({ ...cur, [d.key]: r }))
                                    }
                                    className={`flex-1 rounded-md py-1 text-[10px] font-bold uppercase ring-1 ${
                                      sel
                                        ? r === "win"
                                          ? "bg-green-500/20 text-green-300 ring-green-400/40"
                                          : r === "loss"
                                          ? "bg-red-500/20 text-red-300 ring-red-400/40"
                                          : "bg-white/10 text-white/80 ring-white/20"
                                        : "text-white/45 ring-white/10"
                                    }`}
                                  >
                                    {r}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/5 bg-black/30 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-[9px] font-semibold uppercase tracking-wider text-white/55">
                        Entry
                      </label>
                      <div className="mt-0.5 flex items-center gap-1">
                        <span className="text-[14px] font-bold text-white">$</span>
                        <input
                          value={entryAmount}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === "" || /^\d*\.?\d*$/.test(v)) setEntryAmount(v);
                          }}
                          className="h-6 w-20 rounded-md bg-white/[0.06] px-2 text-[14px] font-bold text-white outline-none ring-1 ring-white/10 focus:ring-[#7c3aed]"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-white/55">
                        To Pay
                      </div>
                      <div className="text-[16px] font-bold text-green-400">
                        {fmtMoney(potential)}
                      </div>
                      <div className="text-[9px] text-white/55">
                        {validCount
                          ? `${POWER_MULTIPLIERS[count] ?? 1}x max`
                          : "Add 2–6 picks"}
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={!validCount || entryNum <= 0}
                    onClick={submit}
                    className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-[#7c3aed] py-2.5 text-[13px] font-bold text-white shadow-lg shadow-[#7c3aed]/30 disabled:opacity-40"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {pastMode ? "Save Past Entry" : "Submit Entry"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------- Header -------------------- */

function Header({
  step,
  picks,
  onBack,
  onSlip,
  onClose,
}: {
  step: Step;
  picks: Draft[];
  onBack: () => void;
  onSlip: () => void;
  onClose: () => void;
}) {
  const title =
    step.kind === "sports"
      ? "Build Parlay"
      : step.kind === "games"
        ? `${step.sport} · Next 10 Days`
        : step.kind === "teams"
          ? "Pick a team"
          : step.kind === "pastTeams"
            ? `${step.sport} · All Teams`
            : step.kind === "roster"
              ? step.team.name
              : step.kind === "markets"
                ? step.player.name
                : "";
  return (
    <div className="flex shrink-0 items-center gap-2 px-3 pb-2">
      <button onClick={onBack} className="p-1 text-white" aria-label="Back">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="flex-1 truncate text-[15px] font-bold text-white">{title}</h2>
      <button
        onClick={onSlip}
        className="relative rounded-full bg-white/[0.07] px-3 py-1.5 text-[11px] font-bold text-white"
      >
        Slip
        {picks.length > 0 && (
          <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#7c3aed] px-1 text-[9px] font-bold">
            {picks.length}
          </span>
        )}
      </button>
      <button onClick={onClose} className="p-1 text-white/70" aria-label="Close">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

/* -------------------- Sports tabs -------------------- */

function SportsScreen({
  onPick,
  pastMode,
  onTogglePast,
}: {
  onPick: (s: SportKey) => void;
  pastMode: boolean;
  onTogglePast: (v: boolean) => void;
}) {
  return (
    <div className="h-full overflow-y-auto px-4 py-2">
      <div className="mb-3 grid grid-cols-2 rounded-full bg-white/[0.05] p-0.5">
        {([
          { k: false, label: "Live" },
          { k: true, label: "Past Plays" },
        ] as const).map((opt) => {
          const active = pastMode === opt.k;
          return (
            <button
              key={opt.label}
              onClick={() => onTogglePast(opt.k)}
              className={`rounded-full py-1.5 text-[11px] font-bold transition-colors ${
                active ? "bg-[#7c3aed] text-white" : "text-white/60"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="mb-3 text-[11px] text-white/55">
        {pastMode
          ? "Past Plays: log any historical parlay. Browse all teams or search any player who ever played."
          : "Select a sport to see all games scheduled in the next 10 days."}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {SUPPORTED_SPORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => onPick(s.key)}
            className="flex h-[68px] flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white transition-colors hover:bg-white/[0.06]"
          >
            <span className="text-[14px] font-bold">{s.label}</span>
            <span className="mt-0.5 text-[9px] uppercase tracking-wider text-white/45">
              {s.team ? "Teams" : "Individual"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Past Plays: All Teams + cross-league search -------------------- */

const PAST_TEAM_LEAGUES: SportKey[] = ["NBA", "NFL", "MLB", "NHL", "WNBA", "EPL", "MLS"];

function PastTeamsScreen({
  sport,
  onPickTeam,
  onPickPlayer,
}: {
  sport: SportKey;
  onPickTeam: (t: TeamLite) => void;
  onPickPlayer: (p: Player) => void;
}) {
  const [teams, setTeams] = useState<TeamLite[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hits, setHits] = useState<Player[]>([]);
  const supportsTeams = PAST_TEAM_LEAGUES.includes(sport);

  useEffect(() => {
    if (!supportsTeams) {
      setTeams([]);
      return;
    }
    let alive = true;
    setTeams(null);
    setError(null);
    fetch(`/api/public/espn-teams?league=${sport}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const entries: any[] = j?.sports?.[0]?.leagues?.[0]?.teams || [];
        const list: TeamLite[] = entries
          .map((e) => e?.team)
          .filter(Boolean)
          .map((t: any) => ({
            id: t.id,
            name: t.displayName || t.name,
            abbr: t.abbreviation || t.shortDisplayName || "",
            logo: t.logos?.[0]?.href || null,
          }));
        setTeams(list);
      })
      .catch((e) => alive && setError(String(e)));
    return () => {
      alive = false;
    };
  }, [sport, supportsTeams]);

  // Cross-league player search (TheSportsDB) — works for any player who ever played.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    let alive = true;
    setSearching(true);
    const t = setTimeout(() => {
      fetch(`https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((j) => {
          if (!alive) return;
          const players: any[] = j?.player || [];
          const list: Player[] = players.slice(0, 25).map((p) => ({
            id: String(p.idPlayer),
            name: p.strPlayer,
            team: p.strTeam || "—",
            position: p.strPosition || undefined,
            photo: p.strCutout || p.strThumb || p.strRender || null,
          }));
          setHits(list);
        })
        .catch(() => alive && setHits([]))
        .finally(() => alive && setSearching(false));
    }, 220);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query]);

  const filteredTeams = (teams ?? []).filter((t) =>
    !query ? true : t.name.toLowerCase().includes(query.toLowerCase()) || t.abbr.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-3 pb-2">
        <div className="flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search any ${sport} player ever…`}
            className="flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/40"
          />
          {searching && <Loader2 className="h-3 w-3 animate-spin text-white/40" />}
        </div>
        <p className="mt-1.5 text-[10px] text-white/45">
          Tip: typos are okay — we'll match the closest name.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {hits.length > 0 && (
          <>
            <p className="mb-1.5 mt-1 text-[10px] uppercase tracking-wider text-white/45">
              Players · {hits.length}
            </p>
            <ul className="mb-3 space-y-1.5">
              {hits.map((p) => (
                <PlayerRow key={`pl-${p.id}`} player={p} onPick={() => onPickPlayer(p)} />
              ))}
            </ul>
          </>
        )}
        {supportsTeams && (
          <>
            <p className="mb-1.5 text-[10px] uppercase tracking-wider text-white/45">
              All {sport} Teams
            </p>
            {error && <Empty label={`Couldn't load teams: ${error}`} />}
            {!teams && !error && <Loading />}
            {teams && filteredTeams.length === 0 && !query && (
              <Empty label="No teams found." />
            )}
            <ul className="space-y-1.5">
              {filteredTeams.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onPickTeam(t)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-left"
                  >
                    <TeamBadge t={t} />
                    <div className="flex-1 truncate text-[13px] font-bold text-white">
                      {t.name}
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {!supportsTeams && hits.length === 0 && (
          <Empty label={`Search any ${sport} athlete above to add to your past parlay.`} />
        )}
      </div>
    </div>
  );
}

/* -------------------- Games list -------------------- */

function GamesScreen({
  sport,
  onPickGame,
  onPickAthlete,
}: {
  sport: SportKey;
  onPickGame: (g: Game) => void;
  onPickAthlete: (p: Player) => void;
}) {
  const [games, setGames] = useState<Game[] | null>(null);
  const [athletes, setAthletes] = useState<Player[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isTeam = SUPPORTED_SPORTS.find((s) => s.key === sport)?.team ?? true;

  useEffect(() => {
    let alive = true;
    setGames(null);
    setAthletes(null);
    setError(null);
    fetch(`/api/public/espn-scoreboard?league=${sport}&days=10`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const events: any[] = j?.events || [];
        if (isTeam) {
          const list: Game[] = events
            .map((ev) => {
              const comp = ev?.competitions?.[0];
              const cs: any[] = comp?.competitors || [];
              if (cs.length < 2) return null;
              const home = cs.find((c) => c.homeAway === "home") || cs[0];
              const away = cs.find((c) => c.homeAway === "away") || cs[1];
              const toTeam = (c: any): TeamLite => ({
                id: c?.team?.id || "",
                name: c?.team?.displayName || c?.team?.name || "",
                abbr: c?.team?.abbreviation || c?.team?.shortDisplayName || "",
                logo: c?.team?.logo || null,
              });
              return {
                id: String(ev.id),
                date: ev.date,
                shortLabel: fmtShort(ev.date),
                home: toTeam(home),
                away: toTeam(away),
              } as Game;
            })
            .filter((x): x is Game => !!x)
            .sort((a, b) => +new Date(a.date) - +new Date(b.date));
          setGames(list);
        } else {
          // Individual sports: pull athletes from competitor list
          const seen = new Map<string, Player>();
          for (const ev of events) {
            const comp = ev?.competitions?.[0];
            const cs: any[] = comp?.competitors || [];
            for (const c of cs) {
              const a = c?.athlete || c;
              const id = String(a?.id || a?.uid || a?.displayName || "");
              if (!id || seen.has(id)) continue;
              seen.set(id, {
                id,
                name: a?.displayName || a?.shortName || a?.name || "Unknown",
                team: a?.flag?.alt || a?.team?.abbreviation || "—",
                photo: a?.headshot?.href || a?.flag?.href || null,
              });
            }
          }
          setAthletes([...seen.values()]);
        }
      })
      .catch((e) => alive && setError(String(e)));
    return () => { alive = false; };
  }, [sport, isTeam]);

  if (error) {
    return <Empty label={`Couldn't load ${sport}: ${error}`} />;
  }
  if (!games && !athletes) {
    return <Loading />;
  }
  if (isTeam) {
    if (!games || games.length === 0) {
      return <Empty label={`No ${sport} games scheduled in the next 10 days.`} />;
    }
    return (
      <div className="h-full overflow-y-auto px-3 py-2">
        <ul className="space-y-2">
          {games.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => onPickGame(g)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-left"
              >
                <TeamBadge t={g.away} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-bold text-white">
                    {g.away.name} <span className="text-white/45">vs</span> {g.home.name}
                  </div>
                  <div className="mt-0.5 text-[10px] text-white/55">{g.shortLabel}</div>
                </div>
                <TeamBadge t={g.home} />
                <ChevronRight className="h-4 w-4 text-white/40" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  // Individual
  if (!athletes || athletes.length === 0) {
    return <Empty label={`No ${sport} athletes scheduled in the next 10 days.`} />;
  }
  return (
    <div className="h-full overflow-y-auto px-3 py-2">
      <ul className="space-y-1.5">
        {athletes.map((p) => (
          <PlayerRow key={p.id} player={p} onPick={() => onPickAthlete(p)} />
        ))}
      </ul>
    </div>
  );
}

/* -------------------- Team picker -------------------- */

function TeamsScreen({
  game,
  onPick,
}: {
  game: Game;
  onPick: (t: TeamLite) => void;
}) {
  return (
    <div className="h-full overflow-y-auto px-3 py-2">
      <div className="mb-2 text-[11px] text-white/55">{game.shortLabel}</div>
      <ul className="space-y-2">
        {[game.away, game.home].map((t) => (
          <li key={t.id}>
            <button
              onClick={() => onPick(t)}
              className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 text-left"
            >
              <TeamBadge t={t} size={36} />
              <div className="flex-1 truncate text-[13px] font-bold text-white">
                {t.name}
              </div>
              <ChevronRight className="h-4 w-4 text-white/40" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------- Roster -------------------- */

function RosterScreen({
  sport,
  team,
  gameLabel,
  onPick,
}: {
  sport: SportKey;
  team: TeamLite;
  gameLabel: string;
  onPick: (p: Player) => void;
}) {
  const [roster, setRoster] = useState<Player[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    setRoster(null);
    setError(null);
    fetch(
      `/api/public/espn-roster?league=${sport}&team=${encodeURIComponent(team.id)}`,
    )
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const list: Player[] = [];
        // ESPN roster shape: { athletes: [{ items: [...] }] } for football/basketball
        // or { athletes: [...] } directly.
        const groups = Array.isArray(j?.athletes) ? j.athletes : [];
        for (const g of groups) {
          const items = Array.isArray(g?.items) ? g.items : Array.isArray(g) ? g : [g];
          for (const a of items) {
            if (!a || typeof a !== "object" || !a.displayName) continue;
            list.push({
              id: String(a.id || a.uid),
              name: a.displayName,
              team: team.abbr,
              position: a.position?.abbreviation || a.position?.name,
              photo: a.headshot?.href || null,
            });
          }
        }
        setRoster(list);
      })
      .catch((e) => alive && setError(String(e)));
    return () => { alive = false; };
  }, [sport, team.id, team.abbr]);

  if (error) return <Empty label={`Couldn't load roster: ${error}`} />;
  if (!roster) return <Loading />;
  if (roster.length === 0) return <Empty label="No active roster found." />;

  const filtered = query
    ? roster.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : roster;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-3 pb-2">
        {gameLabel && <p className="mb-1.5 text-[10px] uppercase tracking-wider text-white/45">{gameLabel}</p>}
        <div className="flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players…"
            className="flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/40"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1.5 pb-2">
          {filtered.map((p) => (
            <PlayerRow key={p.id} player={p} onPick={() => onPick(p)} />
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------- Markets -------------------- */

function MarketsScreen({
  sport,
  player,
  onAdd,
}: {
  sport: SportKey;
  player: Player;
  onAdd: (m: Market, pick: "over" | "under", line: string) => void;
}) {
  const markets = marketsFor(sport);
  return (
    <div className="h-full overflow-y-auto px-3 py-2">
      <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
        <Avatar player={player} size={44} />
        <div className="min-w-0">
          <div className="truncate text-[14px] font-bold text-white">{player.name}</div>
          <div className="truncate text-[11px] text-white/55">
            {player.team}
            {player.position ? ` · ${player.position}` : ""} · {sport}
          </div>
        </div>
      </div>
      <p className="mb-2 text-[10px] uppercase tracking-wider text-white/45">
        Select a market
      </p>
      <ul className="space-y-1.5">
        {markets.map((m) => (
          <li key={m.id}>
            <MarketRow market={m} onAdd={(pick, line) => onAdd(m, pick, line)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MarketRow({
  market,
  onAdd,
}: {
  market: Market;
  onAdd: (pick: "over" | "under", line: string) => void;
}) {
  const [line, setLine] = useState(String(market.line));
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-white">{market.label}</span>
        <input
          value={line}
          onChange={(e) => setLine(e.target.value)}
          className="h-7 w-16 rounded-md bg-black/40 px-2 text-center text-[12px] font-semibold text-white outline-none ring-1 ring-white/10 focus:ring-[#7c3aed]"
        />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          onClick={() => onAdd("over", line)}
          className="flex items-center justify-center gap-1 rounded-md bg-green-500/15 py-1.5 text-[11px] font-bold uppercase text-green-300"
        >
          <Plus className="h-3 w-3" /> Over
        </button>
        <button
          onClick={() => onAdd("under", line)}
          className="flex items-center justify-center gap-1 rounded-md bg-red-500/15 py-1.5 text-[11px] font-bold uppercase text-red-300"
        >
          <Plus className="h-3 w-3" /> Under
        </button>
      </div>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function Loading() {
  return (
    <div className="flex h-full items-center justify-center text-white/55">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span className="text-[12px]">Loading…</span>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center text-[12px] text-white/55">
      {label}
    </div>
  );
}

function TeamBadge({ t, size = 28 }: { t: TeamLite; size?: number }) {
  if (t.logo) {
    return (
      <img
        src={t.logo}
        alt={t.name}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return <Jersey team={t.abbr || t.name.slice(0, 3)} size={size} />;
}

function Avatar({ player, size = 32 }: { player: Player; size?: number }) {
  const [failed, setFailed] = useState(!player.photo);
  if (failed || !player.photo) {
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

function PlayerRow({ player, onPick }: { player: Player; onPick: () => void }) {
  return (
    <li>
      <button
        onClick={onPick}
        className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.03] px-2.5 py-2 text-left hover:bg-white/[0.05]"
      >
        <Avatar player={player} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-bold text-white">{player.name}</div>
          <div className="truncate text-[10px] text-white/55">
            {player.team}
            {player.position ? ` · ${player.position}` : ""}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </button>
    </li>
  );
}
