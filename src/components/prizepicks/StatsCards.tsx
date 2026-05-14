import iconFlame from "@/assets/major/icon-flame.png";
import iconDollar from "@/assets/major/icon-dollar.png";
import iconClipboard from "@/assets/major/icon-clipboard.png";

const items = [
  { icon: iconFlame, value: "5", label: "Wins" },
  { icon: iconDollar, value: "$325", label: "Total won" },
  { icon: iconClipboard, value: "$200", label: "Top win" },
];

export function StatsCards() {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2.5 px-4">
      {items.map(({ icon, value, label }) => (
        <div key={label} className="rounded-2xl bg-surface p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06]">
            <img src={icon} alt="" className="h-[18px] w-[18px] object-contain" />
          </div>
          <div className="mt-5 text-[22px] font-bold leading-none tracking-tight">
            {value}
          </div>
          <div className="mt-1.5 text-[13px] text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
}
