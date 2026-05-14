import { MenuIcon, PLogo } from "./Icons";
import playersPill from "@/assets/major/players-pill.png";
import dollarSign from "@/assets/major/dollar-sign.png";
import plusCircle from "@/assets/major/plus-circle.png";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
      <div className="flex items-center gap-2.5">
        <button aria-label="menu" className="text-foreground/80">
          <MenuIcon className="h-[20px] w-[20px]" />
        </button>
        <PLogo size={22} />
      </div>

      <div className="flex items-center justify-center rounded-full border border-white/90 px-3 py-[3px]">
        <img
          src={playersPill}
          alt="Players"
          className="h-[21px] w-auto object-contain"
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
