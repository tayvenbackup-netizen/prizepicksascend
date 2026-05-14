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
