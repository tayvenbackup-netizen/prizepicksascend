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

type Ctx = {
  data: ProfileData;
  setData: (d: ProfileData) => void;
};

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProfileData>(defaultData);
  return (
    <ProfileContext.Provider value={{ data, setData }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be inside ProfileProvider");
  return ctx;
}
