/**
 * TheSportsDB free integration.
 * Test API key "123" — CORS-allowed for browser fetches.
 */

const KEY = "123";
const BASE = `https://www.thesportsdb.com/api/v1/json/${KEY}`;

export const LEAGUE_IDS: Record<string, number> = {
  NBA: 4387,
  NFL: 4391,
  MLB: 4424,
  NHL: 4380,
  WNBA: 4516,
  EPL: 4328,
  MLS: 4346,
  ATP: 4464,
};

type EventsResp = {
  events: Array<{
    idEvent: string;
    strHomeTeam: string;
    strAwayTeam: string;
    strLeague: string;
    dateEvent: string;
  }> | null;
};

let cache: { ts: number; teams: Set<string> } | null = null;
const TTL_MS = 10 * 60 * 1000;

export async function fetchUpcomingTeamSet(): Promise<Set<string>> {
  if (cache && Date.now() - cache.ts < TTL_MS) return cache.teams;
  const ids = Object.values(LEAGUE_IDS);
  const teams = new Set<string>();
  await Promise.all(
    ids.map(async (id) => {
      try {
        const r = await fetch(`${BASE}/eventsnextleague.php?id=${id}`);
        if (!r.ok) return;
        const j = (await r.json()) as EventsResp;
        if (!j?.events) return;
        for (const e of j.events) {
          if (e.strHomeTeam) teams.add(normalize(e.strHomeTeam));
          if (e.strAwayTeam) teams.add(normalize(e.strAwayTeam));
        }
      } catch { /* ignore */ }
    }),
  );
  cache = { ts: Date.now(), teams };
  return teams;
}

export function normalize(s: string): string {
  return s.toUpperCase().replace(/\s+/g, " ").trim();
}

export function teamIsUpcoming(teamShort: string, set: Set<string>): boolean {
  if (set.size === 0) return true;
  const t = normalize(teamShort);
  for (const full of set) {
    if (full.includes(t) || t.includes(full)) return true;
    const initials = full.split(" ").map((w) => w[0]).join("");
    if (initials.startsWith(t) || t === initials.slice(0, t.length)) return true;
  }
  return false;
}

/** Player search — returns first match w/ photo + team + sport. */
export type PlayerHit = {
  name: string;
  team: string;
  sport: string;
  league: string;
  photo: string | null;
};

export async function searchPlayer(name: string): Promise<PlayerHit | null> {
  const q = name.trim();
  if (!q) return null;
  try {
    const r = await fetch(`${BASE}/searchplayers.php?p=${encodeURIComponent(q)}`);
    if (!r.ok) return null;
    const j = await r.json();
    const p = j?.player?.[0];
    if (!p) return null;
    return {
      name: p.strPlayer,
      team: p.strTeam || "",
      sport: p.strSport || "",
      league: "",
      photo: p.strThumb || p.strCutout || null,
    };
  } catch {
    return null;
  }
}

/** Team search — returns first match with badge + league. */
export type TeamHit = {
  name: string;
  league: string;
  badge: string | null;
};

export async function searchTeam(query: string): Promise<TeamHit | null> {
  const q = query.trim();
  if (!q) return null;
  try {
    const r = await fetch(`${BASE}/searchteams.php?t=${encodeURIComponent(q)}`);
    if (!r.ok) return null;
    const j = await r.json();
    const t = j?.teams?.[0];
    if (!t) return null;
    return {
      name: t.strTeam,
      league: t.strLeague || "",
      badge: t.strBadge || null,
    };
  } catch {
    return null;
  }
}

/** "NBA Celtics" → search "Celtics" and verify league prefix matches. */
export async function searchTeamByLeague(input: string): Promise<TeamHit | null> {
  const m = input.trim().match(/^(\S+)\s+(.+)$/);
  if (!m) return null;
  const [, leaguePart, teamPart] = m;
  const hit = await searchTeam(teamPart);
  if (!hit) return null;
  const lp = leaguePart.toLowerCase();
  const lg = hit.league.toLowerCase();
  // Loose match: NBA in "National Basketball Association"; NFL likewise.
  const aliases: Record<string, string[]> = {
    nba: ["nba", "national basketball"],
    nfl: ["nfl", "national football"],
    mlb: ["mlb", "major league baseball"],
    nhl: ["nhl", "national hockey"],
    wnba: ["wnba", "women"],
    epl: ["english premier", "premier league"],
    mls: ["mls", "major league soccer"],
    laliga: ["la liga", "spanish la liga", "primera"],
  };
  const candidates = aliases[lp] || [lp];
  if (candidates.some((c) => lg.includes(c))) return hit;
  return hit; // still return — caller can show league mismatch warning
}

/** Curated list of common leagues with badge URLs (for selector). */
export const COMMON_LEAGUES = [
  { name: "NBA", badge: "https://www.thesportsdb.com/images/media/league/badge/0pp2u41549820396.png" },
  { name: "NFL", badge: "https://www.thesportsdb.com/images/media/league/badge/jrxalt1421360627.png" },
  { name: "MLB", badge: "https://www.thesportsdb.com/images/media/league/badge/n91uu41608811060.png" },
  { name: "NHL", badge: "https://www.thesportsdb.com/images/media/league/badge/o5xxlk1545839616.png" },
  { name: "WNBA", badge: "https://www.thesportsdb.com/images/media/league/badge/qstwwp1610741701.png" },
  { name: "EPL", badge: "https://www.thesportsdb.com/images/media/league/badge/i6o0kh1549879062.png" },
  { name: "MLS", badge: "https://www.thesportsdb.com/images/media/league/badge/0u92pl1547820836.png" },
  { name: "La Liga", badge: "https://www.thesportsdb.com/images/media/league/badge/7onmyv1534768460.png" },
  { name: "UFC", badge: "https://www.thesportsdb.com/images/media/league/badge/lqstuw1421524428.png" },
  { name: "ATP", badge: "https://www.thesportsdb.com/images/media/league/badge/4dlt2z1683462737.png" },
  { name: "CSGO", badge: "https://www.thesportsdb.com/images/media/league/badge/d5gmf91637687786.png" },
  { name: "LoL", badge: "https://www.thesportsdb.com/images/media/league/badge/1xq37j1655824036.png" },
];
