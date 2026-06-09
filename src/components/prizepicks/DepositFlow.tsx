import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Info, DollarSign, Check, X, Landmark, Loader2, CreditCard, HelpCircle, Headphones } from "lucide-react";
import { useProfile } from "./ProfileContext";
import { autoComma, fmtAmountInput, parseAmountInput } from "@/lib/fmt";
import { CardLogo, CardBrand } from "./CardLogo";
import venmoAsset from "@/assets/payments/venmo.png.asset.json";
import paypalAsset from "@/assets/payments/paypal.png.asset.json";

type CardKind = "debit" | "credit";
type Step = "methods" | { kind: "card"; type: CardKind } | { kind: "saved"; id: string };

function ApplePayLogo() {
  return (
    <span className="inline-flex h-8 w-14 items-center justify-center rounded-[7px] bg-white text-black">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M17.5 12.5c0-2.3 1.9-3.4 2-3.4-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 2.9-.7 1.3 0 1.8.7 3 .7 1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.5 1.2-2.5s-2.4-.9-2.4-3.6zM15.3 5.9c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2z" />
      </svg>
      <span className="ml-0.5 text-[12px] font-semibold">Pay</span>
    </span>
  );
}

function VenmoLogo({ size = 30 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center overflow-hidden rounded-[6px] bg-white"
      style={{ width: size, height: size }}
    >
      <img src={venmoAsset.url} alt="Venmo" className="h-full w-full object-contain" />
    </span>
  );
}

function PaypalLogo({ size = 30 }: { size?: number }) {
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

function detectBrand(num: string): CardBrand | null {
  const n = num.replace(/\D/g, "");
  if (!n) return null;
  if (/^4/.test(n)) return "visa";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^(6011|65|64[4-9])/.test(n)) return "discover";
  return null;
}

const ALLOWED: Record<CardKind, CardBrand[]> = {
  debit: ["visa", "mastercard"],
  credit: ["visa", "mastercard", "discover", "amex"],
};

function FooterButtons() {
  return (
    <div className="mt-6 flex items-center justify-center gap-3 pb-2">
      <button className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1c28] px-4 py-2 text-[12px] font-semibold text-white">
        <HelpCircle className="h-[14px] w-[14px]" strokeWidth={2} /> Help Center
      </button>
      <button className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1c28] px-4 py-2 text-[12px] font-semibold text-white">
        <Headphones className="h-[14px] w-[14px]" strokeWidth={2} /> Live Support
      </button>
    </div>
  );
}

