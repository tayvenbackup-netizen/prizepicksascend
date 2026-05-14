import { ChevronDown, MenuIcon, PLogo, PlusIcon, UserCheck } from "./Icons";

export function TopHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
      <div className="flex items-center gap-3">
        <button aria-label="menu" className="text-foreground/80">
          <MenuIcon className="h-6 w-6" />
        </button>
        <PLogo size={28} />
      </div>

      <button className="flex h-10 items-center gap-2 rounded-full border border-foreground/90 px-4 text-sm font-extrabold tracking-wide">
        <UserCheck className="h-[18px] w-[18px]" />
        PLAYERS
        <ChevronDown className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1.5">
        <span className="text-success font-semibold">$ 0.00</span>
        <button
          aria-label="add funds"
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-success text-success"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
    </header>
  );
}
