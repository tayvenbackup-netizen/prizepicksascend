import { MenuIcon, PLogo } from "./Icons";
import playersPill from "@/assets/major/players-pill.png";
import dollarSign from "@/assets/major/dollar-sign.png";
import plusCircle from "@/assets/major/plus-circle.png";
import arrowDown from "@/assets/major/arrow-down.png";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
      <div className="flex items-center gap-2.5">
        <button aria-label="menu" className="text-foreground/90">
          <MenuIcon className="h-[24px] w-[24px]" />
        </button>
        <PLogo size={64} />
      </div>

      <div className="flex items-center justify-center gap-1.5 rounded-full border-[3px] border-white/90 px-3 py-[3px]">
        <img
          src={playersPill}
          alt="Players"
          className="h-[10px] w-auto object-contain"
        />
        <img
          src={arrowDown}
          alt=""
          className="h-[22px] w-[22px] object-contain"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <img src={dollarSign} alt="" className="h-[14px] w-auto object-contain" />
        <span className="text-success text-[13px] font-semibold">0.00</span>
        <img src={plusCircle} alt="add funds" className="h-5 w-5 object-contain" />
      </div>
    </header>
  );
}
