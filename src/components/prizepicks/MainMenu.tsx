import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight, Info } from "lucide-react";
import teamsBeta from "@/assets/menu/teams-beta.png";
import cultureBeta from "@/assets/menu/culture-beta.png";
import rgBadge from "@/assets/menu/responsible-gaming.png";
import wordmark from "@/assets/menu/prizepicks-wordmark.png";
import coinPlayers from "@/assets/menu/coin-players.gif";
import coinTeams from "@/assets/menu/coin-teams.gif";
import { useProfile } from "./ProfileContext";
import { autoComma } from "@/lib/fmt";

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
      className="flex w-full items-center justify-between py-[17px] text-left"
    >
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-white">{label}</span>
        {badge && <img src={badge} alt="" className="h-[18px] w-auto object-contain" />}
      </div>
      <ChevronRight className="h-[15px] w-[15px] text-white/40" strokeWidth={2} />
    </button>
  );
}

export function MainMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data } = useProfile();
  const balance = `$${autoComma(data.balance)}`;

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
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
          }}
        >
          {/* close */}
          <div className="flex justify-end px-4">
            <button aria-label="Close menu" onClick={onClose} className="p-1.5 text-white">
              <X className="h-[22px] w-[22px]" strokeWidth={2} />
            </button>
          </div>

          <div className="px-5 pt-3">
            {/* Balance card */}
            <section className="rounded-2xl border border-white/10 bg-[#0b0d14] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-white/80">PrizePicks Balance</p>
                  <p className="mt-2 text-[26px] font-extrabold leading-none text-white">{balance}</p>
                </div>
                <button aria-label="info" className="text-white/75">
                  <Info className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </button>
              </div>

              <div className="mt-5 rounded-xl bg-[#1a1d29]/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={coinPlayers} alt="" className="h-[28px] w-[28px] rounded-full object-contain" />
                    <div>
                      <p className="text-[13px] font-bold text-white leading-tight">Players</p>
                      <p className="mt-1 text-[11px] text-white/60 leading-tight">For player stats and performance</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-white">{balance}</p>
                </div>
                <div className="mt-4 flex items-center justify-between pl-3">
                  <div className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/55" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 4v8a4 4 0 0 0 4 4h11" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="m15 12 4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <img src={coinTeams} alt="" className="h-[28px] w-[28px] rounded-full object-contain" />
                    <div>
                      <p className="text-[13px] font-bold text-white leading-tight">Teams & Culture</p>
                      <p className="mt-1 text-[11px] text-white/60 leading-tight">For games and trending topics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] text-white leading-tight">{balance}</p>
                    <p className="mt-1 text-[10.5px] text-white/55 leading-tight">of {balance}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="h-[44px] rounded-full bg-[#1a1d29] text-[14px] font-bold text-white">Withdraw</button>
                <button className="h-[44px] rounded-full bg-[#7c3aed] text-[14px] font-bold text-white">Deposit</button>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[11.5px] leading-relaxed text-white/55">
                  Your PrizePicks balance includes all deposits and winnings and is ready to use in Players. Some of it may be available in Teams & Culture depending on your payment method and location.{" "}
                  <span className="text-[#3aa6ff]">Learn more about account balances</span>
                </p>
              </div>
            </section>

            {/* Pick Types */}
            <h3 className="mt-5 text-[12px] font-semibold text-white/55">PrizePicks Pick Types</h3>

            <button className="mt-2 flex h-[46px] w-full items-center gap-2.5 rounded-xl border-[1.5px] border-white bg-transparent px-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[#2a1758]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="10" cy="8" r="3.5"/>
                  <path d="M4 20c1-3.5 3.5-5 6-5s5 1.5 6 5" strokeLinecap="round"/>
                  <path d="m16 11 1.5 1.5L21 9" stroke="#79e54a" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[14px] font-extrabold tracking-wide text-white">PLAYERS</span>
            </button>

            <button className="mt-2 flex h-[46px] w-full items-center rounded-xl border border-white/10 bg-[#0b0d14] px-2.5">
              <img src={teamsBeta} alt="Teams Beta" className="h-[26px] w-auto object-contain" />
            </button>

            <button className="mt-2 flex h-[46px] w-full items-center rounded-xl border border-white/10 bg-[#0b0d14] px-2.5">
              <img src={cultureBeta} alt="Culture Beta" className="h-[26px] w-auto object-contain" />
            </button>

            {/* Useful links */}
            <h3 className="mt-6 text-[12px] font-semibold text-white/55">Useful Links</h3>
            <div className="mt-0.5 divide-y divide-white/[0.06]">
              {usefulLinks.map((l, i) =>
                typeof l === "string" ? (
                  <Row key={i} label={l} />
                ) : (
                  <Row key={i} label={l.label} badge={l.badge} />
                ),
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              <button className="h-[36px] rounded-full bg-[#1a1d29] px-5 text-[13px] font-bold text-white">
                Log Out
              </button>
              <img src={wordmark} alt="PrizePicks" className="h-[20px] w-auto object-contain" />
            </div>

            <p className="mt-4 text-center text-[10.5px] text-white/45">
              Copyright 2026. All Rights Reserved. PrizePicks Atlanta, GA
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
