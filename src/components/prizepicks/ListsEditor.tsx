import { useEffect, useState } from "react";
import { Loader2, Check, X, Trophy, Users, Star, Layers as LayersIcon, Plus, Trash2, ListChecks, Award } from "lucide-react";
import {
  useProfile,
  type WinPlayerEntry,
  type PickPlayerEntry,
  type WinLeagueEntry,
  type PickTeamEntry,
  type TopWinEntry,
  type TopWinPlayer,
} from "./ProfileContext";
import { searchPlayer, COMMON_LEAGUES, fetchTeamsForLeague, type TeamHit } from "@/lib/sportsdb";
import { Jersey } from "./Jersey";

type Status = "idle" | "checking" | "ok" | "error";

/** Reusable input row that validates against TheSportsDB before saving. */
function ValidatedRow({
  initial,
  placeholder,
  onResolved,
  preview,
  onClear,
  rightSlot,
}: {
  initial: string;
  placeholder: string;
  onResolved: (q: string) => Promise<{ ok: boolean; msg?: string }>;
  preview: React.ReactNode;
  onClear: () => void;
  rightSlot?: React.ReactNode;
}) {
  const [val, setVal] = useState(initial);
  const [status, setStatus] = useState<Status>(initial ? "ok" : "idle");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setVal(initial);
    setStatus(initial ? "ok" : "idle");
    setMsg(null);
  }, [initial]);

  const verify = async () => {
    const q = val.trim();
    if (!q) {
      setStatus("idle");
      setMsg(null);
      onClear();
      return;
    }
    setStatus("checking");
    setMsg(null);
    const r = await onResolved(q);
    if (r.ok) {
      setStatus("ok");
      setMsg(null);
    } else {
      setStatus("error");
      setMsg(r.msg || "Not found — won't save.");
      onClear();
    }
  };

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] px-2 py-1.5">
      <div className="flex items-center gap-2">
        <div className="shrink-0">{preview}</div>
        <input
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setStatus("idle");
          }}
          onBlur={verify}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          placeholder={placeholder}
          className="h-6 flex-1 min-w-0 bg-transparent text-[12px] font-semibold outline-none placeholder:text-muted-foreground/60"
        />
        {rightSlot}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {status === "checking" && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          {status === "ok" && <Check className="h-3.5 w-3.5 text-success" />}
          {status === "error" && <X className="h-3.5 w-3.5 text-destructive" />}
        </span>
      </div>
      {msg && <p className="mt-0.5 pl-1 text-[9.5px] text-destructive">{msg}</p>}
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      className="h-6 w-12 shrink-0 rounded-md bg-black/40 px-1.5 text-center text-[11px] font-bold outline-none ring-1 ring-white/10 focus:ring-primary"
    />
  );
}

