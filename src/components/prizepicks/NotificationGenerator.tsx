import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfile } from "./ProfileContext";

type Template = { id: string; title: string; body: (n: string) => string };

const TEMPLATES: Template[] = [
  {
    id: "t1",
    title: "Your Lineup Cashed 💸",
    body: (n) => `Congrats ${n}! Open the app to view your winnings now 🏆`,
  },
  {
    id: "t2",
    title: "LFG! 🤑",
    body: (n) => `Your lineup cashed, ${n} 💰 Check out your winnings in the app.`,
  },
  {
    id: "t3",
    title: "You got the W 💰",
    body: (n) => `Keep the streak alive, ${n} 🔥 Check out your winnings now.`,
  },
];

export function NotificationGenerator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data } = useProfile();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported",
  );
  const timeouts = useRef<number[]>([]);

  useEffect(() => () => { timeouts.current.forEach((t) => clearTimeout(t)); }, []);

  const enable = async () => {
    if (!("Notification" in window)) { setPermission("unsupported"); return; }
    const p = await Notification.requestPermission();
    setPermission(p);
  };

  const fire = (tpl: Template) => {
    if (permission !== "granted") return;
    try {
      new Notification(tpl.title, {
        body: tpl.body(data.name),
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `${tpl.id}-${Date.now()}-${Math.random()}`,
      });
    } catch {}
  };

  const enabled = permission === "granted";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="bg-[#0f0f14] border-white/10 text-white max-h-[92vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-left">Notification Generator</SheetTitle>
        </SheetHeader>

        <button
          onClick={enable}
          className="mt-3 w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: enabled ? "#22c55e" : "#ef4444", boxShadow: enabled ? "0 0 8px #22c55e" : "0 0 8px #ef4444" }}
            />
            <span className="text-[15px] font-semibold">
              {enabled ? "Notifications enabled" : permission === "unsupported" ? "Not supported on this device" : "Click to enable notifications"}
            </span>
          </div>
          <span className="text-xs text-white/50">{permission}</span>
        </button>

        {permission === "denied" && (
          <p className="mt-2 text-xs text-yellow-400">
            Permission was denied. Enable notifications for this site in your browser/OS settings.
          </p>
        )}
        {!enabled && (
          <p className="mt-2 text-[11px] text-white/50">
            For native device banners on iOS, add this app to your Home Screen first, then re-open and enable.
          </p>
        )}

        <div className="mt-4 space-y-3">
          {TEMPLATES.map((tpl, i) => (
            <TemplateCard
              key={tpl.id}
              index={i + 1}
              tpl={tpl}
              name={data.name}
              enabled={enabled}
              onFire={() => fire(tpl)}
              onSchedule={(count, minutes) => {
                const ms = Math.max(1, minutes) * 60_000;
                for (let k = 0; k < count; k++) {
                  const delay = Math.floor(Math.random() * ms);
                  const id = window.setTimeout(() => fire(tpl), delay);
                  timeouts.current.push(id);
                }
              }}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TemplateCard({
  index, tpl, name, enabled, onFire, onSchedule,
}: {
  index: number;
  tpl: Template;
  name: string;
  enabled: boolean;
  onFire: (count: number) => void;
  onSchedule: (count: number, minutes: number) => void;
}) {
  const [count, setCount] = useState("1");
  const [schedCount, setSchedCount] = useState("10");
  const [schedMin, setSchedMin] = useState("5");

  const sendNow = () => {
    const n = Math.min(50, Math.max(1, parseInt(count) || 1));
    for (let i = 0; i < n; i++) {
      setTimeout(() => onFire(1), i * 250);
    }
  };

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <div className="text-[11px] uppercase tracking-wider text-white/40">Option {index}</div>
      <div className="mt-1 font-semibold text-[14px]">{tpl.title}</div>
      <div className="text-[13px] text-white/70 leading-snug">{tpl.body(name)}</div>

      <div className="mt-3 flex items-center gap-2">
        <Input
          type="number" min={1} max={50}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="h-9 w-20 bg-black/40 border-white/10 text-white"
        />
        <Button onClick={sendNow} disabled={!enabled} className="h-9 flex-1 bg-primary">
          Send now
        </Button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Input
          type="number" min={1} max={500}
          value={schedCount}
          onChange={(e) => setSchedCount(e.target.value)}
          placeholder="count"
          className="h-9 w-20 bg-black/40 border-white/10 text-white"
        />
        <span className="text-xs text-white/50">over</span>
        <Input
          type="number" min={1} max={1440}
          value={schedMin}
          onChange={(e) => setSchedMin(e.target.value)}
          placeholder="min"
          className="h-9 w-20 bg-black/40 border-white/10 text-white"
        />
        <span className="text-xs text-white/50">min</span>
        <Button
          variant="secondary"
          disabled={!enabled}
          onClick={() => onSchedule(
            Math.min(500, Math.max(1, parseInt(schedCount) || 1)),
            Math.min(1440, Math.max(1, parseInt(schedMin) || 1)),
          )}
          className="h-9 flex-1"
        >
          Schedule
        </Button>
      </div>
    </div>
  );
}
