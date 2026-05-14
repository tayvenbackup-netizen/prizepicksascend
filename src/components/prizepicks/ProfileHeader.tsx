import { PLogo } from "./Icons";
import searchCircle from "@/assets/major/search-circle.png";
import shareBtn from "@/assets/major/share-btn.png";

export function ProfileHeader() {
  return (
    <section className="px-4 pt-4">
      <div className="flex items-start gap-4">
        {/* Avatar with thin ring + level pill */}
        <div className="relative shrink-0">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 72,
              height: 72,
              background: "rgba(255,255,255,0.10)",
              padding: 2,
            }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#7c3aed]">
              <PLogo size={38} />
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-[#1a1830] px-1.5 py-[1px] text-[11px] font-bold text-foreground">
            0
          </div>
        </div>

        <div className="flex-1 pt-1">
          <h1 className="text-[22px] font-bold leading-tight tracking-tight">
            ascend2k
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Joined September 2025
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="flex gap-7">
          <div>
            <div className="text-[18px] font-bold leading-none">0</div>
            <div className="mt-1 text-[13px] text-muted-foreground">followers</div>
          </div>
          <div>
            <div className="text-[18px] font-bold leading-none">8</div>
            <div className="mt-1 text-[13px] text-muted-foreground">following</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="search" className="shrink-0">
            <img src={searchCircle} alt="search" className="h-10 w-10 object-contain" draggable={false} />
          </button>
          <button aria-label="share" className="shrink-0">
            <img src={shareBtn} alt="Share" className="h-10 w-auto object-contain" draggable={false} />
          </button>
        </div>
      </div>
    </section>
  );
}