function TeamPicker({
  selected,
  max,
  onChange,
}: {
  selected: PickTeamEntry[];
  max: number;
  onChange: (next: PickTeamEntry[]) => void;
}) {
  const [activeLeague, setActiveLeague] = useState<string>(
    selected[0]?.league || COMMON_LEAGUES[0]?.name || "NBA",
  );
  const [teams, setTeams] = useState<TeamHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTeamsForLeague(activeLeague)
      .then((t) => {
        if (cancelled) return;
        setTeams([...t].sort((a, b) => a.name.localeCompare(b.name)));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [activeLeague]);

  const isSelected = (t: TeamHit) =>
    selected.some((s) => s.league === t.league && s.name === t.name);

  const toggle = (t: TeamHit) => {
    if (isSelected(t)) {
      onChange(selected.filter((s) => !(s.league === t.league && s.name === t.name)));
      return;
    }
    if (selected.length >= max) {
      onChange([...selected.slice(1), { name: t.name, league: t.league, badge: t.badge }]);
      return;
    }
    onChange([...selected, { name: t.name, league: t.league, badge: t.badge }]);
  };

  return (
    <div className="space-y-2">
      <div className="no-scrollbar flex gap-1 overflow-x-auto pb-1">
        {COMMON_LEAGUES.map((lg) => {
          const active = lg.name === activeLeague;
          return (
            <button
              key={lg.name}
              onClick={() => setActiveLeague(lg.name)}
              className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/[0.04] text-muted-foreground hover:text-foreground"
              }`}
            >
              {lg.badge ? (
                <img src={lg.badge} alt="" className="h-3.5 w-3.5 object-contain" />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full bg-white/10" />
              )}
              {lg.name}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-[9.5px] text-muted-foreground">
          Pick up to {max} teams
        </span>
        <span className="text-[10px] font-bold text-[color:var(--primary)]">
          {selected.length}/{max}
        </span>
      </div>

      <div className="max-h-56 overflow-y-auto rounded-lg border border-white/5 bg-black/20 p-1.5">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : teams.length === 0 ? (
          <p className="py-4 text-center text-[10px] text-muted-foreground">
            No teams available for {activeLeague}.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {teams.map((t) => {
              const sel = isSelected(t);
              return (
                <button
                  key={`${t.league}-${t.name}`}
                  onClick={() => toggle(t)}
                  className={`flex flex-col items-center gap-1 rounded-md px-1 py-1.5 transition-all ${
                    sel
                      ? "bg-primary/20 ring-1 ring-[color:var(--primary)]"
                      : "bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                  title={t.name}
                >
                  {t.badge ? (
                    <img src={t.badge} alt={t.name} className="h-7 w-7 object-contain" />
                  ) : (
                    <Jersey team={t.name} size={26} />
                  )}
                  <span className="line-clamp-1 w-full text-center text-[9px] font-semibold">
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-1.5 rounded-md bg-white/[0.03] px-2 py-1.5">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Picked:
          </span>
          {selected.map((s) => (
            <div
              key={`${s.league}-${s.name}`}
              className="flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5"
            >
              {s.badge ? (
                <img src={s.badge} alt="" className="h-3.5 w-3.5 object-contain" />
              ) : (
                <Jersey team={s.name} size={14} />
              )}
              <span className="text-[9.5px] font-semibold">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ListsEditor() {
  const {
    winPlayers, setWinPlayers,
    pickPlayers, setPickPlayers,
    winLeagues, setWinLeagues,
    pickTeams, setPickTeams,
  } = useProfile();
  const [leaguePickerFor, setLeaguePickerFor] = useState<number | null>(null);

  // Ensure target lengths
  const wp: (WinPlayerEntry | null)[] = Array.from({ length: 3 }, (_, i) => winPlayers[i] || null);
  const pp: (PickPlayerEntry | null)[] = Array.from({ length: 5 }, (_, i) => pickPlayers[i] || null);
  const wl: (WinLeagueEntry | null)[] = Array.from({ length: 3 }, (_, i) => winLeagues[i] || null);
  void Array.from({ length: 3 }, (_, i) => pickTeams[i] || null);

  const updateWinPlayer = (i: number, e: WinPlayerEntry | null) => {
    const next = [...wp];
    next[i] = e;
    setWinPlayers(next.filter(Boolean) as WinPlayerEntry[]);
  };
  const updatePickPlayer = (i: number, e: PickPlayerEntry | null) => {
    const next = [...pp];
    next[i] = e;
    setPickPlayers(next.filter(Boolean) as PickPlayerEntry[]);
  };
  const updateWinLeague = (i: number, e: WinLeagueEntry | null) => {
    const next = [...wl];
    next[i] = e;
    setWinLeagues(next.filter(Boolean) as WinLeagueEntry[]);
  };
  // pickTeams updated via TeamPicker

  const sportToLeague = (sport: string): string => {
    const s = sport.toLowerCase();
    if (s.includes("basket")) return "NBA";
    if (s.includes("american foot")) return "NFL";
    if (s.includes("baseball")) return "MLB";
    if (s.includes("ice hockey")) return "NHL";
    if (s.includes("soccer")) return "Soccer";
    if (s.includes("tennis")) return "Tennis";
    return sport.toUpperCase().slice(0, 4);
  };

  return (
    <div className="space-y-3">
      {/* Top Winning Players (3) */}
      <Section title="Top winning players" icon={Trophy}>
        {wp.map((e, i) => {
          return (
            <ValidatedRow
              key={`wp-${i}`}
              initial={e?.name || ""}
              placeholder="Player name (any sport)"
              preview={
                e?.photo ? (
                  <img src={e.photo} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : e ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5">
                    <Jersey team={e.team || e.league} size={22} />
                  </div>
                ) : (
                  <div className="h-7 w-7 rounded-full border border-dashed border-white/15" />
                )
              }
              rightSlot={
                <NumberStepper
                  value={e?.wins ?? 0}
                  onChange={(n) => e && updateWinPlayer(i, { ...e, wins: n })}
                />
              }
              onClear={() => updateWinPlayer(i, null)}
              onResolved={async (q) => {
                const hit = await searchPlayer(q);
                if (!hit) return { ok: false, msg: "Player not found." };
                updateWinPlayer(i, {
                  name: hit.name,
                  league: sportToLeague(hit.sport),
                  team: hit.team,
                  photo: hit.photo,
                  wins: e?.wins ?? 1,
                });
                return { ok: true };
              }}
            />
          );
        })}
      </Section>

      {/* Most Picked Players (5) */}
      <Section title="Most picked players" icon={Users}>
        {pp.map((e, i) => (
          <ValidatedRow
            key={`pp-${i}`}
            initial={e?.name || ""}
            placeholder="Player name (any sport)"
            preview={
              e?.photo ? (
                <img src={e.photo} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : e ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5">
                  <Jersey team={e.team || e.league} size={22} />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-full border border-dashed border-white/15" />
              )
            }
            onClear={() => updatePickPlayer(i, null)}
            onResolved={async (q) => {
              const hit = await searchPlayer(q);
              if (!hit) return { ok: false, msg: "Player not found." };
              updatePickPlayer(i, {
                name: hit.name,
                league: sportToLeague(hit.sport),
                team: hit.team,
                photo: hit.photo,
              });
              return { ok: true };
            }}
          />
        ))}
      </Section>

      {/* Top winning leagues (3) — button picker */}
      <Section title="Top winning leagues" icon={Star}>
        {wl.map((e, i) => (
          <div
            key={`wl-${i}`}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-2 py-1.5"
          >
            <button
              onClick={() => setLeaguePickerFor(leaguePickerFor === i ? null : i)}
              className="flex h-7 flex-1 min-w-0 items-center gap-2 rounded-md bg-black/30 px-2 text-left text-[12px] font-semibold hover:bg-black/40"
            >
              {e?.badge ? (
                <img src={e.badge} alt="" className="h-5 w-5 object-contain" />
              ) : (
                <div className="h-5 w-5 rounded-full bg-white/10" />
              )}
              <span className="truncate">{e?.name || "Choose league"}</span>
            </button>
            <NumberStepper
              value={e?.lineups ?? 0}
              onChange={(n) => e && updateWinLeague(i, { ...e, lineups: n })}
            />
            {e && (
              <button
                onClick={() => updateWinLeague(i, null)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {leaguePickerFor === i && (
              <div className="absolute z-50 mt-32 max-h-48 w-[260px] overflow-y-auto rounded-lg border border-white/10 bg-[#1a1530] p-1 shadow-xl">
                {COMMON_LEAGUES.map((lg) => (
                  <button
                    key={lg.name}
                    onClick={() => {
                      updateWinLeague(i, {
                        name: lg.name,
                        badge: lg.badge,
                        lineups: e?.lineups ?? 1,
                      });
                      setLeaguePickerFor(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-white/[0.06]"
                  >
                    {lg.badge ? (
                      <img src={lg.badge} alt="" className="h-5 w-5 object-contain" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-white/10" />
                    )}
                    <span>{lg.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <p className="px-1 text-[9.5px] text-muted-foreground">
          Tap the league button to choose; set wins on the right.
        </p>
      </Section>

      {/* Most picked teams (3) — pick from league grid */}
      <Section title="Most picked teams" icon={LayersIcon}>
        <TeamPicker
          selected={pickTeams}
          max={3}
          onChange={(next: PickTeamEntry[]) => setPickTeams(next)}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className="h-3 w-3 text-[color:var(--primary)]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
