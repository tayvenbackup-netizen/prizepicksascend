export type Player = { name: string; team: string; league: string; initials: string; color: string };

export const TOP_WINS = [
  {
    type: "6-Pick win",
    payout: "$200",
    play: "$5 Power Play",
    players: [
      { initials: "JI", color: "#3b82f6", hit: true },
      { initials: "JB", color: "#16a34a", hit: true },
      { initials: "TM", color: "#a855f7", hit: true },
      { initials: "JE", color: "#0ea5e9", hit: true },
      { initials: "JG", color: "#f97316", hit: true },
      { initials: "PB", color: "#ef4444", hit: true },
    ],
  },
  {
    type: "5-Pick win",
    payout: "$20",
    play: "$0 Flex Play",
    players: [
      { initials: "JT", color: "#16a34a", hit: true },
      { initials: "SC", color: "#fbbf24", hit: true },
      { initials: "PS", color: "#dc2626", hit: true },
      { initials: "JI", color: "#1e40af", hit: true },
      { initials: "JV", color: "#7c3aed", hit: false },
    ],
  },
  {
    type: "2-Pick win",
    payout: "$10",
    play: "$5 Power Play",
    players: [
      { initials: "LD", color: "#9333ea", hit: true },
      { initials: "ST", color: "#22c55e", hit: true },
    ],
  },
];

export const TOP_WINNING_PLAYERS = [
  { name: "Karl-Anthony Towns", league: "NBA", initials: "KT", color: "#1d4ed8", wins: 2 },
  { name: "Rui Hachimura", league: "NBA", initials: "RH", color: "#fbbf24", wins: 1 },
  { name: "Gradey Dick", league: "NBA", initials: "GD", color: "#dc2626", wins: 1 },
];

export const MOST_PICKED_PLAYERS = [
  { name: "Precious Achiuwa", league: "NBA", initials: "PA", color: "#1e3a8a" },
  { name: "DeMar DeRozan", league: "NBA", initials: "DD", color: "#7c2d12" },
  { name: "Karl-Anthony Towns", league: "NBA", initials: "KT", color: "#1d4ed8" },
  { name: "Jalen Brunson", league: "NBA", initials: "JB", color: "#0ea5e9" },
];

export const TOP_LEAGUES = [
  { name: "NBA", abbr: "NBA", lineups: 3, bg: "#c8102e" },
  { name: "NFL", abbr: "NFL", lineups: 1, bg: "#013369" },
  { name: "COD", abbr: "COD", lineups: 1, bg: "#0a0a0a" },
];

export const MOST_PICKED_TEAMS = [
  { name: "Nuggets", abbr: "DEN", color: "#fdb927" },
  { name: "Kings", abbr: "SAC", color: "#5a2d81" },
  { name: "Celtics", abbr: "BOS", color: "#007a33" },
  { name: "Knicks", abbr: "NYK", color: "#f58426" },
];
