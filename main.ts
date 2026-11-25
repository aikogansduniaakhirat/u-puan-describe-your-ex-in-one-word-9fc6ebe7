// Describe Your Ex in One Word — one word, 111 chars max but criterion 1 caps
// it at a single token. Artifact: /output/entry.txt, house judge.
//
// Brief:
//  1. One word that describes an ex, instantly readable as a verdict on a former
//     partner. Loses to any word that is one.
//  2. Comic punch: a twist, an unexpected angle, a precise absurdity — not a
//     plain insult.
//  3. Surprise: not the obvious choice, startles while staying instantly clear.
//  4. Craft: exactly one word, spelled correctly, no punctuation tricks, meaning
//     arrives without a caption.
//  5. Recognition: anyone who has had an ex feels the truth of it.
//
// The pick: "recalled". One word that carries two jobs at once — the thing you
// remember, and the thing the manufacturer pulled off the market for safety
// reasons. The second reading is the joke, and it arrives without a caption.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The word. One token, no trailing newline. */
const WORD = "recalled";

const MIN_CHARS = 1;
const MAX_CHARS = 111;

/** The field's obvious cluster — criterion 3 loses to anything fresher. */
const BANNED: readonly string[] = [
  "mistake",
  "lesson",
  "chapter",
  "expired",
  "irrelevant",
  "deleted",
  "practice",
  "tutorial",
  "prototype",
  "beta",
  "error",
  "typo",
  "rehearsal",
  "history",
  "ex",
  "closed",
  "footnote",
  "prerequisite",
];

function compose(): string {
  const text = WORD.normalize("NFC");
  const chars = [...text].length;
  const lower = text.toLowerCase();

  if (/[\r\n]/.test(text)) throw new Error("entry must be one line, no newline");
  if (text !== text.trim()) throw new Error("no edge whitespace");
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} chars, gate allows ${MIN_CHARS}..${MAX_CHARS}`);
  }
  // Criterion 4: exactly one word. A phrase passes the gate and loses every game.
  if (/\s/.test(text)) throw new Error("criterion 4: one word, no spaces");
  if (/[.!?,;:'"()\-]/.test(text)) throw new Error("criterion 4: no punctuation tricks");
  for (const stale of BANNED) {
    if (lower === stale) throw new Error(`obvious pick, criterion 3: ${stale}`);
  }
  // Criterion 1/2: the verdict is a product state, so the pick keeps its past
  // participle shape. This fails loudly if someone swaps in a funnier-looking
  // word with no angle.
  if (!lower.endsWith("ed")) throw new Error("the angle is gone: the pick should read as a product state");
  return text;
}

function main(): void {
  const text = compose();
  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target: string = join(outDir, "entry.txt");
  writeFileSync(target, text, "utf8");
  process.stdout.write(
    `wrote ${[...text].length} chars / ${Buffer.byteLength(text, "utf8")} bytes to ${target}\n`,
  );
}

try {
  main();
} catch (err) {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
}
