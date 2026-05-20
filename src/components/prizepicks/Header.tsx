import { useState } from "react";
import { PLogo } from "./Icons";
import playersPill from "@/assets/major/players-pill.png";
import dollarSign from "@/assets/major/dollar-sign.png";
import plusCircle from "@/assets/major/plus-circle.png";
import arrowDown from "@/assets/major/arrow-down.png";
import { useProfile } from "./ProfileContext";
import { autoComma } from "@/lib/fmt";
import { MainMenu } from "./MainMenu";

export function TopHeader() {
  const { data } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header
        className="flex items-center justify-between gap-2 px-3 pb-2"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)" }}
      >
        <div className="flex items-center shrink-0" style={{ gap: 0 }}>
          <button aria-label="menu" onClick={() => setMenuOpen(true)} style={{ color: "#93939f" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" className="h-[32px] w-[32px]">
              <path d="M4 8h16" />
              <path d="M4 13h16" />
              <path d="M4 18h10" />
            </svg>
          </button>
          <PLogo size={56} />
        </div>

        <div className="flex flex-1 min-w-0 justify-center">
          <div className="flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-white/95 px-2.5 py-[7px] min-w-0 max-w-full overflow-hidden">
            <img
              src={playersPill}
              alt="Players"
              className="h-[18px] w-auto max-w-full object-contain"
              style={{ minWidth: 0, flexShrink: 1 }}
            />
            <img
              src={arrowDown}
              alt=""
              className="h-[20px] w-[20px] shrink-0 object-contain"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1">
          <img src={dollarSign} alt="" className="h-[18px] w-auto shrink-0 object-contain" />
          <span className="text-success text-[13px] font-semibold whitespace-nowrap">{autoComma(data.balance)}</span>
          <img src={plusCircle} alt="add funds" className="h-[28px] w-[28px] shrink-0 object-contain -ml-0.5" />
        </div>
      </header>
      <MainMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
