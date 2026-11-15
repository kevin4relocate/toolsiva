export type CalculatorResult = { main: string; extra: string };

const waiting = (): CalculatorResult => ({ main: "Enter values", extra: "" });
const invalid = (message: string): CalculatorResult => ({ main: "Invalid input", extra: message });
const result = (main: string, extra = ""): CalculatorResult => ({ main, extra });
const fmt = (value: number, digits = 2): string =>
  Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: digits }) : "—";

function numberAt(values: readonly string[], index: number): number | null {
  const raw = values[index]?.trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function allNumbers(values: readonly string[], count: number): number[] | null {
  const numbers = Array.from({ length: count }, (_, i) => numberAt(values, i));
  return numbers.every((n): n is number => n !== null) ? numbers as number[] : null;
}

type CalendarDay = { year: number; month: number; day: number; timestamp: number };
function calendarDay(value: string | undefined): CalendarDay | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return null;
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { year, month, day, timestamp: date.getTime() };
}

function clockMinutes(value: string | undefined): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value || "");
  if (!match) return null;
  const h = Number(match[1]), m = Number(match[2]);
  return h < 24 && m < 60 ? h * 60 + m : null;
}

export function calculateTool(mode: string, values: readonly string[], today = new Date()): CalculatorResult {
  const get = (count: number) => allNumbers(values, count);
  let ns: number[] | null;
  let a: number, b: number, c: number, d: number;

  switch (mode) {
    case "percentage-calculator":
      ns = get(2);
      if (!ns) return waiting();
      [a, b] = ns;
      return result(fmt(a * b / 100));

    case "percentage-change-calculator":
      ns = get(2);
      if (!ns) return waiting();
      [a, b] = ns;
      if (a === 0) return invalid("Original value must not be zero.");
      c = (b - a) / Math.abs(a) * 100;
      return result(fmt(c) + "%", c > 0 ? "Increase" : c < 0 ? "Decrease" : "No change");

    case "discount-calculator":
      ns = get(2);
      if (!ns) return waiting();
      [a, b] = ns;
      if (a < 0 || b < 0 || b > 100) return invalid("Price must be non-negative and discount between 0% and 100%.");
      c = a * b / 100;
      return result(fmt(a - c), "You save " + fmt(c));

    case "tip-calculator":
      ns = get(3);
      if (!ns) return waiting();
      [a, b, c] = ns;
      if (a < 0 || b < 0 || !Number.isSafeInteger(c) || c < 1) {
        return invalid("Enter a non-negative bill/tip and at least one whole person.");
      }
      d = a * b / 100;
      return result(fmt((a + d) / c), "Total " + fmt(a + d) + " · Tip " + fmt(d) + " · Per person");

    case "bmi-calculator":
      ns = get(2);
      if (!ns) return waiting();
      [a, b] = ns;
      if (!(a > 0) || !(b > 0)) return invalid("Weight and height must be greater than zero.");
      c = a / Math.pow(b / 100, 2);
      return result(fmt(c, 1), c < 18.5 ? "Underweight" : c < 25 ? "Healthy range" : c < 30 ? "Overweight" : "Obesity range");

    case "loan-calculator":
      ns = get(3);
      if (!ns) return waiting();
      [a, b, c] = ns;
      d = c * 12;
      if (!(a > 0) || b < 0 || b > 1000 || !(c > 0) || !Number.isSafeInteger(d) || d > 1200) {
        return invalid("Enter a positive loan, 0–1000% annual rate and a whole number of months (up to 100 years).");
      }
      {
        const r = b / 1200;
        const monthly = r === 0 ? a / d : a * r / (1 - Math.pow(1 + r, -d));
        if (!Number.isFinite(monthly)) return invalid("Values are too large to calculate.");
        return result(fmt(monthly), "Monthly payment · Total " + fmt(monthly * d) + " · Interest " + fmt(monthly * d - a));
      }

    case "simple-interest-calculator":
      ns = get(3);
      if (!ns) return waiting();
      [a, b, c] = ns;
      if (a < 0 || b < -100 || c < 0) return invalid("Principal and time must be non-negative; rate must be at least -100%.");
      d = a * b * c / 100;
      return result(fmt(a + d), "Interest " + fmt(d));

    case "compound-interest-calculator":
      ns = get(4);
      if (!ns) return waiting();
      [a, b, c, d] = ns;
      if (a < 0 || c < 0 || !Number.isSafeInteger(d) || d < 1 || d > 36500 ||
          b <= -100 * d || !Number.isFinite(c * d) || c * d > 100000) {
        return invalid("Use a non-negative principal/time, positive whole compounding frequency, and valid interest rate.");
      }
      {
        const amount = a * Math.pow(1 + b / (100 * d), d * c);
        if (!Number.isFinite(amount)) return invalid("Values are too large to calculate.");
        return result(fmt(amount), "Interest " + fmt(amount - a));
      }

    case "average-calculator": {
      const raw = values[0]?.trim();
      if (!raw) return waiting();
      const parts = raw.split(/[\s,]+/).filter(Boolean);
      if (parts.length > 100000) return invalid("Enter at most 100,000 numbers.");
      const nums = parts.map(Number);
      if (nums.some((n) => !Number.isFinite(n))) return invalid("Enter numbers only, separated by commas or spaces.");
      const sum = nums.reduce((total, n) => total + n, 0);
      if (!Number.isFinite(sum)) return invalid("Sum exceeds the supported numeric range.");
      let min = Infinity, max = -Infinity;
      for (const n of nums) { min = Math.min(min, n); max = Math.max(max, n); }
      return result(fmt(sum / nums.length), "Count " + nums.length + " · Sum " + fmt(sum) +
        " · Min " + fmt(min) + " · Max " + fmt(max));
    }

    case "age-calculator": {
      if (!values[0]) return waiting();
      const birth = calendarDay(values[0]);
      if (!birth) return invalid("Enter a valid date of birth.");
      const current = calendarDay(
        today.getFullYear().toString().padStart(4, "0") + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0")
      );
      if (!current) return invalid("Unable to determine today's date.");
      if (birth.timestamp > current.timestamp) return invalid("Date of birth cannot be in the future.");
      let years = current.year - birth.year;
      if (current.month < birth.month || (current.month === birth.month && current.day < birth.day)) years--;
      return result(years + " years", "Born " + birth.year + "-" + String(birth.month).padStart(2, "0") + "-" + String(birth.day).padStart(2, "0"));
    }

    case "date-difference-calculator": {
      if (!values[0] || !values[1]) return waiting();
      const first = calendarDay(values[0]), second = calendarDay(values[1]);
      if (!first || !second) return invalid("Enter two valid calendar dates.");
      return result(Math.abs(second.timestamp - first.timestamp) / 86400000 + " days");
    }

    case "time-duration-calculator": {
      if (!values[0] || !values[1]) return waiting();
      const start = clockMinutes(values[0]), end = clockMinutes(values[1]);
      if (start === null || end === null) return invalid("Enter valid HH:MM times.");
      const minutes = (end - start + 1440) % 1440;
      return result(Math.floor(minutes / 60) + "h " + minutes % 60 + "m", minutes + " minutes");
    }

    default:
      return invalid("Unknown calculator mode.");
  }
}
