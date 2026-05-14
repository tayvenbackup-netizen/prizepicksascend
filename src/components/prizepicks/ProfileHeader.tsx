import { PLogo, SearchIcon, ShareIcon } from "./Icons";

export function ProfileHeader() {
  return (
    <section className="px-4 pt-4">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-surface">
            <PLogo size={44} />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
            0
          </div>
        </div>
        <div className="flex-1 pt-1">
          <h1 className="text-2xl font-bold leading-tight">ascend2k</h1>
          <p className="mt-1 text-sm text-muted-foreground">Joined September 2025</p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="flex gap-7">
          <div>
            <div className="text-xl font-bold leading-none">0</div>
            <div className="mt-1 text-sm text-muted-foreground">followers</div>
          </div>
          <div>
            <div className="text-xl font-bold leading-none">8</div>
            <div className="mt-1 text-sm text-muted-foreground">following</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="search"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-foreground/90"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button className="flex h-11 items-center gap-2 rounded-full bg-surface px-4 text-sm font-semibold">
            <ShareIcon className="h-[18px] w-[18px]" />
            Share
          </button>
        </div>
      </div>
    </section>
  );
}
