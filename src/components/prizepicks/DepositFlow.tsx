import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Info, DollarSign, Check, X, Landmark, Loader2 } from "lucide-react";
import { useProfile, PaymentMethod } from "./ProfileContext";
import { CardLogo, BRAND_LABEL } from "./CardLogo";
import coinPlayers from "@/assets/menu/coin-players.gif";
import coinTeams from "@/assets/menu/coin-teams.gif";
import venmoAsset from "@/assets/payments/venmo.png.asset.json";
import paypalAsset from "@/assets/payments/paypal.png.asset.json";

type Step = "methods" | "card";

function MastercardLogo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[6px] bg-white"
      style={{ width: size + 10, height: size }}
    >
      <span className="relative" style={{ width: size, height: size * 0.62 }}>
        <span
          className="absolute left-0 top-0 rounded-full bg-[#eb001b]"
          style={{ width: size * 0.62, height: size * 0.62 }}
        />
        <span
          className="absolute right-0 top-0 rounded-full bg-[#f79e1b] mix-blend-multiply"
          style={{ width: size * 0.62, height: size * 0.62 }}
        />
      </span>
    </span>
  );
}

function ApplePayLogo() {
  return (
    <span className="inline-flex h-7 w-12 items-center justify-center rounded-[6px] bg-white text-black">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M17.5 12.5c0-2.3 1.9-3.4 2-3.4-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 2.9-.7 1.3 0 1.8.7 3 .7 1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.5 1.2-2.5s-2.4-.9-2.4-3.6zM15.3 5.9c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2z"/>
      </svg>
      <span className="ml-0.5 text-[11px] font-semibold">Pay</span>
    </span>
  );
}

function VenmoLogo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center overflow-hidden rounded-[6px] bg-white"
      style={{ width: size, height: size }}
    >
      <img src={venmoAsset.url} alt="Venmo" className="h-full w-full object-contain" />
    </span>
  );
}

function PaypalLogo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center overflow-hidden rounded-[6px] bg-white"
      style={{ width: size, height: size }}
    >
      <img src={paypalAsset.url} alt="PayPal" className="h-[78%] w-[78%] object-contain" />
    </span>
  );
}

const QUICK = [25, 100, 250, 500];

