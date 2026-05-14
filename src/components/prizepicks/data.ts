// Real headshots/logos from official CDNs (NBA / Wikipedia)
const nba = (id: string) =>
  `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`;
const team = (id: string) =>
  `https://cdn.nba.com/logos/nba/${id}/primary/L/logo.svg`;

export const NBA_LOGO =
  "https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg";

export type WinPlayer = { name: string; img: string; hit: boolean };

export const TOP_WINS: {
  type: string;
  payout: string;
  cost: string;
  play: string;
  players: WinPlayer[];
}[] = [
  {
    type: "6-Pick win",
    payout: "$200",
    cost: "$5",
    play: "Power Play",
    players: [
      { name: "Jalen Johnson", img: nba("1630552"), hit: true },
      { name: "Scottie Barnes", img: nba("1630567"), hit: true },
      { name: "Tyrese Maxey", img: nba("1630178"), hit: true },
      { name: "Joel Embiid", img: nba("203954"), hit: true },
      { name: "Josh Giddey", img: nba("1630581"), hit: true },
      { name: "Paolo Banchero", img: nba("1631094"), hit: true },
    ],
  },
  {
    type: "5-Pick win",
    payout: "$20",
    cost: "$0",
    play: "Flex Play",
    players: [
      { name: "Jayson Tatum", img: nba("1628369"), hit: true },
      { name: "Scottie Barnes", img: nba("1630567"), hit: true },
      { name: "Pascal Siakam", img: nba("1627783"), hit: true },
      { name: "Jamal Murray", img: nba("1627750"), hit: true },
      { name: "Jonas Valanciunas", img: nba("202685"), hit: false },
    ],
  },
  {
    type: "2-Pick win",
    payout: "$10",
    cost: "$5",
    play: "Power Play",
    players: [
      { name: "Luka Doncic", img: nba("1629029"), hit: true },
      { name: "Stephen Curry", img: nba("201939"), hit: true },
    ],
  },
];

export const TOP_WINNING_PLAYERS = [
  { name: "Karl-Anthony Towns", league: "NBA", img: nba("1626157"), wins: 2 },
  { name: "Rui Hachimura", league: "NBA", img: nba("1628384"), wins: 1 },
  { name: "Gradey Dick", league: "NBA", img: nba("1641711"), wins: 1 },
];

export const MOST_PICKED_PLAYERS = [
  { name: "Precious Achiuwa", league: "NBA", img: nba("1630173") },
  { name: "DeMar DeRozan", league: "NBA", img: nba("201942") },
  { name: "Karl-Anthony Towns", league: "NBA", img: nba("1626157") },
  { name: "Jalen Brunson", league: "NBA", img: nba("1628973") },
];

export const TOP_LEAGUES = [
  { name: "NBA", lineups: 3, logo: NBA_LOGO, kind: "img" as const },
  { name: "NFL", lineups: 1, logo: "", kind: "nfl" as const },
  { name: "COD", lineups: 1, logo: "", kind: "cod" as const },
];

export const MOST_PICKED_TEAMS = [
  { name: "Nuggets", league: "NBA", logo: team("1610612743") },
  { name: "Kings", league: "NBA", logo: team("1610612758") },
  { name: "Celtics", league: "NBA", logo: team("1610612738") },
  { name: "Knicks", league: "NBA", logo: team("1610612752") },
];
