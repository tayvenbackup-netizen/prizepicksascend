export type SportKey =
  | "NBA"
  | "NFL"
  | "MLB"
  | "NHL"
  | "WNBA"
  | "NCAAM"
  | "NCAAF"
  | "EPL"
  | "MLS"
  | "UCL"
  | "ATP"
  | "WTA"
  | "UFC"
  | "PGA";

export type Market = { id: string; label: string; line: number };

/** Sport-specific market templates with reasonable mock lines. */
const MARKETS: Record<SportKey, Market[]> = {
  NBA: [
    { id: "pts", label: "Points", line: 18.5 },
    { id: "reb", label: "Rebounds", line: 6.5 },
    { id: "ast", label: "Assists", line: 5.5 },
    { id: "pra", label: "Pts+Reb+Ast", line: 32.5 },
    { id: "pr", label: "Pts+Reb", line: 25.5 },
    { id: "pa", label: "Pts+Ast", line: 24.5 },
    { id: "ra", label: "Reb+Ast", line: 12.5 },
    { id: "3pm", label: "3-PT Made", line: 2.5 },
    { id: "stl", label: "Steals", line: 1.5 },
    { id: "blk", label: "Blocks", line: 1.5 },
    { id: "tov", label: "Turnovers", line: 2.5 },
    { id: "dd", label: "Double Double", line: 0.5 },
    { id: "td", label: "Triple Double", line: 0.5 },
  ],
  NFL: [
    { id: "passyd", label: "Passing Yards", line: 235.5 },
    { id: "passtd", label: "Passing TDs", line: 1.5 },
    { id: "rushyd", label: "Rushing Yards", line: 55.5 },
    { id: "recyd", label: "Receiving Yards", line: 55.5 },
    { id: "rec", label: "Receptions", line: 4.5 },
    { id: "anytd", label: "Anytime TD", line: 0.5 },
    { id: "int", label: "Interceptions", line: 0.5 },
    { id: "cmp", label: "Completions", line: 21.5 },
    { id: "lngrec", label: "Longest Reception", line: 18.5 },
  ],
  MLB: [
    { id: "hits", label: "Hits", line: 0.5 },
    { id: "hr", label: "Home Runs", line: 0.5 },
    { id: "rbi", label: "RBIs", line: 0.5 },
    { id: "runs", label: "Runs Scored", line: 0.5 },
    { id: "k", label: "Strikeouts", line: 5.5 },
    { id: "tb", label: "Total Bases", line: 1.5 },
    { id: "bb", label: "Walks", line: 0.5 },
    { id: "sb", label: "Stolen Bases", line: 0.5 },
  ],
  NHL: [
    { id: "goals", label: "Goals", line: 0.5 },
    { id: "assists", label: "Assists", line: 0.5 },
    { id: "points", label: "Points", line: 0.5 },
    { id: "sog", label: "Shots on Goal", line: 2.5 },
    { id: "saves", label: "Saves", line: 26.5 },
    { id: "ppp", label: "Power Play Points", line: 0.5 },
  ],
  WNBA: [
    { id: "pts", label: "Points", line: 14.5 },
    { id: "reb", label: "Rebounds", line: 5.5 },
    { id: "ast", label: "Assists", line: 3.5 },
    { id: "pra", label: "Pts+Reb+Ast", line: 24.5 },
    { id: "3pm", label: "3-PT Made", line: 1.5 },
  ],
  NCAAM: [
    { id: "pts", label: "Points", line: 13.5 },
    { id: "reb", label: "Rebounds", line: 5.5 },
    { id: "ast", label: "Assists", line: 3.5 },
    { id: "pra", label: "Pts+Reb+Ast", line: 22.5 },
    { id: "3pm", label: "3-PT Made", line: 1.5 },
  ],
  NCAAF: [
    { id: "passyd", label: "Passing Yards", line: 215.5 },
    { id: "passtd", label: "Passing TDs", line: 1.5 },
    { id: "rushyd", label: "Rushing Yards", line: 55.5 },
    { id: "recyd", label: "Receiving Yards", line: 55.5 },
    { id: "rec", label: "Receptions", line: 3.5 },
    { id: "anytd", label: "Anytime TD", line: 0.5 },
  ],
  EPL: [
    { id: "shots", label: "Shots", line: 1.5 },
    { id: "sot", label: "Shots on Target", line: 0.5 },
    { id: "goals", label: "Goals", line: 0.5 },
    { id: "assists", label: "Assists", line: 0.5 },
    { id: "passes", label: "Passes Completed", line: 35.5 },
    { id: "tackles", label: "Tackles", line: 1.5 },
  ],
  MLS: [
    { id: "shots", label: "Shots", line: 1.5 },
    { id: "sot", label: "Shots on Target", line: 0.5 },
    { id: "goals", label: "Goals", line: 0.5 },
    { id: "assists", label: "Assists", line: 0.5 },
  ],
  UCL: [
    { id: "shots", label: "Shots", line: 1.5 },
    { id: "sot", label: "Shots on Target", line: 0.5 },
    { id: "goals", label: "Goals", line: 0.5 },
    { id: "assists", label: "Assists", line: 0.5 },
  ],
  ATP: [
    { id: "games", label: "Total Games", line: 22.5 },
    { id: "aces", label: "Aces", line: 5.5 },
    { id: "df", label: "Double Faults", line: 2.5 },
    { id: "sets", label: "Sets Won", line: 1.5 },
  ],
  WTA: [
    { id: "games", label: "Total Games", line: 17.5 },
    { id: "aces", label: "Aces", line: 2.5 },
    { id: "df", label: "Double Faults", line: 2.5 },
    { id: "sets", label: "Sets Won", line: 1.5 },
  ],
  UFC: [
    { id: "sigstr", label: "Significant Strikes", line: 65.5 },
    { id: "td", label: "Takedowns", line: 1.5 },
    { id: "ko", label: "Win by KO/TKO", line: 0.5 },
    { id: "sub", label: "Win by Submission", line: 0.5 },
    { id: "rounds", label: "Total Rounds", line: 2.5 },
  ],
  PGA: [
    { id: "birdies", label: "Birdies (Round)", line: 3.5 },
    { id: "bogeys", label: "Bogeys (Round)", line: 2.5 },
    { id: "score", label: "Round Score", line: 70.5 },
    { id: "top10", label: "Finish Top 10", line: 0.5 },
  ],
};

export const SUPPORTED_SPORTS: { key: SportKey; label: string; team: boolean }[] = [
  { key: "NBA", label: "NBA", team: true },
  { key: "NFL", label: "NFL", team: true },
  { key: "MLB", label: "MLB", team: true },
  { key: "NHL", label: "NHL", team: true },
  { key: "WNBA", label: "WNBA", team: true },
  { key: "NCAAM", label: "NCAAB", team: true },
  { key: "NCAAF", label: "NCAAF", team: true },
  { key: "EPL", label: "EPL", team: true },
  { key: "MLS", label: "MLS", team: true },
  { key: "UCL", label: "UCL", team: true },
  { key: "ATP", label: "ATP", team: false },
  { key: "WTA", label: "WTA", team: false },
  { key: "UFC", label: "MMA", team: false },
  { key: "PGA", label: "Golf", team: false },
];

export function marketsFor(sport: SportKey): Market[] {
  return MARKETS[sport] || [];
}
