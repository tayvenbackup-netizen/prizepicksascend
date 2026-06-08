/** Format a number with thousands separators when 4+ digits. */
export function fmtNum(n: number, opts: { decimals?: number } = {}): string {
  const decimals = opts.decimals ?? 0;
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Money: $1,234 (drops .00, keeps .50 etc.) */
export function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return "$0";
  const isInt = Math.round(n) === n;
  return (
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Auto-format a string of digits/string-money like "325" or "$200" with commas if 4+ digits. */
export function autoComma(value: string): string {
  if (!value) return value;
  const m = value.match(/^(\$?)(-?)(\d+)(\.\d+)?$/);
  if (!m) return value;
  const [, dollar, sign, intPart, dec = ""] = m;
  if (intPart.length < 4) return value;
  const withCommas = Number(intPart).toLocaleString("en-US");
  return `${dollar}${sign}${withCommas}${dec}`;
}

/** Format a raw amount input string with commas (e.g. "1000" → "1,000", "1234.56" → "1,234.56") */
export function fmtAmountInput(value: string): string {
  let v = value.replace(/,/g, "");
  v = v.replace(/[^\d.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }
  const [intRaw = "", decRaw = ""] = v.split(".");
  const intPart = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (v.includes(".")) {
    return `${intPart}.${decRaw.slice(0, 2)}`;
  }
  return intPart;
}

/** Parse a formatted amount input string back to a number. */
export function parseAmountInput(value: string): number {
  return parseFloat(value.replace(/,/g, "")) || 0;
}

