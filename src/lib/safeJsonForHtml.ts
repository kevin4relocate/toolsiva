/**
 * Serialize data safely inside <script type="application/json"> and JSON-LD.
 * JSON.stringify alone allows literal </script> inside a string, which the HTML
 * parser interprets as the end of the script element.
 */
export function safeJsonForHtml(value: unknown): string {
  const json = JSON.stringify(value);
  if (json === undefined) throw new TypeError("Cannot serialize undefined JSON.");
  return json
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
