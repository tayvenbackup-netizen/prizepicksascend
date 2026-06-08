import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CardBrand } from "./CardLogo";

export type PaymentMethod = {
  id: string;
  brand: CardBrand;
  last4: string;
  exp: string;
};

const defaultPaymentMethods: PaymentMethod[] = [
  { id: "pm-default-1", brand: "mastercard", last4: "6427", exp: "08/28" },
  { id: "pm-default-2", brand: "mastercard", last4: "6976", exp: "06/29" },
];

export type ProfileData = {
  name: string;
  joinDate: string;
  balance: string;
  followers: string;
  following: string;
  wins: string;
  totalWon: string;
  topWin: string;
  level: string;
  progress: number;
};

export type WinPlayerEntry = {
  name: string;
  league: string;
  photo: string | null;
  team: string;
  wins: number;
};

export type PickPlayerEntry = {
  name: string;
  league: string;
  photo: string | null;
  team: string;
};

export type WinLeagueEntry = {
  name: string;
  badge: string | null;
  lineups: number;
};

export type PickTeamEntry = {
  name: string;
  league: string;
  badge: string | null;
};

export type TopWinPlayer = {
  name: string;
  photo: string | null;
  hit: boolean;
};

export type TopWinEntry = {
  pickCount: 2 | 3 | 4 | 5 | 6;
  payout: string;
  cost: string;
  play: string;
  players: TopWinPlayer[];
};

const defaultData: ProfileData = {
  name: "ascend2k",
  joinDate: "Joined September 2025",
  balance: "0.00",
  followers: "0",
  following: "8",
  wins: "5",
  totalWon: "$325",
  topWin: "$200",
  level: "0",
  progress: 75,
};