export function DepositFlow({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: (amount: number) => void;
}) {
  const { data } = useProfile();
  const balance = data.balance;
  const [step, setStep] = useState<Step>("methods");
  const [dir, setDir] = useState(1);
  const [amount, setAmount] = useState("100");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("methods");
    setDir(1);
    setAmount("100");
    setCvv("");
    setProcessing(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const back = () => {
    setDir(-1);
    if (step === "methods") onClose();
    else setStep("methods");
  };

  const go = (next: Step) => {
    setDir(1);
    setStep(next);
  };

  const slide = {
    initial: (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
    animate: { x: 0 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%" }),
  };

  const amt = parseFloat(amount) || 0;
  const canDeposit = cvv.length >= 3 && amt > 0 && !processing;

  const handleDeposit = () => {
    if (!canDeposit) return;
    setProcessing(true);
    setTimeout(() => {
      onClose();
      onSubmitted(amt);
    }, 1600);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="deposit-shell"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.32 }}
          className="fixed inset-0 z-[70] overflow-hidden bg-[#050614]"
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
          }}
        >
          <AnimatePresence custom={dir} mode="popLayout" initial={false}>
            {step === "methods" && (
              <motion.div
                key="methods"
                custom={dir}
                variants={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.32 }}
                className="absolute inset-0 overflow-y-auto"
                style={{
                  paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
                  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
                }}
              >
                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={back} aria-label="Back" className="text-white">
                      <ArrowLeft className="h-6 w-6" strokeWidth={2} />
                    </button>
                    <h1 className="text-[20px] font-extrabold text-white">Deposit</h1>
                  </div>
                  <button aria-label="info" className="text-white/85">
                    <Info className="h-[20px] w-[20px]" strokeWidth={1.75} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 px-4 mt-1">
                  <button className="flex items-center justify-center gap-1.5 pb-1.5 text-center text-[12px] font-bold text-white border-b-[2.5px] border-[#7c3aed]">
                    <img src={coinPlayers} alt="" className="h-[14px] w-[14px] rounded-full object-contain" />
                    <span>Players</span>
                    <span className="text-white/55 font-normal">${balance}</span>
                  </button>
                  <button className="flex items-center justify-center gap-1.5 pb-1.5 text-center text-[12px] font-normal text-white/55 border-b border-white/15">
                    <img src={coinTeams} alt="" className="h-[14px] w-[14px] rounded-full object-contain" />
                    <span>Teams &amp; Culture</span>
                    <span>$0.00</span>
                  </button>
                </div>

                <div className="px-4 pt-7">
                  <h3 className="text-[15px] font-bold text-white">Saved Methods</h3>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {/* Apple Pay */}
                    <button
                      onClick={() => go("card")}
                      className="relative flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1a1c28] py-6"
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-md bg-[#0a0d18] px-1.5 py-0.5 text-[10px] font-bold text-[#79e54a] inline-flex items-center gap-0.5">
                        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
                        Fastest
                      </span>
                      <ApplePayLogo />
                      <p className="text-[13px] font-bold text-white">Apple Pay</p>
                    </button>

                    {/* Debit Card 6427 */}
                    <button
                      onClick={() => go("card")}
                      className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1a1c28] py-6"
                    >
                      <MastercardLogo size={26} />
                      <div className="text-center">
                        <p className="text-[13px] font-bold text-white">Debit Card</p>
                        <p className="mt-1 text-[11px] text-white/55">****6427, exp. 08/28</p>
                      </div>
                    </button>

                    {/* Debit Card 6976 */}
                    <button
                      onClick={() => go("card")}
                      className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1a1c28] py-6"
                    >
                      <MastercardLogo size={26} />
                      <div className="text-center">
                        <p className="text-[13px] font-bold text-white">Debit Card</p>
                        <p className="mt-1 text-[11px] text-white/55">****6976, exp. 06/29</p>
                      </div>
                    </button>
                  </div>

                  <h3 className="mt-7 text-[15px] font-bold text-white">Other Methods</h3>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1a1c28] py-5">
                      <Landmark className="h-6 w-6 text-white" strokeWidth={1.75} />
                      <p className="text-[13px] font-bold text-white">Online Banking</p>
                      <div className="flex items-center gap-1 opacity-80">
                        <span className="rounded-[3px] bg-[#d52b1e] px-1 py-0.5 text-[8px] font-extrabold text-white">us</span>
                        <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#d52b1e]">◆</span>
                        <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#004080]">citi</span>
                        <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#0066b3]">●</span>
                      </div>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1a1c28] py-5">
                      <VenmoLogo />
                      <p className="text-[13px] font-bold text-white">Venmo</p>
                      <p className="text-[10.5px] text-white/55">Linked bank accounts only</p>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1a1c28] py-5">
                      <PaypalLogo />
                      <p className="text-[13px] font-bold text-white">PayPal</p>
                      <p className="text-[10.5px] text-white/55">Linked bank accounts only</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "card" && (
              <motion.div
                key="card"
                custom={dir}
                variants={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.32 }}
                className="absolute inset-0 overflow-y-auto"
                style={{
                  paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
                  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
                }}
              >
                <div className="flex items-center justify-between px-4 pb-5">
                  <div className="flex items-center gap-3">
                    <button onClick={back} aria-label="Back" className="text-white">
                      <ArrowLeft className="h-6 w-6" strokeWidth={2} />
                    </button>
                    <h1 className="text-[20px] font-extrabold text-white">Mastercard</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-white">${balance}</span>
                    <Info className="h-[18px] w-[18px] text-white/80" strokeWidth={1.75} />
                  </div>
                </div>

                <div className="px-4">
                  <p className="text-[12px] text-white/65">Deposit amount</p>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-3.5">
                    <DollarSign className="h-[18px] w-[18px] text-white/65" strokeWidth={2} />
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                      inputMode="decimal"
                      className="flex-1 bg-transparent text-[15px] font-semibold text-white outline-none placeholder:text-white/40"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2.5">
                    {QUICK.map((q) => {
                      const active = amount === String(q);
                      return (
                        <button
                          key={q}
                          onClick={() => setAmount(String(q))}
                          className={`h-10 rounded-full text-[14px] font-semibold ${
                            active ? "border-2 border-white text-white bg-transparent" : "bg-[#1f202d] text-white"
                          }`}
                        >
                          ${q}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MastercardLogo size={22} />
                        <span className="text-[14px] text-white/80">Mastercard</span>
                      </div>
                      <span className="text-[14px] text-white/60">Ending 6427</span>
                    </div>

                    <input
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      inputMode="numeric"
                      placeholder="CVV"
                      disabled={processing}
                      className="mt-4 w-full rounded-xl border border-white/10 bg-transparent px-3 py-3.5 text-[15px] font-semibold text-white outline-none placeholder:text-white/55 focus:border-white/25"
                    />

                    <div className="mt-5 flex flex-col items-center">
                      {processing ? (
                        <div className="flex items-center gap-2 py-3">
                          <span className="text-[16px] font-extrabold text-white">Processing...</span>
                          <Loader2 className="h-5 w-5 animate-spin text-[#7c3aed]" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <button
                          onClick={handleDeposit}
                          disabled={!canDeposit}
                          className={`w-full rounded-full py-3.5 text-[15px] font-extrabold transition-colors ${
                            canDeposit
                              ? "bg-[#7c3aed] text-white"
                              : "bg-[#1f202d] text-white/45"
                          }`}
                        >
                          Deposit ${amount || "0"}
                        </button>
                      )}
                      <p className="mt-3 text-center text-[11.5px] text-white/55">
                        ${amount || "0"} will be available to use in both Players and Teams &amp; Culture after deposit.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DepositNotification({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "tween", duration: 0.25 }}
          className="fixed left-3 right-3 z-[80]"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
        >
          <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#79e54a] bg-[#0a0d18] shadow-lg">
            <div className="flex items-center gap-3 px-3.5 pt-2 pb-2.5">
              <div className="grid h-5 w-5 shrink-0 place-items-center self-center rounded-full border-[1.5px] border-[#79e54a]">
                <Check className="h-3 w-3 text-[#79e54a]" strokeWidth={3} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold leading-snug text-white">
                  Deposit successful! Your balance is updated and you're ready to play.
                </p>
              </div>
              <button onClick={onClose} aria-label="Dismiss" className="self-center text-white/70">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="h-[4px] w-full bg-white/5">
              <motion.div
                key={String(show)}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-[#79e54a]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
