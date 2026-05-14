import { PLogo, SearchIcon, ShareIcon } from "./Icons";

export function ProfileHeader() {
  return (
    <section className="px-4 pt-5">
      <div className="flex items-start gap-5">
        {/* Avatar with thick ring + level pill */}
        <div className="relative shrink-0">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 88,
              height: 88,
              background: "rgba(255,255,255,0.10)",
              padding: 3,
            }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#7c3aed]">
              <PLogo size={48} />
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-[#1a1830] px-2 py-[2px] text-[12px] font-bold text-foreground">
            0
          </div>
        </div>

        <div className="flex-1 pt-2">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight">ascend2k</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Joined September 2025</p>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="flex gap-8">
          <div>
            <div className="text-[22px] font-bold leading-none">0</div>
            <div className="mt-1.5 text-[15px] text-muted-foreground">followers</div>
          </div>
          <div>
            <div className="text-[22px] font-bold leading-none">8</div>
            <div className="mt-1.5 text-[15px] text-muted-foreground">following</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            aria-label="search"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1c1a2e]"
          >
            <SearchIcon className="h-[22px] w-[22px]" />
          </button>
          <button className="flex h-12 items-center gap-2 rounded-full bg-[#1c1a2e] px-5 text-[15px] font-semibold">
            <ShareIcon className="h-5 w-5" />
            Share
          </button>
        </div>
      </div>
    </section>
  );
}
