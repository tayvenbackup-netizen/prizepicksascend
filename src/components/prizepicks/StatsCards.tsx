import { ClipboardCheck, DollarIcon, FlameIcon } from "./Icons";

const items = [
  { icon: FlameIcon, value: "5", label: "Wins" },
  { icon: DollarIcon, value: "$325", label: "Total won" },
  { icon: ClipboardCheck, value: "$200", label: "Top win" },
];

export function StatsCards() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-3 px-4">
      {items.map(({ icon: Icon, value, label }) => (
        <div key={label} className="rounded-2xl bg-surface p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
            <Icon className="h-5 w-5 text-foreground/85" />
          </div>
          <div className="mt-7 text-[28px] font-bold leading-none tracking-tight">
            {value}
          </div>
          <div className="mt-2 text-[15px] text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
}
