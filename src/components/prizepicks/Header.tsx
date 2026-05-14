import { ChevronDown, MenuIcon, PLogo, PlusIcon, UserCheck } from "./Icons";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
      <div className="flex items-center gap-2.5">
        <button aria-label="menu" className="text-foreground/80">
          <MenuIcon className="h-[20px] w-[20px]" />
        </button>
        <PLogo size={22} />
      </div>

      <button className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/90 px-3 text-[12px] font-extrabold tracking-wide">
        <UserCheck className="h-[14px] w-[14px]" />
        PLAYERS
        <ChevronDown className="h-3 w-3" />
      </button>

      <div className="flex items-center gap-1">
        <span className="text-success text-[13px] font-semibold">$ 0.00</span>
        <button
          aria-label="add funds"
          className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-success text-success"
        >
          <PlusIcon className="h-3 w-3" strokeWidth={3} />
        </button>
      </div>
    </header>
  );
}
