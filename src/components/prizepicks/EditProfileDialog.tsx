import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile, type ProfileData } from "./ProfileContext";
import { PLogo } from "./Icons";
import { ParlayGen } from "./ParlayGen";
import { User, Calendar, Wallet, Users, UserPlus, Trophy, DollarSign, Crown, RotateCcw, Check, Sparkles, Layers } from "lucide-react";

const defaultData: ProfileData = {
  name: "ascend2k",
  joinDate: "Joined September 2025",
  balance: "0.00",
  followers: "0",
  following: "8",
  wins: "5",
  totalWon: "$325",
  topWin: "$200",
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
  const [tab, setTab] = useState<"profile" | "parlay">("profile");

  useEffect(() => {
    if (open) setForm(data);
  }, [open, data]);

  const updateField = (k: keyof ProfileData, v: string) => {
    const next = { ...form, [k]: v };
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
        className="max-w-md p-0 gap-0 border-0 overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.20 0.04 295) 0%, oklch(0.14 0.03 270) 100%)",
          boxShadow:
            "0 24px 60px -12px color-mix(in oklab, var(--primary) 35%, transparent), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="relative px-5 pt-5 pb-4"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--primary) 35%, transparent) 0%, transparent 70%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: "rgba(255,255,255,0.08)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 0 24px -4px var(--primary)",
              }}
            >
              <PLogo size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                <h2 className="text-[15px] font-bold tracking-tight truncate">
                  Profile Editor
                </h2>
              </div>
              <a
                href="https://t.me/Ascend2k"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                @Ascend2k on Telegram
              </a>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                background: "color-mix(in oklab, var(--success) 20%, transparent)",
                color: "var(--success)",
              }}
            >
              Live
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-5">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {section.title}
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid gap-2">
                {section.fields.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.key}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: "color-mix(in oklab, var(--primary) 18%, transparent)",
                          color: "var(--primary)",
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {f.label}
                        </label>
                        <div className="flex items-center gap-1">
                          {f.prefix && (
                            <span className="text-[14px] font-semibold text-foreground/80">
                              {f.prefix}
                            </span>
                          )}
                          <Input
                            value={form[f.key]}
                            placeholder={f.placeholder}
                            onChange={(e) => updateField(f.key, e.target.value)}
                            className="h-7 border-0 bg-transparent px-0 text-[14px] font-semibold shadow-none focus-visible:ring-0"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <Button
            variant="ghost"
            onClick={reset}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <div className="flex-1" />
          <Button
            onClick={() => onOpenChange(false)}
            className="gap-1.5 font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--primary), oklch(0.72 0.22 320))",
              boxShadow: "0 6px 20px -6px var(--primary)",
            }}
          >
            <Check className="h-4 w-4" />
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
