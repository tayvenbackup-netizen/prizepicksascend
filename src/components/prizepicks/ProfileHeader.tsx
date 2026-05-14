import { PLogo } from "./Icons";
import searchCircle from "@/assets/major/search-circle.png";
import shareBtn from "@/assets/major/share-btn.png";

export function ProfileHeader() {
  return (
    <section className="px-4 pt-4">
      <div className="flex items-center gap-4">
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
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
              <PLogo size={68} />
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-[#1a1830] px-1.5 py-[1px] text-[11px] font-bold text-foreground">
            0
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-[19px] font-bold leading-tight tracking-tight">
            ascend2k
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Joined September 2025
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-7">
          <div>
            <div className="text-[16px] font-bold leading-none">0</div>
            <div className="mt-1 text-[11px] text-muted-foreground">followers</div>
          </div>
          <div>
            <div className="text-[16px] font-bold leading-none">8</div>
            <div className="mt-1 text-[11px] text-muted-foreground">following</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button aria-label="search" className="shrink-0 flex items-center justify-center h-[80px]">
            <img src={searchCircle} alt="search" className="h-[72px] w-[72px] object-contain" draggable={false} />
          </button>
          <button aria-label="share" className="shrink-0 flex items-center justify-center h-[80px] -ml-[6px]">
            <img src={shareBtn} alt="Share" className="h-[95px] w-auto object-contain object-left" draggable={false} />
          </button>
        </div>
      </div>
    </section>
  );
}
