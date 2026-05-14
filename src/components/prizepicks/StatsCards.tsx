import iconFlame from "@/assets/major/icon-flame.png";
import iconDollar from "@/assets/major/icon-dollar.png";
import iconClipboard from "@/assets/major/icon-clipboard.png";
import { useProfile } from "./ProfileContext";
import { autoComma } from "@/lib/fmt";

export function StatsCards() {
  const { data } = useProfile();
  const items = [
    { icon: iconFlame, value: autoComma(data.wins), label: "Wins" },
    { icon: iconDollar, value: autoComma(data.totalWon), label: "Total won" },
    { icon: iconClipboard, value: autoComma(data.topWin), label: "Top win" },
  ];
  return (
    <div className="mt-4 grid grid-cols-3 gap-2 px-3.5">
      {items.map(({ icon, value, label }) => (
        <div key={label} className="rounded-2xl bg-surface px-3 pt-2.5 pb-2.5">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/[0.06]">
            <img src={icon} alt="" className="h-[26px] w-[26px] object-contain" />
          </div>
          <div className="mt-3 text-[18px] font-bold leading-none tracking-tight">
            {value}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
}
