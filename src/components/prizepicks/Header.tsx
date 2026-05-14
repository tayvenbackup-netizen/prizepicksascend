import { MenuIcon, PLogo } from "./Icons";
import playersPill from "@/assets/major/players-top-nav.png";
import balanceImg from "@/assets/major/balance.png";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
      <div className="flex items-center gap-2.5">
        <button aria-label="menu" className="text-foreground/80">
          <MenuIcon className="h-[22px] w-[22px]" />
        </button>
        <PLogo size={24} />
      </div>

      <button aria-label="players" className="shrink-0">
        <img
          src={playersPill}
          alt="Players"
          className="h-9 w-auto select-none"
          draggable={false}
        />
      </button>

      <button aria-label="balance" className="shrink-0">
        <img
          src={balanceImg}
          alt="$0.00"
          className="h-7 w-auto select-none"
          draggable={false}
        />
      </button>
    </header>
  );
}
