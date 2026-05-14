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
    // Prefer cutout (transparent headshot, PrizePicks-style), fallback to thumb/render.
    const photo =
      p.strCutout || p.strThumb || p.strRender || null;
    return {
      name: p.strPlayer,
      team: p.strTeam || "",
      sport: p.strSport || "",
      league: "",
      photo,
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

const LEAGUE_ALIASES: Record<string, string[]> = {
  nba: ["nba", "national basketball"],
  nfl: ["nfl", "national football"],
  mlb: ["mlb", "major league baseball"],
  nhl: ["nhl", "national hockey"],
  wnba: ["wnba", "women's national basketball"],
  epl: ["english premier", "premier league"],
  mls: ["mls", "major league soccer"],
  laliga: ["la liga", "spanish la liga", "primera"],
  ucl: ["uefa champions"],
  ufc: ["ufc", "mixed martial"],
  atp: ["atp"],
  csgo: ["counter-strike", "csgo", "cs:go", "cs2"],
  lol: ["league of legends"],
  cod: ["call of duty"],
  valorant: ["valorant"],
};

export async function searchTeam(query: string, leaguePrefix?: string): Promise<TeamHit | null> {
  const q = query.trim();
  if (!q) return null;
  try {
    const r = await fetch(`${BASE}/searchteams.php?t=${encodeURIComponent(q)}`);
    if (!r.ok) return null;
    const j = await r.json();
    const teams: any[] = j?.teams || [];
    if (teams.length === 0) return null;
    let pick = teams[0];
    if (leaguePrefix) {
      const aliases = LEAGUE_ALIASES[leaguePrefix.toLowerCase()] || [leaguePrefix.toLowerCase()];
      const match = teams.find((t) => {
        const lg = (t.strLeague || "").toLowerCase();
        return aliases.some((a) => lg.includes(a));
      });
      if (match) pick = match;
    }
    return {
      name: pick.strTeam,
      league: pick.strLeague || "",
      badge: pick.strBadge || null,
    };
  } catch {
    return null;
  }
}

/** "NBA Celtics" → search "Celtics" filtering to NBA matches. */
export async function searchTeamByLeague(input: string): Promise<TeamHit | null> {
  const m = input.trim().match(/^(\S+)\s+(.+)$/);
  if (!m) return null;
  const [, leaguePart, teamPart] = m;
  const hit = await searchTeam(teamPart, leaguePart);
  return hit;
}

/** Curated list of common leagues with badge URLs (for selector). */
export const COMMON_LEAGUES = [
  { name: "NBA", badge: "https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg" },
  { name: "NFL", badge: "https://upload.wikimedia.org/wikipedia/en/a/a2/National_Football_League_logo.svg" },
  { name: "MLB", badge: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Major_League_Baseball_logo.svg" },
  { name: "NHL", badge: "https://upload.wikimedia.org/wikipedia/en/3/3a/05_NHL_Shield.svg" },
  { name: "WNBA", badge: "https://upload.wikimedia.org/wikipedia/en/8/8a/WNBA_logo.svg" },
  { name: "EPL", badge: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" },
  { name: "MLS", badge: "https://upload.wikimedia.org/wikipedia/commons/3/3c/MLS_crest_logo_RGB_gradient.svg" },
  { name: "La Liga", badge: "https://upload.wikimedia.org/wikipedia/commons/1/13/LaLiga.svg" },
  { name: "UFC", badge: "https://upload.wikimedia.org/wikipedia/commons/9/92/UFC_Logo.svg" },
  { name: "ATP", badge: "https://upload.wikimedia.org/wikipedia/commons/3/30/ATP_Tour_logo.svg" },
  { name: "CSGO", badge: "https://upload.wikimedia.org/wikipedia/commons/6/6e/CS2_logo.svg" },
  { name: "LoL", badge: "https://upload.wikimedia.org/wikipedia/commons/0/07/League_of_Legends_2019_vector.svg" },
];
