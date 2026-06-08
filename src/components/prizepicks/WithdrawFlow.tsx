import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X, Check, Landmark, DollarSign } from "lucide-react";
import { useProfile, PaymentMethod } from "./ProfileContext";
import { PLogo } from "./Icons";
import { CardLogo, BRAND_LABEL } from "./CardLogo";
import { CardManager } from "./CardManager";

type Step = "methods" | "card" | "otp";


function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} aria-label="Back" className="text-white">
          <ArrowLeft className="h-6 w-6" strokeWidth={2} />
        </button>
        <h1 className="text-[20px] font-extrabold text-white">{title}</h1>
      </div>
    </div>
  );
}

const slide = {
  initial: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 1 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 1 }),
};

export function WithdrawFlow({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: (amount: number) => void;
}) {
  const { data, paymentMethods } = useProfile();
  const balance = data.balance;
  const [step, setStep] = useState<Step>("methods");
  const [dir, setDir] = useState(1);
  const [amount, setAmount] = useState("10");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [managerOpen, setManagerOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("methods");
    setDir(1);
    setAmount("10");
    setCode(Array(6).fill(""));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = (next: Step) => {
    setDir(1);
    setStep(next);
  };
  const back = () => {
    setDir(-1);
    if (step === "methods") onClose();
    else if (step === "card") setStep("methods");
    else if (step === "otp") setStep("card");
  };

  const handleCodeChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = ch;
    setCode(next);
    if (ch && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };
  const handleCodeKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      const el = document.getElementById(`otp-${i - 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const otpFilled = code.every((c) => c !== "");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="withdraw-shell"
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
                <h1 className="text-[20px] font-extrabold text-white">Withdrawals</h1>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#22c55e] text-[15px] font-semibold">$</span>
                <span className="text-[#22c55e] text-[15px] font-semibold">{balance}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 px-4 mt-4">
              <button className="pb-2 text-center text-[14px] font-semibold text-white border-b-[3px] border-[#7c3aed]">
                Withdraw
              </button>
              <button className="pb-2 text-center text-[14px] font-normal text-white/60 border-b border-white/15">
                Withdrawal History
              </button>
            </div>

            <div className="px-4 pt-5">
              <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                  <span className="text-[14px] font-semibold text-white">Available to withdraw</span>
                </div>
                <span className="text-[14px] font-semibold text-white">${balance}</span>
              </div>

              <h3 className="mt-6 text-[15px] font-bold text-white">Saved Methods</h3>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelected(m); go("card"); }}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1a1c28] py-5"
                  >
                    <CardLogo brand={m.brand} size={26} />
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-white">{BRAND_LABEL[m.brand]}</p>
                      <p className="mt-1 text-[11px] text-white/55">****{m.last4}, exp. {m.exp}</p>
                    </div>
                  </button>
                ))}
              </div>

              <h3 className="mt-7 text-[15px] font-bold text-white">Connect your bank account</h3>
              <p className="mt-1 text-[12px] text-white/55">
                This method will be saved for both deposit and withdrawal.
              </p>

              <div className="mt-3 w-[calc(50%-6px)]">
                <button
                  onClick={() => setManagerOpen(true)}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-[#1a1c28] py-5"
                >
                  <Landmark className="h-6 w-6 text-white" strokeWidth={1.75} />
                  <p className="text-[13px] font-bold text-white">Online Banking</p>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="rounded-[3px] bg-[#d52b1e] px-1 py-0.5 text-[8px] font-extrabold text-white">us</span>
                    <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#d52b1e]">◆</span>
                    <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#004080]">citi</span>
                    <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#0066b3]">●</span>
                  </div>
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
            <Header title={selected ? BRAND_LABEL[selected.brand] : "Card"} onBack={back} />

            <div className="px-4 pt-4">
              <p className="text-[13px] text-white/65">Withdrawable balance: ${balance}</p>

              <h3 className="mt-6 text-[15px] font-bold text-white">Withdrawal Amount</h3>
              {(() => {
                const amt = parseFloat(amount) || 0;
                const exceeds = amt > (parseFloat(balance) || 0);

                const invalid = amt <= 0 || exceeds;
                return (
                  <>
                    <div className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-3 ${exceeds ? "border-[#ef4444]" : "border-white/10"}`}>
                      <DollarSign className={`h-[18px] w-[18px] ${exceeds ? "text-[#ef4444]" : "text-white/65"}`} strokeWidth={2} />
                      <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        inputMode="decimal"
                        className={`flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:text-white/40 ${exceeds ? "text-[#ef4444]" : "text-white"}`}
                      />
                    </div>
                    {exceeds && (
                      <p className="mt-2 text-[12px] font-semibold text-[#ef4444]">
                        You can't exceed your available balance.
                      </p>
                    )}

                    <div className="mt-6 rounded-xl border border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {selected && <CardLogo brand={selected.brand} size={22} />}
                          <span className="text-[14px] text-white/80">{selected ? BRAND_LABEL[selected.brand] : ""}</span>
                        </div>
                        <span className="text-[14px] text-white/60">Ending {selected?.last4 ?? ""}</span>
                      </div>

                      <div className="mt-6 flex flex-col items-center">
                        <button
                          onClick={() => !invalid && go("otp")}
                          disabled={invalid}
                          className={`rounded-full px-10 py-3 text-[15px] font-extrabold text-white transition-colors ${invalid ? "bg-[#1f202d] text-white/50" : "bg-[#7c3aed]"}`}
                        >
                          Withdraw ${amount || "0"}
                        </button>
                        <p className="mt-3 text-[12px] text-white/55">
                          ${amount || "0"} will be deposited into your account
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
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
            <div className="flex items-center gap-3 px-4 pb-4">
              <button onClick={back} aria-label="Back" className="text-white">
                <ArrowLeft className="h-6 w-6" strokeWidth={2} />
              </button>
              <div className="flex items-center gap-2">
                <PLogo size={28} />
                <span className="text-[18px] font-extrabold tracking-wide text-white">PRIZEPICKS</span>
              </div>
            </div>

            <div className="px-4 pt-6">
              <h1 className="text-[26px] font-extrabold text-white">Check Your Email</h1>
              <p className="mt-5 text-[14px] text-white/75">
                Enter the 6-digit verification code just sent to your email
              </p>

              <div className="mt-7 rounded-2xl border border-white/10 p-3.5">
                <div className="grid grid-cols-6 gap-2">
                  {code.map((c, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      value={c}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKey(i, e)}
                      inputMode="numeric"
                      maxLength={1}
                      className="aspect-square w-full rounded-md bg-[#1a1c28] text-center text-[20px] font-bold text-white outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    />
                  ))}
                </div>
              </div>

              <button
                disabled={!otpFilled}
                onClick={() => {
                  const amt = parseFloat(amount) || 0;
                  onClose();
                  onSubmitted(amt);
                }}
                className="mt-7 w-full rounded-full bg-[#1f202d] py-4 text-[15px] font-bold text-white/70 disabled:opacity-70 enabled:bg-[#7c3aed] enabled:text-white"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
          <CardManager open={managerOpen} onClose={() => setManagerOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export function WithdrawalNotification({
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
                <p className="text-[12px] font-semibold leading-tight text-white">Withdrawal submitted!</p>
                <p className="mt-0.5 text-[10.5px] font-normal leading-snug text-white/75">
                  Most withdrawals hit instantly, but some can take 1-3 business days.
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
