import { createContext, useContext, useState, ReactNode } from "react";

export type ProfileData = {
  name: string;
  joinDate: string;
  balance: string;
  followers: string;
  following: string;
  wins: string;
  totalWon: string;
  topWin: string;
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

const defaultData: ProfileData = {
  name: "ascend2k",
  joinDate: "Joined September 2025",
  balance: "0.00",
  followers: "0",
  following: "8",
  wins: "5",
  totalWon: "$325",
  topWin: "$200",
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
  { name: "NBA", badge: "https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg", lineups: 3 },
  { name: "NFL", badge: null, lineups: 1 },
  { name: "COD", badge: null, lineups: 1 },
];

const defaultPickTeams: PickTeamEntry[] = [
  { name: "Nuggets", league: "NBA", badge: "https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg" },
  { name: "Kings", league: "NBA", badge: "https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg" },
  { name: "Celtics", league: "NBA", badge: "https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg" },
  { name: "Knicks", league: "NBA", badge: "https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg" },
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
};

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProfileData>(defaultData);
  const [winPlayers, setWinPlayers] = useState(defaultWinPlayers);
  const [pickPlayers, setPickPlayers] = useState(defaultPickPlayers);
  const [winLeagues, setWinLeagues] = useState(defaultWinLeagues);
  const [pickTeams, setPickTeams] = useState(defaultPickTeams);
  return (
    <ProfileContext.Provider
      value={{
        data, setData,
        winPlayers, setWinPlayers,
        pickPlayers, setPickPlayers,
        winLeagues, setWinLeagues,
        pickTeams, setPickTeams,
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
