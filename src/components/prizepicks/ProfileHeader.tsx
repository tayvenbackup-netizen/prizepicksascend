import { useState } from "react";
import searchCircle from "@/assets/major/search-circle.png";
import shareBtn from "@/assets/major/share-btn.png";
import avatarImg from "@/assets/profile-avatar.jpg";
import { useProfile } from "./ProfileContext";
import { EditProfileDialog } from "./EditProfileDialog";
import { ShareParlayBuilder } from "./ShareParlayBuilder";
import { useAccess } from "@/lib/accessContext";

export function ProfileHeader() {
  const { data } = useProfile();
  const { isAdmin } = useAccess();
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const size = 76;

  return (
    <section className="px-4 pt-4">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full"
            aria-label="Edit profile"
          >
            <img
              src={avatarImg}
              alt="avatar"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
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
