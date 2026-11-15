// Browser-only cryptographically secure password and passphrase generation.
export const PASSPHRASE_MIN_WORDS = 10;
export const PASSPHRASE_DEFAULT_WORDS = 10;
export const PASSPHRASE_MAX_WORDS = 16;
export const passphraseWords = "amber anchor apple arrow atlas autumn bamboo beacon berry birch breeze bridge brook cactus canyon cedar cherry cloud cobalt comet coral crystal dawn delta desert dolphin dream ember falcon fern field fjord forest frost galaxy garden glacier harbor hazel honey island ivy jade jungle lagoon lantern lemon lotus lunar maple meadow meteor mint mist moon moss mountain nebula oasis ocean olive onyx opal orchid panda pearl pepper pine planet plum prairie quartz raven reef river robin rose saffron sage shadow silver sky solar sparrow spring star stone storm summit sunset tiger timber topaz tulip valley violet wave willow winter zephyr".split(" ");

export function secureIndex(max: number, source: Pick<Crypto, "getRandomValues"> = crypto): number {
  if (!Number.isSafeInteger(max) || max < 1 || max > 0x100000000) {
    throw new RangeError("Invalid random range.");
  }
  const data = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let selected: number;
  do {
    source.getRandomValues(data);
    selected = data[0]!;
  } while (selected >= limit);
  return selected % max;
}

export function generatePassphrase(
  count: number,
  separator = "-",
  source: Pick<Crypto, "getRandomValues"> = crypto,
): string {
  if (!Number.isInteger(count) || count < PASSPHRASE_MIN_WORDS || count > PASSPHRASE_MAX_WORDS) {
    throw new RangeError("Choose 10–16 words for a secure passphrase.");
  }
  if (separator.length > 8) throw new RangeError("Separator is too long.");
  return Array.from({ length: count }, () => passphraseWords[secureIndex(passphraseWords.length, source)]!).join(separator);
}

export function generatePassword(
  length: number,
  selected: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean },
  source: Pick<Crypto, "getRandomValues"> = crypto,
): string {
  if (!Number.isInteger(length) || length < 4 || length > 4096) {
    throw new RangeError("Length must be 4–4096.");
  }
  const groups = [
    selected.lower ? "abcdefghijklmnopqrstuvwxyz" : "",
    selected.upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
    selected.digits ? "0123456789" : "",
    selected.symbols ? "!@#$%^&*()-_=+[]{};:,.?" : "",
  ].filter(Boolean);
  if (!groups.length) throw new Error("Select at least one character group.");
  if (length < groups.length) throw new Error("Length must accommodate each enabled character group.");

  const combined = groups.join("");
  const output = groups.map((group) => group[secureIndex(group.length, source)]!);
  while (output.length < length) output.push(combined[secureIndex(combined.length, source)]!);
  // Fisher–Yates shuffle using Web Crypto; no predictable Math.random().
  for (let i = output.length - 1; i > 0; i--) {
    const j = secureIndex(i + 1, source);
    [output[i], output[j]] = [output[j]!, output[i]!];
  }
  return output.join("");
}
