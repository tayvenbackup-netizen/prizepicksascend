export type CardBrand = "visa" | "mastercard" | "amex" | "discover";

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
};

export function CardLogo({ brand, size = 26 }: { brand: CardBrand; size?: number }) {
  const w = size + 10;
  const h = size;
  const baseStyle = { width: w, height: h } as const;

  if (brand === "mastercard") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-[6px] bg-white"
        style={baseStyle}
      >
        <span className="relative" style={{ width: size, height: size * 0.62 }}>
          <span
            className="absolute left-0 top-0 rounded-full bg-[#eb001b]"
            style={{ width: size * 0.62, height: size * 0.62 }}
          />
          <span
            className="absolute right-0 top-0 rounded-full bg-[#f79e1b] mix-blend-multiply"
            style={{ width: size * 0.62, height: size * 0.62 }}
          />
        </span>
      </span>
    );
  }

  if (brand === "visa") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-[6px] bg-white"
        style={baseStyle}
      >
        <span
          className="font-black italic tracking-tight text-[#1a1f71]"
          style={{ fontSize: size * 0.52, lineHeight: 1 }}
        >
          VISA
        </span>
      </span>
    );
  }

  if (brand === "amex") {
    return (
      <span
        className="inline-flex items-center justify-center rounded-[6px] bg-[#1f72cd]"
        style={baseStyle}
      >
        <span
          className="font-extrabold tracking-tight text-white"
          style={{ fontSize: size * 0.4, lineHeight: 1 }}
        >
          AMEX
        </span>
      </span>
    );
  }

  // discover
  return (
    <span
      className="inline-flex items-center justify-center gap-[2px] rounded-[6px] bg-white"
      style={baseStyle}
    >
      <span
        className="font-extrabold tracking-tight text-[#111]"
        style={{ fontSize: size * 0.32, lineHeight: 1 }}
      >
        DISC
      </span>
      <span
        className="rounded-full bg-[#ff6000]"
        style={{ width: size * 0.22, height: size * 0.22 }}
      />
    </span>
  );
}
