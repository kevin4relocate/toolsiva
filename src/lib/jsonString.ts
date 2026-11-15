/**
 * Decode an escaped JSON string, accepting either a complete quoted JSON
 * string or the escaped body of one. Unlike JSON.stringify(), this preserves
 * existing JSON escapes in unquoted input (\n, \t, \uXXXX, \\).
 * Invalid escape sequences are intentionally rejected by JSON.parse.
 */
export function decodeEscapedJsonString(source: string): string {
  if (source.startsWith('"')) {
    const value: unknown = JSON.parse(source);
    if (typeof value !== "string") {
      throw new Error("Enter a JSON string, not an object or a number.");
    }
    return value;
  }

  let encoded = '"';
  let consecutiveBackslashes = 0;

  for (const character of source) {
    if (character === "\\") {
      encoded += character;
      consecutiveBackslashes += 1;
      continue;
    }

    if (character === '"' && consecutiveBackslashes % 2 === 0) {
      encoded += "\\";
    }

    // Unquoted text may contain literal tabs or newlines as well as escapes.
    // Escape raw control characters so the generated JSON string is valid.
    encoded += character.charCodeAt(0) < 0x20
      ? JSON.stringify(character).slice(1, -1)
      : character;
    consecutiveBackslashes = 0;
  }

  encoded += '"';
  const value: unknown = JSON.parse(encoded);
  if (typeof value !== "string") {
    throw new Error("Invalid escaped JSON string.");
  }
  return value;
}
