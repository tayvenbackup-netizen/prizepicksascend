/**
 * Sports lookup helpers.
 * Uses a mix of league-specific public feeds because TheSportsDB's generic
 * team search is currently returning incorrect Arsenal-only results.
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
      } catch {
        return;
      }
    }),
  );
  cache = { ts: Date.now(), teams };
  return teams;
}

export function normalize(s: string): string {
  return s.toUpperCase().replace(/\s+/g, " ").trim();
}

function normalizeLoose(s: string): string {
  return normalize(s).replace(/[^A-Z0-9 ]/g, "");
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
    const photo = p.strCutout || p.strThumb || p.strRender || null;
    return {
      name: p.strPlayer,
      team: p.strTeam || "",
      sport: p.strSport || "",
      league: p.strLeague || "",
      photo,
    };
  } catch {
    return null;
  }
}

export type TeamHit = {
  name: string;
  league: string;
  badge: string | null;
};

type TeamSource = {
  aliases: string[];
  label: string;
  badge: string | null;
  fetchTeams: () => Promise<TeamHit[]>;
};

const COMMON_LEAGUE_META: TeamSource[] = [
  {
    label: "NBA",
    aliases: ["NBA", "BASKETBALL"],
    badge: "https://r2.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png",
    fetchTeams: () => fetchEspnTeams("NBA"),
  },
  {
    label: "NFL",
    aliases: ["NFL", "FOOTBALL"],
    badge: "https://r2.thesportsdb.com/images/media/league/badge/g85fqz1662057187.png",
    fetchTeams: () => fetchEspnTeams("NFL"),
  },
  {
    label: "MLB",
    aliases: ["MLB", "BASEBALL"],
    badge: "https://r2.thesportsdb.com/images/media/league/badge/c5r83j1521893739.png",
    fetchTeams: () => fetchEspnTeams("MLB"),
  },
  {
    label: "NHL",
    aliases: ["NHL", "HOCKEY"],
    badge: "https://r2.thesportsdb.com/images/media/league/badge/4cem2k1619616539.png",
    fetchTeams: () => fetchEspnTeams("NHL"),
  },
  {
    label: "WNBA",
    aliases: ["WNBA"],
    badge: "https://r2.thesportsdb.com/images/media/league/badge/47llb31573154455.png",
    fetchTeams: () => fetchEspnTeams("WNBA"),
  },
  {
    label: "EPL",
    aliases: ["EPL", "PREMIERLEAGUE", "PREMIER", "SOCCER"],
    badge: "https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png",
    fetchTeams: () => fetchEspnTeams("EPL"),
  },
  {
    label: "MLS",
    aliases: ["MLS"],
    badge: "https://r2.thesportsdb.com/images/media/league/badge/dqo6r91549878326.png",
    fetchTeams: () => fetchEspnTeams("MLS"),
  },
  {
    label: "ATP",
    aliases: ["ATP", "TENNIS"],
    badge: "https://r2.thesportsdb.com/images/media/league/badge/q7aej51769857150.png",
    fetchTeams: async () => [],
  },
  {
    label: "COD",
    aliases: ["COD", "CDL", "CALLOFDUTY"],
    badge: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Call_of_Duty_League_logo.svg",
    fetchTeams: () => fetchSportsDbLeagueTeams("Call of Duty League", "COD"),
  },
  {
    label: "CSGO",
    aliases: ["CSGO", "CS2", "COUNTERSTRIKE"],
    badge: "https://upload.wikimedia.org/wikipedia/commons/6/6e/CS2_logo.svg",
    fetchTeams: async () =>
      ["FaZe", "Vitality", "Spirit", "G2", "NAVI", "MOUZ", "Heroic", "Team Liquid"].map((name) => ({
        name,
        league: "CSGO",
        badge: null,
      })),
  },
  {
    label: "LoL",
    aliases: ["LOL", "LEAGUEOFLEGENDS"],
    badge: "https://upload.wikimedia.org/wikipedia/commons/0/07/League_of_Legends_2019_vector.svg",
    fetchTeams: async () => {
      const sportsDbTeams = await fetchSportsDbLeagueTeams("League of Legends Championship Series", "LoL");
      return sportsDbTeams.length > 0
        ? sportsDbTeams
        : ["T1", "Gen.G", "G2", "NRG", "Immortals", "Cloud9", "100 Thieves"].map((name) => ({
            name,
            league: "LoL",
            badge: null,
          }));
    },
  },
  {
    label: "Valorant",
    aliases: ["VALORANT", "VAL"],
    badge: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_pink_color_version.svg",
    fetchTeams: async () =>
      ["Sentinels", "Evil Geniuses", "Leviatán", "LOUD", "Fnatic", "Paper Rex"].map((name) => ({
        name,
        league: "Valorant",
        badge: null,
      })),
  },
];

export const COMMON_LEAGUES = COMMON_LEAGUE_META.map(({ label, badge }) => ({
  name: label,
  badge,
}));

const teamCache = new Map<string, Promise<TeamHit[]>>();

async function fetchEspnTeams(league: string): Promise<TeamHit[]> {
  const r = await fetch(`/api/public/espn-teams?league=${encodeURIComponent(league)}`);
  if (!r.ok) return [];
  const j = await r.json();
  const teams = j?.sports?.[0]?.leagues?.[0]?.teams || [];
  return teams
    .map((entry: any) => entry?.team)
    .filter(Boolean)
    .map((team: any) => ({
      name: team.displayName || team.shortDisplayName || team.name,
      league,
      badge: team.logos?.[0]?.href || null,
      abbr: team.abbreviation || "",
      shortName: team.shortDisplayName || "",
    }));
}

async function fetchSportsDbLeagueTeams(leagueName: string, league: string): Promise<TeamHit[]> {
  const r = await fetch(`${BASE}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`);
  if (!r.ok) return [];
  const j = await r.json();
  const teams = j?.teams || [];
  return teams.map((team: any) => ({
    name: team.strTeam,
    league,
    badge: team.strBadge || null,
    abbr: team.strTeamShort || "",
    shortName: team.strAlternate || "",
  }));
}

function resolveLeagueToken(token: string): TeamSource | null {
  const normalized = normalizeLoose(token);
  return COMMON_LEAGUE_META.find((league) => league.aliases.some((alias) => normalizeLoose(alias) === normalized)) || null;
}

function scoreTeamMatch(teamQuery: string, team: TeamHit & { abbr?: string; shortName?: string }): number {
  const query = normalizeLoose(teamQuery);
  const name = normalizeLoose(team.name);
  const shortName = normalizeLoose(team.shortName || "");
  const abbr = normalizeLoose(team.abbr || "");
  if (!query) return 0;
  if (name === query || shortName === query || abbr === query) return 100;
  if (name.endsWith(query) || shortName.endsWith(query)) return 90;
  if (name.includes(query) || shortName.includes(query)) return 75;
  if (query.includes(name) || query.includes(shortName)) return 60;
  if (abbr && query.startsWith(abbr)) return 40;
  return 0;
}

export async function fetchTeamsForLeague(label: string): Promise<TeamHit[]> {
  const league = COMMON_LEAGUE_META.find((l) => l.label === label);
  if (!league) return [];
  const cacheKey = league.label;
  let promise = teamCache.get(cacheKey);
  if (!promise) {
    promise = league.fetchTeams().catch(() => [] as TeamHit[]);
    teamCache.set(cacheKey, promise);
  }
  const teams = await promise;
  if (teams.length === 0) teamCache.delete(cacheKey);
  return teams;
}

export async function searchTeam(query: string, leaguePrefix?: string): Promise<TeamHit | null> {
  if (!leaguePrefix) return null;
  const league = resolveLeagueToken(leaguePrefix);
  if (!league) return null;
  const cacheKey = league.label;
  const promise = teamCache.get(cacheKey) || league.fetchTeams();
  teamCache.set(cacheKey, promise);
  const teams = (await promise) as Array<TeamHit & { abbr?: string; shortName?: string }>;
  if (!teams.length) return null;
  const ranked = teams
    .map((team) => ({ team, score: scoreTeamMatch(query, team) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.team || null;
}

export async function searchTeamByLeague(input: string): Promise<TeamHit | null> {
  const m = input.trim().match(/^(\S+)\s+(.+)$/);
  if (!m) return null;
  const [, leaguePart, teamPart] = m;
  return searchTeam(teamPart, leaguePart);
}
