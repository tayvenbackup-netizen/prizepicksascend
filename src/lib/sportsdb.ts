/**
 * TheSportsDB free integration.
 * Test API key "123" works in-browser (CORS-allowed) for the next-events endpoints.
 * We fetch upcoming events per league to determine which TEAMS are playing this week,
 * then a player pool can be filtered to athletes whose team is in that set.
 */

const KEY = "123"; // free public test key
const BASE = `https://www.thesportsdb.com/api/v1/json/${KEY}`;

// League IDs in TheSportsDB
export const LEAGUE_IDS: Record<string, number> = {
  NBA: 4387,
  NFL: 4391,
  MLB: 4424,
  NHL: 4380,
  WNBA: 4516,
  EPL: 4328, // soccer
  MLS: 4346, // soccer
  ATP: 4464, // tennis
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

/** Cache so we don't hammer the API across renders. */
let cache: { ts: number; teams: Set<string> } | null = null;
const TTL_MS = 10 * 60 * 1000; // 10 min

/** Returns a Set of UPPERCASE team-name fragments playing in upcoming events. */
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
      } catch {
        /* ignore network errors – we'll just fall back to full pool */
      }
    }),
  );
  cache = { ts: Date.now(), teams };
  return teams;
}

/** Normalize team strings for fuzzy matching ("Dallas Mavericks" → "DALLAS MAVERICKS"). */
export function normalize(s: string): string {
  return s.toUpperCase().replace(/\s+/g, " ").trim();
}

/** Match a short team code/name like "DAL" against the upcoming-team set. */
export function teamIsUpcoming(teamShort: string, set: Set<string>): boolean {
  if (set.size === 0) return true; // fail-open if API unavailable
  const t = normalize(teamShort);
  for (const full of set) {
    if (full.includes(t) || t.includes(full)) return true;
    // Match by initials (e.g. "DAL" inside "Dallas Mavericks")
    const initials = full
      .split(" ")
      .map((w) => w[0])
      .join("");
    if (initials.startsWith(t) || t === initials.slice(0, t.length)) return true;
  }
  return false;
}
