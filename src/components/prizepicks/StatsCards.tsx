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
        <div key={label} className="rounded-2xl bg-surface px-3 pt-3 pb-3">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white/[0.06]">
            <img src={icon} alt="" className="h-[23px] w-[23px] object-contain" />
          </div>
          <div className="mt-3.5 text-[20px] font-bold leading-none tracking-tight">
            {value}
          </div>
          <div className="mt-1 text-[12px] text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
}
