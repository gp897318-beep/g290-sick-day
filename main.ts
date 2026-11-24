// g290-sick-day — make.fun entry for "The Funniest Sick-Day Excuse"
// (competition u-zeroxfive-the-funniest-sick-day-excuse-37423a36).
//
// The program writes exactly one excuse to /output/entry.txt. The gate in
// RULES.txt accepts only UTF-8 text of 1 to 200 characters, not only
// whitespace — so this file validates the line against that gate before
// it writes anything.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// One excuse, one line. Setup: a sneeze so violent it injures the back —
// something a boss can half believe, because everyone knows someone who
// threw their back out sneezing. Turn: the back "filed a formal
// complaint", a little office bureaucracy inside the body. Tag: the
// sender can't stand up straight enough to look employed — the funniest
// words land last, and the whole line reads like a real text message.
const EXCUSE =
  "I sneezed so hard my back filed a formal complaint, so I can't stand " +
  "up straight enough to look employed today.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const DEFAULT_OUTPUT = "/output/entry.txt";

// Count Unicode code points, not UTF-16 code units: the gate counts
// characters, so an astral character must count as one, like the
// scorer counts it.
function charCount(text: string): number {
  return [...text].length;
}

function validateExcuse(text: string): string {
  const line = text.trim();
  const chars = charCount(line);
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (line.length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return line;
}

function resolveOutputPath(): string {
  const given = process.argv[2];
  return given ? resolve(given) : DEFAULT_OUTPUT;
}

function run(): void {
  const line = validateExcuse(EXCUSE);
  const outPath = resolveOutputPath();
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, line, { encoding: "utf8" });
  console.log(`wrote ${charCount(line)}-char entry to ${outPath}`);
}

run();
