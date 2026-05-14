export type Sport = "NBA" | "NFL" | "MLB" | "NHL" | "Soccer" | "Tennis" | "WNBA";

export type PlayerOption = {
  id: string;
  name: string;
  team: string;
  league: Sport;
  stat: string;
  line: number;
  /** initials shown when no photo is loaded */
  photo?: string;
};

/** Realistic-looking starter pool. Replace with live API later. */
export const MOCK_PLAYERS: PlayerOption[] = [
  // NBA
  { id: "nba-1", name: "Luka Doncic", team: "DAL", league: "NBA", stat: "Points", line: 32.5 },
  { id: "nba-2", name: "Jayson Tatum", team: "BOS", league: "NBA", stat: "Pts+Reb+Ast", line: 45.5 },
  { id: "nba-3", name: "Nikola Jokic", team: "DEN", league: "NBA", stat: "Rebounds", line: 12.5 },
  { id: "nba-4", name: "Stephen Curry", team: "GSW", league: "NBA", stat: "3-PT Made", line: 4.5 },
  { id: "nba-5", name: "Anthony Edwards", team: "MIN", league: "NBA", stat: "Points", line: 27.5 },
  { id: "nba-6", name: "Devin Booker", team: "PHX", league: "NBA", stat: "Assists", line: 6.5 },

  // NFL
  { id: "nfl-1", name: "Patrick Mahomes", team: "KC", league: "NFL", stat: "Pass Yards", line: 274.5 },
  { id: "nfl-2", name: "Josh Allen", team: "BUF", league: "NFL", stat: "Pass + Rush Yds", line: 305.5 },
  { id: "nfl-3", name: "CeeDee Lamb", team: "DAL", league: "NFL", stat: "Receiving Yds", line: 82.5 },
  { id: "nfl-4", name: "Christian McCaffrey", team: "SF", league: "NFL", stat: "Rush + Rec Yds", line: 118.5 },

  // WNBA
  { id: "wnba-1", name: "Brittney Sykes", team: "WAS", league: "WNBA", stat: "Points", line: 16.5 },
  { id: "wnba-2", name: "Dominique Malonga", team: "SEA", league: "WNBA", stat: "Rebounds", line: 7.5 },
  { id: "wnba-3", name: "Natasha Hiedeman", team: "MIN", league: "WNBA", stat: "Assists", line: 3.5 },

  // Tennis
  { id: "ten-1", name: "Elena Rybakina", team: "KAZ", league: "Tennis", stat: "Total Games", line: 21.5 },
  { id: "ten-2", name: "Aryna Sabalenka", team: "BLR", league: "Tennis", stat: "Aces", line: 4.5 },

  // Soccer
  { id: "soc-1", name: "Vitinha", team: "PSG", league: "Soccer", stat: "Shots", line: 1.5 },
  { id: "soc-2", name: "Erling Haaland", team: "MCI", league: "Soccer", stat: "Shots on Target", line: 1.5 },
];
