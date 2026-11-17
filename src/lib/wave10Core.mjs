export function wave10Numbers(input, count) {
  const text = String(input ?? "").trim();
  if (!text || text.length > 10000) throw Error("Enter numeric values (up to 10,000 characters).");
  const fields = text.split("|").map((item) => item.trim());
  if (fields.length !== count || fields.some((item) => item === "" || !Number.isFinite(Number(item)))) {
    throw Error("Enter exactly " + count + " finite number" + (count === 1 ? "" : "s") + " separated by |.");
  }
  return fields.map(Number);
}
export function wave10Result(label, value, unit = "") {
  if (!Number.isFinite(value)) throw Error("Calculation is not finite; check the domain and input magnitudes.");
  const v = Number(value.toPrecision(11)).toLocaleString("en-US", { maximumFractionDigits: 10 });
  return label + ": " + v + (unit ? " " + unit : "");
}
export function wave10Require(condition, detail) {
  if (!condition) throw Error(detail);
}
export function wave10List(input) {
  const text = String(input ?? "").trim();
  if (!text || text.length > 10000) throw Error("Enter a comma-separated numeric list (up to 10,000 characters).");
  const parts = text.split(",").map(x => x.trim());
  if (parts.length > 1000 || parts.some(x => x === "" || !Number.isFinite(Number(x)))) throw Error("Enter 1–1000 finite comma-separated numbers.");
  return parts.map(Number);
}
