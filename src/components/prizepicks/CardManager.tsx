import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useProfile, PaymentMethod } from "./ProfileContext";
import { CardBrand, CardLogo, BRAND_LABEL } from "./CardLogo";

const BRANDS: CardBrand[] = ["visa", "mastercard", "amex", "discover"];

const slide = {
  initial: (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
  animate: { x: 0 },
  exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%" }),
};

type View = "list" | "editor";

export function CardManager({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { paymentMethods, setPaymentMethods } = useProfile();
  const [view, setView] = useState<View>("list");
  const [dir, setDir] = useState(1);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [brand, setBrand] = useState<CardBrand>("mastercard");
  const [last4, setLast4] = useState("");
  const [exp, setExp] = useState("");

  useEffect(() => {
    if (!open) return;
    setView("list");
    setDir(1);
    setEditing(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const openEditor = (m: PaymentMethod | null) => {
    setEditing(m);
    setBrand(m?.brand ?? "mastercard");
    setLast4(m?.last4 ?? "");
    setExp(m?.exp ?? "");
    setDir(1);
    setView("editor");
  };

  const back = () => {
    setDir(-1);
    if (view === "editor") setView("list");
    else onClose();
  };

  const formatExp = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const canSave = last4.length === 4 && /^\d{2}\/\d{2}$/.test(exp);

  const save = () => {
    if (!canSave) return;
    if (editing) {
      setPaymentMethods(
        paymentMethods.map((m) =>
          m.id === editing.id ? { ...m, brand, last4, exp } : m,
        ),
      );
    } else {
      setPaymentMethods([
        ...paymentMethods,
        { id: `pm-${Date.now()}`, brand, last4, exp },
      ]);
    }
    setDir(-1);
    setView("list");
  };

  const remove = (id: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cardmgr-shell"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.32 }}
          className="fixed inset-0 z-[75] overflow-hidden bg-[#050614]"
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
          }}
        >
          <AnimatePresence custom={dir} mode="popLayout" initial={false}>
            {view === "list" && (
              <motion.div
                key="list"
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
                  <h1 className="text-[20px] font-extrabold text-white">Payment Methods</h1>
                </div>

                <div className="px-4">
                  <button
                    onClick={() => openEditor(null)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] py-3.5 text-[14px] font-bold text-white"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Add Payment Method
                  </button>

                  <h3 className="mt-6 text-[15px] font-bold text-white">Your cards</h3>
                  <div className="mt-3 space-y-2.5">
                    {paymentMethods.length === 0 && (
                      <p className="rounded-xl bg-[#1a1c28] py-6 text-center text-[12px] text-white/55">
                        No payment methods saved.
                      </p>
                    )}
                    {paymentMethods.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 rounded-xl bg-[#1a1c28] px-3.5 py-3"
                      >
                        <CardLogo brand={m.brand} size={26} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-white">{BRAND_LABEL[m.brand]}</p>
                          <p className="mt-0.5 text-[11px] text-white/55">
                            ****{m.last4}, exp. {m.exp}
                          </p>
                        </div>
                        <button
                          onClick={() => openEditor(m)}
                          aria-label="Edit"
                          className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white"
                        >
                          <Pencil className="h-[14px] w-[14px]" strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => remove(m.id)}
                          aria-label="Delete"
                          className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-[#ff6b6b]"
                        >
                          <Trash2 className="h-[14px] w-[14px]" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {view === "editor" && (
              <motion.div
                key="editor"
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
                  <h1 className="text-[20px] font-extrabold text-white">
                    {editing ? "Edit Card" : "Add Card"}
                  </h1>
                </div>

                <div className="px-4">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-white/55">
                    Card Type
                  </p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {BRANDS.map((b) => {
                      const active = brand === b;
                      return (
                        <button
                          key={b}
                          onClick={() => setBrand(b)}
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-3 transition-colors ${
                            active
                              ? "border-2 border-[#7c3aed] bg-[#1a1c28]"
                              : "border border-white/10 bg-[#1a1c28]"
                          }`}
                        >
                          <CardLogo brand={b} size={22} />
                          <span className="text-[10px] font-semibold text-white/80">
                            {b === "amex" ? "Amex" : BRAND_LABEL[b].split(" ")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-xl border border-white/10 p-4">
                    <div className="flex items-center gap-2.5">
                      <CardLogo brand={brand} size={22} />
                      <span className="text-[14px] font-semibold text-white">
                        {BRAND_LABEL[brand]}
                      </span>
                    </div>

                    <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-white/55">
                      Last 4 digits
                    </label>
                    <input
                      value={last4}
                      onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      inputMode="numeric"
                      placeholder="1234"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-transparent px-3 py-3 text-[15px] font-semibold tracking-widest text-white outline-none placeholder:text-white/30 focus:border-white/25"
                    />

                    <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-white/55">
                      Expiration (MM/YY)
                    </label>
                    <input
                      value={exp}
                      onChange={(e) => setExp(formatExp(e.target.value))}
                      inputMode="numeric"
                      placeholder="MM/YY"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-transparent px-3 py-3 text-[15px] font-semibold text-white outline-none placeholder:text-white/30 focus:border-white/25"
                    />
                  </div>

                  <button
                    onClick={save}
                    disabled={!canSave}
                    className={`mt-6 w-full rounded-full py-3.5 text-[15px] font-extrabold transition-colors ${
                      canSave ? "bg-[#7c3aed] text-white" : "bg-[#1f202d] text-white/45"
                    }`}
                  >
                    {editing ? "Save Changes" : "Add Card"}
                  </button>

                  {editing && (
                    <button
                      onClick={() => {
                        remove(editing.id);
                        setDir(-1);
                        setView("list");
                      }}
                      className="mt-3 w-full rounded-full border border-[#ff6b6b]/40 py-3 text-[14px] font-bold text-[#ff6b6b]"
                    >
                      Delete Card
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
