import { useState } from "react";
import searchCircle from "@/assets/major/search-circle.png";
import shareBtn from "@/assets/major/share-btn.png";
import avatarImg from "@/assets/profile-avatar.jpg";
import { useProfile } from "./ProfileContext";
import { EditProfileDialog } from "./EditProfileDialog";

function ProgressRing({ size, stroke, progress }: { size: number; stroke: number; progress: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, progress));
  // Gap at bottom-center for the level box; arc starts at the box's right edge
  // and sweeps clockwise around the top back to the box's left edge.
  const arcFraction = 0.82;
  const arcLen = c * arcFraction;
  const gapLen = c - arcLen;
  const dash = (clamped / 100) * arcLen;
  // SVG circle dash starts at 3 o'clock. Rotate so the drawn arc begins
  // immediately to the right of the bottom-center level box.
  const gapAngle = 360 * (1 - arcFraction);
  const rotation = 90 + gapAngle / 2; // points just past 6 o'clock clockwise
  return (
    <svg
      width={size}
      height={size}
      className="absolute inset-0 pointer-events-none"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={stroke}
        strokeDasharray={`${arcLen} ${c}`}
        strokeLinecap="round"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#ffffff"
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c - dash + gapLen}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProfileHeader() {
  const { data } = useProfile();
  const [open, setOpen] = useState(false);
  const size = 76;

  return (
    <section className="px-4 pt-4">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <ProgressRing size={size} stroke={3} progress={data.progress} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute inset-[6px] flex items-center justify-center overflow-hidden rounded-full"
            aria-label="Edit profile"
          >
            <img
              src={avatarImg}
              alt="avatar"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-[#1a1830] px-1.5 py-[1px] text-[11px] font-bold text-foreground pointer-events-none">
            {data.level}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-[19px] font-bold leading-tight tracking-tight">
            {data.name}
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {data.joinDate}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-7">
          <div>
            <div className="text-[16px] font-bold leading-none">{data.followers}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">followers</div>
          </div>
          <div>
            <div className="text-[16px] font-bold leading-none">{data.following}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">following</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button aria-label="search" className="shrink-0 flex items-center justify-center h-[57px]">
            <img src={searchCircle} alt="search" className="h-[49px] w-[49px] object-contain" draggable={false} />
          </button>
          <button aria-label="share" className="shrink-0 flex items-center justify-center h-[63px] -ml-[12px] mt-[3px]">
            <img src={shareBtn} alt="Share" className="h-[78px] w-auto object-contain object-left" draggable={false} />
          </button>
        </div>
      </div>

      <EditProfileDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}
