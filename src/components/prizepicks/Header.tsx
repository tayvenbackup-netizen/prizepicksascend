import { MenuIcon, PLogo } from "./Icons";
import playersPill from "@/assets/major/players-pill.png";
import dollarSign from "@/assets/major/dollar-sign.png";
import plusCircle from "@/assets/major/plus-circle.png";
import arrowDown from "@/assets/major/arrow-down.png";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
      <div className="flex items-center gap-2 shrink-0">
        <button aria-label="menu" style={{ color: "#93939f" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" className="h-[26px] w-[26px]">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h10" />
          </svg>
        </button>
        <PLogo size={26} />
      </div>

      <div className="flex flex-1 justify-center">
        <div className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-white/95 pl-4 pr-3 py-[7px] min-w-[200px]">
          <img
            src={playersPill}
            alt="Players"
            className="h-[18px] w-auto object-contain"
          />
          <img
            src={arrowDown}
            alt=""
            className="h-[20px] w-[20px] object-contain"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <img src={dollarSign} alt="" className="h-[18px] w-auto object-contain" />
        <span className="text-success text-[13px] font-semibold">0.00</span>
        <img src={plusCircle} alt="add funds" className="h-[18px] w-[18px] object-contain -ml-0.5" />
      </div>
    </header>
  );
}