export function DepositFlow({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: (amount: number) => void;
}) {
  const { data, paymentMethods, setPaymentMethods } = useProfile();
  const balance = data.balance;
  const [step, setStep] = useState<Step>("methods");
  const [dir, setDir] = useState(1);
  const [amount, setAmount] = useState("100");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("methods");
    setDir(1);
    setAmount("100");
    setCardNumber("");
    setExp("");
    setCvv("");
    setZip("");
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

  const openCard = (type: CardKind) => {
    setDir(1);
    setCardNumber("");
    setExp("");
    setCvv("");
    setZip("");
    setStep({ kind: "card", type });
  };

  const slide = {
    initial: (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
    animate: { x: 0 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%" }),
  };

  const cardType: CardKind | null = typeof step === "object" && step.kind === "card" ? step.type : null;
  const detected = detectBrand(cardNumber);
  const brandOk = !!detected && !!cardType && ALLOWED[cardType].includes(detected);
  const amt = parseAmountInput(amount);
  const digits = cardNumber.replace(/\D/g, "");
  const cvvLen = detected === "amex" ? 4 : 3;
  const maxCardLen = detected === "amex" ? 15 : 16;
  const canDeposit =
    brandOk &&
    digits.length === maxCardLen &&
    /^\d{2}\/\d{2}$/.test(exp) &&
    cvv.length === cvvLen &&
    zip.length === 5 &&
    amt > 0 &&
    !processing;

  const formatCardNumber = (raw: string) => {
    const limit = /^3[47]/.test(raw.replace(/\D/g, "")) ? 15 : 16;
    const d = raw.replace(/\D/g, "").slice(0, limit);
    return d.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExp = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 4);
    if (d.length < 3) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const handleDeposit = () => {
    if (!canDeposit || !detected) return;
    setProcessing(true);
    const last4 = digits.slice(-4);
    const exists = paymentMethods.some(
      (m) => m.brand === detected && m.last4 === last4,
    );
    if (!exists) {
      setPaymentMethods([
        ...paymentMethods,
        { id: `pm-${Date.now()}`, brand: detected, last4, exp },
      ]);
    }
    setTimeout(() => {
      onClose();
      onSubmitted(amt);
    }, 1600);
  };

  const headerTitle = cardType === "credit" ? "Credit Card" : "Debit Card";
  const acceptBrands: CardBrand[] = cardType === "credit"
    ? ["visa", "mastercard", "discover", "amex"]
    : ["visa", "mastercard"];

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
                <div className="flex items-center justify-between px-4 pb-5">
                  <div className="flex items-center gap-4">
                    <button onClick={back} aria-label="Back" className="text-white">
                      <ArrowLeft className="h-6 w-6" strokeWidth={2} />
                    </button>
                    <h1 className="text-[22px] font-extrabold text-white">Deposit</h1>
                  </div>
                  <button aria-label="info" className="text-white/85">
                    <Info className="h-[22px] w-[22px]" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="px-4">
                  <h3 className="text-[15px] font-bold text-white">Saved Methods</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      className="relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#15172180] py-8"
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-0.5 rounded-md bg-[#0a0d18] px-2 py-0.5 text-[11px] font-bold text-[#79e54a]">
                        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>
                        Fastest
                      </span>
                      <ApplePayLogo />
                      <p className="text-[15px] font-bold text-white">Apple Pay</p>
                    </button>

                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => {
                          setDir(1);
                          setAmount("100");
                          setStep({ kind: "saved", id: pm.id });
                        }}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#15172180] py-8"
                      >
                        <CardLogo brand={pm.brand} size={26} />
                        <p className="text-[15px] font-bold text-white">Debit Card</p>
                        <p className="-mt-1 text-[11.5px] text-white/55">****{pm.last4}, exp. {pm.exp}</p>
                      </button>
                    ))}
                  </div>

                  <h3 className="mt-7 text-[15px] font-bold text-white">Other Methods</h3>


                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openCard("debit")}
                      className="flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-[#15172180] py-6"
                    >
                      <CreditCard className="h-6 w-6 text-white" strokeWidth={1.75} />
                      <p className="text-[15px] font-bold text-white">Debit Card</p>
                      <div className="flex items-center gap-1.5">
                        <CardLogo brand="visa" size={18} />
                        <CardLogo brand="mastercard" size={18} />
                      </div>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-[#15172180] py-6">
                      <Landmark className="h-6 w-6 text-white" strokeWidth={1.75} />
                      <p className="text-[15px] font-bold text-white">Online Banking</p>
                      <div className="flex items-center gap-1">
                        <span className="rounded-[3px] bg-[#d52b1e] px-1 py-0.5 text-[8px] font-extrabold text-white">us</span>
                        <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#d52b1e]">◆</span>
                        <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#004080]">citi</span>
                        <span className="rounded-[3px] bg-white px-1 py-0.5 text-[8px] font-extrabold text-[#0066b3]">●</span>
                      </div>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#15172180] py-6">
                      <VenmoLogo />
                      <p className="text-[15px] font-bold text-white">Venmo</p>
                      <p className="text-[11px] text-white/55">Linked bank accounts only</p>
                    </button>

                    <button className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#15172180] py-6">
                      <PaypalLogo />
                      <p className="text-[15px] font-bold text-white">PayPal</p>
                      <p className="text-[11px] text-white/55">Linked bank accounts only</p>
                    </button>

                    <button
                      onClick={() => openCard("credit")}
                      className="flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-[#15172180] py-6"
                    >
                      <CreditCard className="h-6 w-6 text-white" strokeWidth={1.75} />
                      <p className="text-[15px] font-bold text-white">Credit Card</p>
                      <div className="flex items-center gap-1.5">
                        <CardLogo brand="visa" size={16} />
                        <CardLogo brand="mastercard" size={16} />
                        <CardLogo brand="discover" size={16} />
                        <CardLogo brand="amex" size={16} />
                      </div>
                    </button>
                  </div>

                  <FooterButtons />
                </div>
              </motion.div>
            )}

            {typeof step === "object" && step.kind === "card" && (
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
                  <div className="flex items-center gap-4">
                    <button onClick={back} aria-label="Back" className="text-white">
                      <ArrowLeft className="h-6 w-6" strokeWidth={2} />
                    </button>
                    <h1 className="text-[22px] font-extrabold text-white">{headerTitle}</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-white">${autoComma(balance)}</span>
                    <Info className="h-[20px] w-[20px] text-white/85" strokeWidth={1.75} />
                  </div>
                </div>

                <div className="px-4">
                  <p className="text-[13px] text-white/65">Deposit amount</p>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-3.5">
                    <DollarSign className="h-[18px] w-[18px] text-white/65" strokeWidth={2} />
                    <input
                      value={amount}
                      onChange={(e) => setAmount(fmtAmountInput(e.target.value))}
                      inputMode="decimal"
                      disabled={processing}
                      className="flex-1 bg-transparent text-[15px] font-semibold text-white outline-none placeholder:text-white/40"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2.5">
                    {QUICK.map((q) => {
                      const active = parseAmountInput(amount) === q;
                      return (
                        <button
                          key={q}
                          onClick={() => setAmount(String(q))}
                          className={`h-11 rounded-full text-[14px] font-semibold ${
                            active ? "border-2 border-white text-white bg-transparent" : "bg-[#15172180] text-white"
                          }`}
                        >
                          ${q}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-semibold text-white">We accept:</span>
                      {acceptBrands.map((b) => (
                        <CardLogo key={b} brand={b} size={18} />
                      ))}
                    </div>

                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      inputMode="numeric"
                      placeholder="Card number"
                      disabled={processing}
                      className="mt-5 w-full rounded-xl border border-white/10 bg-transparent px-3.5 py-3.5 text-[15px] font-semibold tracking-wide text-white outline-none placeholder:text-white/50 focus:border-white/25"
                    />

                    <div className="mt-3 grid grid-cols-3 gap-2.5">
                      <input
                        value={exp}
                        onChange={(e) => setExp(formatExp(e.target.value))}
                        inputMode="numeric"
                        placeholder="MM / YY"
                        disabled={processing}
                        className="rounded-xl border border-white/10 bg-transparent px-3 py-3.5 text-[14px] font-semibold text-white outline-none placeholder:text-white/50 focus:border-white/25"
                      />
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        inputMode="numeric"
                        placeholder="CVV"
                        disabled={processing}
                        className="rounded-xl border border-white/10 bg-transparent px-3 py-3.5 text-[14px] font-semibold text-white outline-none placeholder:text-white/50 focus:border-white/25"
                      />
                      <input
                        value={zip}
                        onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        inputMode="numeric"
                        placeholder="Zip code"
                        disabled={processing}
                        className="rounded-xl border border-white/10 bg-transparent px-3 py-3.5 text-[14px] font-semibold text-white outline-none placeholder:text-white/50 focus:border-white/25"
                      />
                    </div>

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
                            canDeposit ? "bg-[#7c3aed] text-white" : "bg-[#1f202d] text-white/45"
                          }`}
                        >
                          Deposit ${amount || "0"}
                        </button>
                      )}
                      <p className="mt-3 text-center text-[12px] text-white/55">
                        ${amount || "0"} will be available to use in both Players and Teams &amp; Culture after deposit.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#3a5aa0]/40 bg-[#0e1430] p-3.5">
                    <span className="text-[22px] leading-none">📣</span>
                    <div className="flex-1">
                      <p className="text-[12.5px] leading-snug text-white">
                        Deposits for Teams &amp; Culture requires a Visa Debit or Mastercard Debit card.
                      </p>
                      <label className="mt-3 flex items-center justify-end gap-2 text-[12px] text-white/80">
                        <input type="checkbox" className="h-4 w-4 rounded border border-white/30 bg-transparent" />
                        Don't show again
                      </label>
                    </div>
                  </div>

                  <FooterButtons />
                </div>
              </motion.div>
            )}

            {typeof step === "object" && step.kind === "saved" && (() => {
              const pm = paymentMethods.find((m) => m.id === step.id);
              if (!pm) return null;
              const sAmt = parseAmountInput(amount);
              const sCan = sAmt > 0 && !processing;
              const sDeposit = () => {
                if (!sCan) return;
                setProcessing(true);
                setTimeout(() => {
                  onClose();
                  onSubmitted(sAmt);
                }, 1600);
              };
              return (
                <motion.div
                  key="saved"
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
                    <div className="flex items-center gap-4">
                      <button onClick={back} aria-label="Back" className="text-white">
                        <ArrowLeft className="h-6 w-6" strokeWidth={2} />
                      </button>
                      <h1 className="text-[22px] font-extrabold text-white">Debit Card</h1>
                    </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-white">${autoComma(balance)}</span>
                    <Info className="h-[20px] w-[20px] text-white/85" strokeWidth={1.75} />
                  </div>
                  </div>

                  <div className="px-4">
                    <p className="text-[13px] text-white/65">Deposit amount</p>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-3.5">
                      <DollarSign className="h-[18px] w-[18px] text-white/65" strokeWidth={2} />
                    <input
                      value={amount}
                      onChange={(e) => setAmount(fmtAmountInput(e.target.value))}
                      inputMode="decimal"
                      disabled={processing}
                      className="flex-1 bg-transparent text-[15px] font-semibold text-white outline-none placeholder:text-white/40"
                    />
                    </div>

                    <div className="mt-3 grid grid-cols-4 gap-2.5">
                    {QUICK.map((q) => {
                      const active = parseAmountInput(amount) === q;
                      return (
                          <button
                            key={q}
                            onClick={() => setAmount(String(q))}
                            className={`h-11 rounded-full text-[14px] font-semibold ${
                              active ? "border-2 border-white text-white bg-transparent" : "bg-[#15172180] text-white"
                            }`}
                          >
                            ${q}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 p-4">
                      <div className="flex items-center gap-3">
                        <CardLogo brand={pm.brand} size={26} />
                        <div>
                          <p className="text-[14px] font-bold text-white">Debit Card</p>
                          <p className="text-[12px] text-white/55">****{pm.last4}, exp. {pm.exp}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col items-center">
                      {processing ? (
                        <div className="flex items-center gap-2 py-3">
                          <span className="text-[16px] font-extrabold text-white">Processing...</span>
                          <Loader2 className="h-5 w-5 animate-spin text-[#7c3aed]" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <button
                          onClick={sDeposit}
                          disabled={!sCan}
                          className={`w-full rounded-full py-3.5 text-[15px] font-extrabold transition-colors ${
                            sCan ? "bg-[#7c3aed] text-white" : "bg-[#1f202d] text-white/45"
                          }`}
                        >
                          Deposit ${amount || "0"}
                        </button>
                      )}
                      <p className="mt-3 text-center text-[12px] text-white/55">
                        ${amount || "0"} will be available to use in both Players and Teams &amp; Culture after deposit.
                      </p>
                    </div>

                    <FooterButtons />
                  </div>
                </motion.div>
              );
            })()}
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
