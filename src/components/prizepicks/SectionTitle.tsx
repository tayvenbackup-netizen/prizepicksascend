export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="px-4 pt-7 pb-3 text-xl font-bold tracking-tight">{children}</h2>;
}

export function ListHeader({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center justify-between px-4 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
