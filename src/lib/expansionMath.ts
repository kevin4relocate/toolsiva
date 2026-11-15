export type MetricRows = Array<[string, string]>;

const fmt = (n: number, digits = 4): string => Number.isFinite(n)
  ? new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n)
  : "—";
const status = (message: string): MetricRows => [["Status", message]];

function integer(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : null;
}
function finite(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function gcd(a: number, b: number): number {
  let x = Math.abs(a), y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}
export function simplifiedRatio(aRaw: string, bRaw: string): MetricRows {
  const a = integer(aRaw), b = integer(bRaw);
  if (a === null || b === null || b === 0) {
    return status("Enter whole-number values; second value cannot be zero.");
  }
  const common = gcd(a, b) || 1;
  return [["Simplified ratio", String(a / common) + ":" + String(b / common)],
    ["Decimal", fmt(a / b, 6)]];
}
export function fractionOperation(v: Record<string, string>): MetricRows {
  const a = integer(v.n1), b = integer(v.d1), c = integer(v.n2), d = integer(v.d2);
  if (a === null || b === null || c === null || d === null || b === 0 || d === 0) {
    return status("Enter whole-number numerators and non-zero denominators.");
  }
  let x: number, y: number;
  switch (v.op) {
    case "+": x = a * d + c * b; y = b * d; break;
    case "-": x = a * d - c * b; y = b * d; break;
    case "×": x = a * c; y = b * d; break;
    case "÷": x = a * d; y = b * c; break;
    default: return status("Choose a valid fraction operation.");
  }
  if (y === 0) return status("Division by zero is not allowed.");
  if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
    return status("Fraction values are too large for exact arithmetic.");
  }
  const common = gcd(x, y) || 1;
  x /= common; y /= common;
  if (y < 0) { x = -x; y = -y; }
  return [["Simplified fraction", x + "/" + y], ["Decimal", fmt(x / y, 8)]];
}
export function integerGcdLcm(raw: string): MetricRows {
  const parts = raw.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length < 2) return status("Enter at least two integers.");
  if (parts.length > 10000) return status("Enter at most 10,000 integers.");
  const values = parts.map(integer);
  if (values.some((value) => value === null)) return status("Every value must be a whole integer.");
  const nums = values as number[];
  const common = nums.reduce(gcd);
  let multiple = 1;
  for (const n of nums) {
    const divisor = gcd(multiple, n);
    multiple = divisor === 0 ? 0 : Math.abs((multiple / divisor) * n);
    if (!Number.isSafeInteger(multiple)) return status("LCM exceeds the safe integer range.");
  }
  return [["GCD", String(common)], ["LCM", String(multiple)]];
}
export function paceMetrics(v: Record<string, string>): MetricRows {
  const distance = finite(v.distance), hours = integer(v.hours), minutes = integer(v.minutes);
  if (distance === null || hours === null || minutes === null ||
      distance <= 0 || hours < 0 || minutes < 0 || minutes >= 60 ||
      (hours === 0 && minutes === 0)) {
    return status("Enter a positive distance, non-negative whole hours, and 0–59 whole minutes.");
  }
  const unit = v.unit === "mi" ? "mi" : v.unit === "km" ? "km" : null;
  if (!unit) return status("Select kilometres or miles.");
  const durationMinutes = hours * 60 + minutes;
  const paceSeconds = Math.round(durationMinutes * 60 / distance);
  if (!Number.isSafeInteger(paceSeconds) || paceSeconds < 0) return status("Values are too large.");
  const pace = Math.floor(paceSeconds / 60) + ":" + String(paceSeconds % 60).padStart(2, "0");
  return [["Pace", pace + " min/" + unit], ["Speed", fmt(distance / (durationMinutes / 60), 2) + " " + unit + "/h"]];
}
