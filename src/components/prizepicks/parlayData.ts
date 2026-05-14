export type Sport =
  | "NBA"
  | "NFL"
  | "MLB"
  | "NHL"
  | "Soccer"
  | "Tennis"
  | "WNBA"
  | "CSGO"
  | "LoL"
  | "Valorant";

export type PlayerOption = {
  id: string;
  name: string;
  team: string;
  league: Sport;
  stat: string;
  line: number;
  /** profile photo URL */
  photo?: string;
};

const nba = (id: string) =>
  `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`;
const nfl = (id: string) =>
  `https://a.espncdn.com/i/headshots/nfl/players/full/${id}.png`;
const mlb = (id: string) =>
  `https://midfield.mlbstatic.com/v1/people/${id}/spots/120`;
const nhl = (id: string) =>
  `https://assets.nhle.com/mugs/nhl/20232024/${id}.png`;
const wnba = (id: string) =>
  `https://cdn.wnba.com/headshots/wnba/latest/1040x760/${id}.png`;
const soc = (id: string) =>
  `https://a.espncdn.com/i/headshots/soccer/players/full/${id}.png`;
const tennis = (id: string) =>
  `https://a.espncdn.com/i/headshots/tennis/players/full/${id}.png`;

/** Realistic-looking starter pool with real headshots from official CDNs. */
export const MOCK_PLAYERS: PlayerOption[] = [
  // NBA
  { id: "nba-1", name: "Luka Doncic", team: "DAL", league: "NBA", stat: "Points", line: 32.5, photo: nba("1629029") },
  { id: "nba-2", name: "Jayson Tatum", team: "BOS", league: "NBA", stat: "Pts+Reb+Ast", line: 45.5, photo: nba("1628369") },
  { id: "nba-3", name: "Nikola Jokic", team: "DEN", league: "NBA", stat: "Rebounds", line: 12.5, photo: nba("203999") },
  { id: "nba-4", name: "Stephen Curry", team: "GSW", league: "NBA", stat: "3-PT Made", line: 4.5, photo: nba("201939") },
  { id: "nba-5", name: "Anthony Edwards", team: "MIN", league: "NBA", stat: "Points", line: 27.5, photo: nba("1630162") },
  { id: "nba-6", name: "Devin Booker", team: "PHX", league: "NBA", stat: "Assists", line: 6.5, photo: nba("1626164") },
  { id: "nba-7", name: "Giannis Antetokounmpo", team: "MIL", league: "NBA", stat: "Points", line: 30.5, photo: nba("203507") },
  { id: "nba-8", name: "LeBron James", team: "LAL", league: "NBA", stat: "Pts+Reb+Ast", line: 42.5, photo: nba("2544") },
  { id: "nba-9", name: "Joel Embiid", team: "PHI", league: "NBA", stat: "Points", line: 28.5, photo: nba("203954") },
  { id: "nba-10", name: "Tyrese Haliburton", team: "IND", league: "NBA", stat: "Assists", line: 9.5, photo: nba("1630169") },
  { id: "nba-11", name: "Shai Gilgeous-Alexander", team: "OKC", league: "NBA", stat: "Points", line: 31.5, photo: nba("1628983") },
  { id: "nba-12", name: "Victor Wembanyama", team: "SAS", league: "NBA", stat: "Blocks", line: 3.5, photo: nba("1641705") },
  { id: "nba-13", name: "Damian Lillard", team: "MIL", league: "NBA", stat: "Points", line: 24.5, photo: nba("203081") },
  { id: "nba-14", name: "Jaylen Brown", team: "BOS", league: "NBA", stat: "Points", line: 23.5, photo: nba("1627759") },
  { id: "nba-15", name: "Donovan Mitchell", team: "CLE", league: "NBA", stat: "Points", line: 26.5, photo: nba("1628378") },
  { id: "nba-16", name: "Kevin Durant", team: "PHX", league: "NBA", stat: "Points", line: 26.5, photo: nba("201142") },

  // NFL
  { id: "nfl-1", name: "Patrick Mahomes", team: "KC", league: "NFL", stat: "Pass Yards", line: 274.5, photo: nfl("3139477") },
  { id: "nfl-2", name: "Josh Allen", team: "BUF", league: "NFL", stat: "Pass + Rush Yds", line: 305.5, photo: nfl("3918298") },
  { id: "nfl-3", name: "CeeDee Lamb", team: "DAL", league: "NFL", stat: "Receiving Yds", line: 82.5, photo: nfl("4241389") },
  { id: "nfl-4", name: "Christian McCaffrey", team: "SF", league: "NFL", stat: "Rush + Rec Yds", line: 118.5, photo: nfl("3117251") },
  { id: "nfl-5", name: "Lamar Jackson", team: "BAL", league: "NFL", stat: "Pass Yards", line: 232.5, photo: nfl("3916387") },
  { id: "nfl-6", name: "Justin Jefferson", team: "MIN", league: "NFL", stat: "Receiving Yds", line: 88.5, photo: nfl("4262921") },
  { id: "nfl-7", name: "Tyreek Hill", team: "MIA", league: "NFL", stat: "Receiving Yds", line: 84.5, photo: nfl("3116406") },
  { id: "nfl-8", name: "Travis Kelce", team: "KC", league: "NFL", stat: "Receptions", line: 5.5, photo: nfl("15847") },
  { id: "nfl-9", name: "Saquon Barkley", team: "PHI", league: "NFL", stat: "Rush Yards", line: 96.5, photo: nfl("3929630") },
  { id: "nfl-10", name: "Ja'Marr Chase", team: "CIN", league: "NFL", stat: "Receiving Yds", line: 89.5, photo: nfl("4362628") },

  // MLB
  { id: "mlb-1", name: "Aaron Judge", team: "NYY", league: "MLB", stat: "Total Bases", line: 1.5, photo: mlb("592450") },
  { id: "mlb-2", name: "Shohei Ohtani", team: "LAD", league: "MLB", stat: "Hits", line: 1.5, photo: mlb("660271") },
  { id: "mlb-3", name: "Mookie Betts", team: "LAD", league: "MLB", stat: "Total Bases", line: 1.5, photo: mlb("605141") },
  { id: "mlb-4", name: "Juan Soto", team: "NYM", league: "MLB", stat: "Hits + Runs + RBIs", line: 1.5, photo: mlb("665742") },
  { id: "mlb-5", name: "Bobby Witt Jr.", team: "KC", league: "MLB", stat: "Total Bases", line: 1.5, photo: mlb("677951") },

  // NHL
  { id: "nhl-1", name: "Connor McDavid", team: "EDM", league: "NHL", stat: "Shots on Goal", line: 3.5, photo: nhl("8478402") },
  { id: "nhl-2", name: "Nathan MacKinnon", team: "COL", league: "NHL", stat: "Points", line: 1.5, photo: nhl("8477492") },
  { id: "nhl-3", name: "Auston Matthews", team: "TOR", league: "NHL", stat: "Shots on Goal", line: 4.5, photo: nhl("8479318") },
  { id: "nhl-4", name: "Leon Draisaitl", team: "EDM", league: "NHL", stat: "Points", line: 1.5, photo: nhl("8477934") },

  // WNBA
  { id: "wnba-1", name: "A'ja Wilson", team: "LV", league: "WNBA", stat: "Points", line: 26.5, photo: wnba("1628932") },
  { id: "wnba-2", name: "Caitlin Clark", team: "IND", league: "WNBA", stat: "Pts+Reb+Ast", line: 35.5, photo: wnba("1641828") },
  { id: "wnba-3", name: "Breanna Stewart", team: "NY", league: "WNBA", stat: "Points", line: 19.5, photo: wnba("1626188") },
  { id: "wnba-4", name: "Sabrina Ionescu", team: "NY", league: "WNBA", stat: "3-PT Made", line: 3.5, photo: wnba("1629719") },

  // Soccer
  { id: "soc-1", name: "Erling Haaland", team: "MCI", league: "Soccer", stat: "Shots on Target", line: 1.5, photo: soc("239085") },
  { id: "soc-2", name: "Kylian Mbappé", team: "RMA", league: "Soccer", stat: "Shots", line: 3.5, photo: soc("231443") },
  { id: "soc-3", name: "Vinicius Jr.", team: "RMA", league: "Soccer", stat: "Shots", line: 2.5, photo: soc("239288") },
  { id: "soc-4", name: "Bukayo Saka", team: "ARS", league: "Soccer", stat: "Shots", line: 1.5, photo: soc("246295") },

  // Tennis
  { id: "ten-1", name: "Carlos Alcaraz", team: "ESP", league: "Tennis", stat: "Total Games", line: 22.5, photo: tennis("4920779") },
  { id: "ten-2", name: "Aryna Sabalenka", team: "BLR", league: "Tennis", stat: "Aces", line: 4.5, photo: tennis("3855632") },
  { id: "ten-3", name: "Jannik Sinner", team: "ITA", league: "Tennis", stat: "Total Games", line: 21.5, photo: tennis("4920808") },
  { id: "ten-4", name: "Iga Swiatek", team: "POL", league: "Tennis", stat: "Total Games", line: 17.5, photo: tennis("4697052") },
];

export const SPORT_ORDER: Sport[] = ["NBA", "NFL", "MLB", "NHL", "WNBA", "Soccer", "Tennis"];
