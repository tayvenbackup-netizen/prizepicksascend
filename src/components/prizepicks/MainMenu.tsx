import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight, Info } from "lucide-react";
import teamsBeta from "@/assets/menu/teams-beta.png";
import cultureBeta from "@/assets/menu/culture-beta.png";
import rgBadge from "@/assets/menu/responsible-gaming.png";
import wordmark from "@/assets/menu/prizepicks-wordmark.png";
import { PLogo } from "./PLogo";

const usefulLinks = [
  "Help Center",
  "Request Withdrawal",
  "PicksPass Terms of Service",
  { label: "Responsible Gaming", badge: rgBadge },
  "Transaction Log",
  "Tax Information",
  "Your Statements",
  "Discord Group",
  "Documents",
  "Terms",
  "Privacy Policy",
  "Your Privacy Choices",
  "Settings",
] as const;

function Row({ label, badge }: { label: string; badge?: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between py-[14px] text-left"
    >
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-medium text-white">{label}</span>
        {badge && <img src={badge} alt="" className="h-[22px] w-auto object-contain" />}
      </div>
      <ChevronRight className="h-[18px] w-[18px] text-white/40" strokeWidth={2} />
    </button>
  );
}

export function MainMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.32 }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-[#000208]"
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
          }}
        >
          {/* close */}
          <div className="flex justify-end px-4">
            <button aria-label="Close menu" onClick={onClose} className="p-1.5 text-white">
              <X className="h-[26px] w-[26px]" strokeWidth={2} />
            </button>
          </div>

          <div className="px-4 pt-2">
            {/* Balance card */}
            <section className="rounded-2xl border border-white/10 bg-[#0b0d14] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[14px] text-white/85">PrizePicks Balance</p>
                  <p className="mt-1 text-[28px] font-extrabold leading-none text-white">$0.00</p>
                </div>
                <button aria-label="info" className="text-white/80">
                  <Info className="h-[20px] w-[20px]" strokeWidth={1.8} />
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-[#1a1d29]/80 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#6c2bd9]">
                      <PLogo size={18} />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-white leading-tight">Players</p>
                      <p className="text-[11.5px] text-white/65 leading-tight">For player stats and performance</p>
                    </div>
                  </div>
                  <p className="text-[14px] text-white">$ 0.00</p>
                </div>
                <div className="mt-2.5 flex items-center justify-between pl-3">
                  <div className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 4v8a4 4 0 0 0 4 4h11" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="m15 12 4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1ea7a1]">
                      <PLogo size={18} />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-white leading-tight">Teams & Culture</p>
                      <p className="text-[11.5px] text-white/65 leading-tight">For games and trending topics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] text-white leading-tight">$ 0.00</p>
                    <p className="text-[10.5px] text-white/55 leading-tight">of $ 0.00</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="h-[44px] rounded-full bg-[#1a1d29] text-[15px] font-bold text-white">Withdraw</button>
                <button className="h-[44px] rounded-full bg-[#7c3aed] text-[15px] font-bold text-white">Deposit</button>
              </div>

              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="text-[12.5px] leading-snug text-white/55">
                  Your PrizePicks balance includes all deposits and winnings and is ready to use in Players. Some of it may be available in Teams & Culture depending on your payment method and location.{" "}
                  <span className="text-[#3aa6ff]">Learn more about account balances</span>
                </p>
              </div>
            </section>

            {/* Pick Types */}
            <h3 className="mt-7 text-[15px] font-semibold text-white/55">PrizePicks Pick Types</h3>

            <button className="mt-3 flex h-[58px] w-full items-center gap-3 rounded-2xl border-[1.5px] border-white bg-transparent px-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2a1758]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="10" cy="8" r="3.5"/>
                  <path d="M4 20c1-3.5 3.5-5 6-5s5 1.5 6 5" strokeLinecap="round"/>
                  <path d="m16 11 1.5 1.5L21 9" stroke="#79e54a" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[17px] font-extrabold tracking-wide text-white">PLAYERS</span>
            </button>

            <button className="mt-3 flex h-[58px] w-full items-center rounded-2xl border border-white/10 bg-[#0b0d14] px-3">
              <img src={teamsBeta} alt="Teams Beta" className="h-[34px] w-auto object-contain" />
            </button>

            <button className="mt-3 flex h-[58px] w-full items-center rounded-2xl border border-white/10 bg-[#0b0d14] px-3">
              <img src={cultureBeta} alt="Culture Beta" className="h-[34px] w-auto object-contain" />
            </button>

            {/* Useful links */}
            <h3 className="mt-8 text-[15px] font-semibold text-white/55">Useful Links</h3>
            <div className="mt-1 divide-y divide-white/[0.06]">
              {usefulLinks.map((l, i) =>
                typeof l === "string" ? (
                  <Row key={i} label={l} />
                ) : (
                  <Row key={i} label={l.label} badge={l.badge} />
                ),
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
              <button className="h-[44px] rounded-full bg-[#1a1d29] px-7 text-[15px] font-bold text-white">
                Log Out
              </button>
              <img src={wordmark} alt="PrizePicks" className="h-[26px] w-auto object-contain" />
            </div>

            <p className="mt-5 text-center text-[12px] text-white/45">
              Copyright 2026. All Rights Reserved. PrizePicks Atlanta, GA
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
