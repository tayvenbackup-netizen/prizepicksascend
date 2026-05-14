import logoUrl from "@/assets/p-logo.png";

export function PLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="PrizePicks"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