const defaultWinPlayers: WinPlayerEntry[] = [
  { name: "Karl-Anthony Towns", league: "NBA", team: "MIN", wins: 2,
    photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626157.png" },
  { name: "Rui Hachimura", league: "NBA", team: "LAL", wins: 1,
    photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628384.png" },
  { name: "Gradey Dick", league: "NBA", team: "TOR", wins: 1,
    photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1641711.png" },
];

const defaultPickPlayers: PickPlayerEntry[] = [
  { name: "Precious Achiuwa", league: "NBA", team: "NYK",
    photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630173.png" },
  { name: "DeMar DeRozan", league: "NBA", team: "SAC",
    photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201942.png" },
  { name: "Karl-Anthony Towns", league: "NBA", team: "MIN",
    photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626157.png" },
  { name: "Jalen Brunson", league: "NBA", team: "NYK",
    photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628973.png" },
  { name: "Anthony Edwards", league: "NBA", team: "MIN",
    photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630162.png" },
];

const defaultWinLeagues: WinLeagueEntry[] = [
  { name: "NBA", badge: "https://r2.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png", lineups: 3 },
  { name: "NFL", badge: "https://r2.thesportsdb.com/images/media/league/badge/g85fqz1662057187.png", lineups: 1 },
  { name: "COD", badge: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Call_of_Duty_League_logo.svg", lineups: 1 },
];

const defaultPickTeams: PickTeamEntry[] = [
  { name: "Nuggets", league: "NBA", badge: "https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg" },
  { name: "Kings", league: "NBA", badge: "https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg" },
  { name: "Celtics", league: "NBA", badge: "https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg" },
  { name: "Knicks", league: "NBA", badge: "https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg" },
];

const nbaHead = (id: string) => `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`;

const defaultTopWins: TopWinEntry[] = [
  {
    pickCount: 6, payout: "$200", cost: "$5", play: "Power Play",
    players: [
      { name: "Jalen Johnson", photo: nbaHead("1630552"), hit: true },
      { name: "Scottie Barnes", photo: nbaHead("1630567"), hit: true },
      { name: "Tyrese Maxey", photo: nbaHead("1630178"), hit: true },
      { name: "Joel Embiid", photo: nbaHead("203954"), hit: true },
      { name: "Josh Giddey", photo: nbaHead("1630581"), hit: true },
      { name: "Paolo Banchero", photo: nbaHead("1631094"), hit: true },
    ],
  },
  {
    pickCount: 5, payout: "$20", cost: "$0", play: "Flex Play",
    players: [
      { name: "Jayson Tatum", photo: nbaHead("1628369"), hit: true },
      { name: "Scottie Barnes", photo: nbaHead("1630567"), hit: true },
      { name: "Pascal Siakam", photo: nbaHead("1627783"), hit: true },
      { name: "Jamal Murray", photo: nbaHead("1627750"), hit: true },
      { name: "Jonas Valanciunas", photo: nbaHead("202685"), hit: false },
    ],
  },
  {
    pickCount: 2, payout: "$10", cost: "$5", play: "Power Play",
    players: [
      { name: "Luka Doncic", photo: nbaHead("1629029"), hit: true },
      { name: "Stephen Curry", photo: nbaHead("201939"), hit: true },
    ],
  },
];

type Ctx = {
  data: ProfileData;
  setData: (d: ProfileData) => void;
  winPlayers: WinPlayerEntry[];
  setWinPlayers: (l: WinPlayerEntry[]) => void;
  pickPlayers: PickPlayerEntry[];
  setPickPlayers: (l: PickPlayerEntry[]) => void;
  winLeagues: WinLeagueEntry[];
  setWinLeagues: (l: WinLeagueEntry[]) => void;
  pickTeams: PickTeamEntry[];
  setPickTeams: (l: PickTeamEntry[]) => void;
  topWins: TopWinEntry[];
  setTopWins: (l: TopWinEntry[]) => void;
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (l: PaymentMethod[]) => void;
};

const ProfileContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "pp-profile-state-v1";

type PersistedState = {
  data: ProfileData;
  winPlayers: WinPlayerEntry[];
  pickPlayers: PickPlayerEntry[];
  winLeagues: WinLeagueEntry[];
  pickTeams: PickTeamEntry[];
  topWins: TopWinEntry[];
  paymentMethods: PaymentMethod[];
};

function loadInitialState(): PersistedState {
  const base: PersistedState = {
    data: defaultData,
    winPlayers: defaultWinPlayers,
    pickPlayers: defaultPickPlayers,
    winLeagues: defaultWinLeagues,
    pickTeams: defaultPickTeams,
    topWins: defaultTopWins,
    paymentMethods: defaultPaymentMethods,
  };
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("missing");
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      data: parsed.data ?? base.data,
      winPlayers: parsed.winPlayers ?? base.winPlayers,
      pickPlayers: parsed.pickPlayers ?? base.pickPlayers,
      winLeagues: parsed.winLeagues ?? base.winLeagues,
      pickTeams: parsed.pickTeams ?? base.pickTeams,
      topWins: parsed.topWins ?? base.topWins,
      paymentMethods: parsed.paymentMethods ?? base.paymentMethods,
    };
  } catch {
    return base;
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const initial = loadInitialState();
  const [data, setData] = useState<ProfileData>(initial.data);
  const [winPlayers, setWinPlayers] = useState(initial.winPlayers);
  const [pickPlayers, setPickPlayers] = useState(initial.pickPlayers);
  const [winLeagues, setWinLeagues] = useState(initial.winLeagues);
  const [pickTeams, setPickTeams] = useState(initial.pickTeams);
  const [topWins, setTopWins] = useState(initial.topWins);
  const [paymentMethods, setPaymentMethods] = useState(initial.paymentMethods);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ data, winPlayers, pickPlayers, winLeagues, pickTeams, topWins, paymentMethods }),
    );
  }, [data, winPlayers, pickPlayers, winLeagues, pickTeams, topWins, paymentMethods]);
  return (
    <ProfileContext.Provider
      value={{
        data, setData,
        winPlayers, setWinPlayers,
        pickPlayers, setPickPlayers,
        winLeagues, setWinLeagues,
        pickTeams, setPickTeams,
        topWins, setTopWins,
        paymentMethods, setPaymentMethods,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be inside ProfileProvider");
  return ctx;
}
