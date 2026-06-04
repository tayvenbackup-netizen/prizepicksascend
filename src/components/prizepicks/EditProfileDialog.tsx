import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile, type ProfileData } from "./ProfileContext";
import { PLogo } from "./Icons";
// ParlayGen has moved into the Share button (see ShareParlayBuilder).
import { ListsEditor } from "./ListsEditor";
import { User, Calendar, Wallet, Users, UserPlus, Trophy, DollarSign, Crown, RotateCcw, Check, Sparkles, Layers, ListChecks, Award, Activity } from "lucide-react";

const defaultData: ProfileData = {
  name: "ascend2k",
  joinDate: "Joined September 2025",
  balance: "0.00",
  followers: "0",
  following: "8",
  wins: "5",
  totalWon: "$325",
  topWin: "$200",
  level: "0",
  progress: 75,
};

type FieldDef = {
  key: keyof ProfileData;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder?: string;
  prefix?: string;
};

const sections: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Identity",
    fields: [
      { key: "name", label: "Display name", icon: User, placeholder: "ascend2k" },
      { key: "joinDate", label: "Joined date", icon: Calendar, placeholder: "Joined September 2025" },
    ],
  },
  {
    title: "Avatar",
    fields: [
      { key: "level", label: "Level badge", icon: Award, placeholder: "0" },
    ],
  },
  {
    title: "Wallet",
    fields: [{ key: "balance", label: "Balance", icon: Wallet, prefix: "$" }],
  },
  {
    title: "Social",
    fields: [
      { key: "followers", label: "Followers", icon: Users },
      { key: "following", label: "Following", icon: UserPlus },
    ],
  },
  {
    title: "Stats",
    fields: [
      { key: "wins", label: "Wins", icon: Trophy },
      { key: "totalWon", label: "Total won", icon: DollarSign },
      { key: "topWin", label: "Top win", icon: Crown },
    ],
  },
];

export function EditProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data, setData } = useProfile();
  const [form, setForm] = useState<ProfileData>(data);
  const [tab, setTab] = useState<"profile" | "lists">("profile");

  useEffect(() => {
    if (open) setForm(data);
  }, [open, data]);

  const updateField = (k: keyof ProfileData, v: string | number) => {
    const next = { ...form, [k]: v } as ProfileData;
    setForm(next);
    setData(next);
  };

  const reset = () => {
    setForm(defaultData);
    setData(defaultData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 border-0 overflow-hidden rounded-2xl flex flex-col"
        style={{
          width: "min(calc(100vw - 12px), 380px)",
          maxWidth: "min(calc(100vw - 12px), 380px)",
          height: "min(calc(100dvh - 24px), 680px)",
          maxHeight: "calc(100dvh - 24px)",
          background:
            "linear-gradient(180deg, oklch(0.20 0.04 295) 0%, oklch(0.14 0.03 270) 100%)",
          boxShadow:
            "0 20px 50px -12px color-mix(in oklab, var(--primary) 35%, transparent), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Header — compressed */}
        <div
          className="relative shrink-0 px-3.5 pt-3 pb-2.5"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--primary) 35%, transparent) 0%, transparent 70%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: "rgba(255,255,255,0.08)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 0 18px -4px var(--primary)",
              }}
            >
              <PLogo size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[color:var(--primary)]" />
                <h2 className="text-[13px] font-bold tracking-tight truncate">
                  Profile Editor
                </h2>
              </div>
              <a
                href="https://t.me/Ascend2k"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                @Ascend2k on Telegram
              </a>
            </div>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
              style={{
                background: "color-mix(in oklab, var(--success) 20%, transparent)",
                color: "var(--success)",
              }}
            >
              Live
            </span>
          </div>

          {/* Tabs (2) */}
          <div className="mt-2 grid grid-cols-2 rounded-full bg-black/30 p-0.5">
            {([
              { id: "profile" as const, label: "Profile", Icon: User },
              { id: "lists" as const, label: "Lists", Icon: ListChecks },
            ]).map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center justify-center gap-1 rounded-full py-1 text-[11px] font-semibold transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "profile" ? (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-2.5 space-y-3">
              {sections.map((section) => (
                <div key={section.title}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {section.title}
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid gap-1.5">
                    {section.fields.map((f) => {
                      const Icon = f.icon;
                      return (
                        <div
                          key={f.key}
                          className="group flex items-center gap-2 rounded-lg px-2 py-1.5"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                            style={{
                              background: "color-mix(in oklab, var(--primary) 18%, transparent)",
                              color: "var(--primary)",
                            }}
                          >
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                              {f.label}
                            </label>
                            <div className="flex items-center gap-1">
                              {f.prefix && (
                                <span className="text-[12px] font-semibold text-foreground/80">
                                  {f.prefix}
                                </span>
                              )}
                              <Input
                                value={form[f.key]}
                                placeholder={f.placeholder}
                                onChange={(e) => updateField(f.key, e.target.value)}
                                className="h-5 border-0 bg-transparent px-0 text-[12px] font-semibold shadow-none focus-visible:ring-0"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {section.title === "Avatar" && (
                    <div
                      className="mt-1.5 flex items-center gap-2 rounded-lg px-2 py-1.5"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                        style={{
                          background: "color-mix(in oklab, var(--primary) 18%, transparent)",
                          color: "var(--primary)",
                        }}
                      >
                        <Activity className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <label className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                            Progress ring
                          </label>
                          <span className="text-[11px] font-semibold tabular-nums">{form.progress}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={form.progress}
                          onChange={(e) => updateField("progress", Number(e.target.value))}
                          className="mt-1 w-full accent-[color:var(--primary)]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              className="flex items-center gap-2 px-3.5 py-2"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
              <div className="flex-1" />
              <Button
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-7 gap-1 text-[11px] font-semibold"
                style={{
                  background: "linear-gradient(135deg, var(--primary), oklch(0.72 0.22 320))",
                  boxShadow: "0 4px 14px -4px var(--primary)",
                }}
              >
                <Check className="h-3 w-3" />
                Done
              </Button>
            </div>
          </>
        ) : tab === "lists" ? (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-2.5">
              <ListsEditor />
            </div>
            <div
              className="flex items-center gap-2 px-3.5 py-2"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <p className="flex-1 text-[10px] text-muted-foreground">
                Names auto-detect via TheSportsDB. Invalid entries won't save.
              </p>
              <Button
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-7 gap-1 text-[11px] font-semibold"
                style={{
                  background: "linear-gradient(135deg, var(--primary), oklch(0.72 0.22 320))",
                }}
              >
                <Check className="h-3 w-3" />
                Done
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
            <ParlayGen onClose={() => onOpenChange(false)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
