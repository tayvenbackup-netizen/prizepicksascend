import { useEffect, useRef, useState } from "react";
import searchCircle from "@/assets/major/search-circle.png";
import shareBtn from "@/assets/major/share-btn.png";
import avatarImg from "@/assets/profile-avatar.jpg";
import { useProfile } from "./ProfileContext";
import { EditProfileDialog } from "./EditProfileDialog";
import { ShareParlayBuilder } from "./ShareParlayBuilder";
import { useAccess } from "@/lib/accessContext";

function ProgressRing({
  size,
  stroke,
  progress,
  gapWidth,
}: {
  size: number;
  stroke: number;
  progress: number;
  gapWidth: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, progress));
  const safeGapWidth = Math.min(Math.max(gapWidth, stroke * 4), (r * 2) - stroke * 2);
  const gapAngle = 2 * Math.asin(Math.min(1, safeGapWidth / (2 * r)));
  const gapLen = (gapAngle / (2 * Math.PI)) * c;
  const arcLen = c - gapLen;
  const dash = (clamped / 100) * arcLen;
  const rotation = 90 + (gapAngle * 180) / Math.PI / 2;
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
  const { isAdmin } = useAccess();
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [ringGapWidth, setRingGapWidth] = useState(28);
  const levelBadgeRef = useRef<HTMLDivElement | null>(null);
  const size = 76;

  useEffect(() => {
    const node = levelBadgeRef.current;
    if (!node) return;

    const updateGap = () => setRingGapWidth(node.offsetWidth + 8);
    updateGap();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateGap);
    observer.observe(node);
    return () => observer.disconnect();
  }, [data.level]);

  return (
    <section className="px-4 pt-4">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <ProgressRing size={size} stroke={3} progress={data.progress} gapWidth={ringGapWidth} />
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
          <div ref={levelBadgeRef} className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-[#1a1830] px-1.5 py-[1px] text-[11px] font-bold text-foreground pointer-events-none min-w-[18px] text-center">
            {data.level?.trim() ? data.level : "0"}
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
          {isAdmin && (
            <button
              aria-label="admin panel"
              onClick={() => window.dispatchEvent(new CustomEvent('ascend:open-admin'))}
              className="shrink-0 flex items-center justify-center h-[57px]"
            >
              <img src={searchCircle} alt="search" className="h-[49px] w-[49px] object-contain" draggable={false} />
            </button>
          )}
          <button
            aria-label="share"
            onClick={() => setShareOpen(true)}
            className="shrink-0 flex items-center justify-center h-[63px] -ml-[12px] mt-[3px]"
          >
            <img src={shareBtn} alt="Share" className="h-[78px] w-auto object-contain object-left" draggable={false} />
          </button>
        </div>
      </div>

      <EditProfileDialog open={open} onOpenChange={setOpen} />
      <ShareParlayBuilder open={shareOpen} onClose={() => setShareOpen(false)} />
    </section>
  );
}
