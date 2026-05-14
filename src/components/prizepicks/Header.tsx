import { MenuIcon, PLogo } from "./Icons";
import playersPill from "@/assets/major/players-pill.png";
import dollarSign from "@/assets/major/dollar-sign.png";
import plusCircle from "@/assets/major/plus-circle.png";
import arrowDown from "@/assets/major/arrow-down.png";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
      <div className="flex items-center gap-2 shrink-0">
        <button aria-label="menu" className="text-foreground/90">
          <MenuIcon className="h-[22px] w-[22px]" />
        </button>
        <PLogo size={56} />
      </div>

      <div className="flex flex-1 justify-center">
        <div className="flex items-center justify-center gap-1.5 rounded-full border-[2.5px] border-white/95 pl-4 pr-3 py-[5px] min-w-[185px]">
          <img
            src={playersPill}
            alt="Players"
            className="h-[15px] w-auto object-contain"
          />
          <img
            src={arrowDown}
            alt=""
            className="h-[18px] w-[18px] object-contain"
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
