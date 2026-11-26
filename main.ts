// The 3 AM Commit Message — make.fun entry
// Writes one commit message to /output/entry.txt and enforces the gate:
// 1-200 characters, a single line, exactly one sentence, ASCII-only
// (so byte count equals char count), no trailing newline.

import { mkdirSync, writeFileSync } from "node:fs";

const ENTRY =
  "fix: I deleted production to stop the error logs and can confirm the errors have stopped (self-reviewed, approved my own PR at 3am).";

function fail(message: string): never {
  console.error(`gate failed: ${message}`);
  process.exit(1);
}

// Count code points, not UTF-16 code units, so the count matches the gate.
const chars = [...ENTRY].length;
if (chars < 1 || chars > 200) {
  fail(`entry is ${chars} characters, must be 1-200`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}
if (ENTRY.includes("\t") || /  /.test(ENTRY)) {
  fail("entry must not contain tabs or double spaces");
}
// Exactly one sentence: a single sentence terminator, at the end
// (a closing parenthesis may follow the final period), and no terminator
// anywhere before it, so abbreviations like "e.g." cannot sneak in.
const terminators = (ENTRY.match(/[.!?]/g) ?? []).length;
const stripped = ENTRY.replace(/\)$/, "");
if (terminators !== 1 || !stripped.endsWith(".")) {
  fail(`entry must be exactly one sentence ending in a period (found ${terminators} terminators)`);
}
if (/[.!?][^)]/.test(ENTRY.slice(0, -1)) && ENTRY.indexOf(".") < ENTRY.length - 2) {
  fail("entry must not contain a sentence terminator before its final period");
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry must not have leading or trailing whitespace");
}
// ASCII-only: bytes must equal chars, so the entry is smallest on exact ties.
const bytes = Buffer.byteLength(ENTRY, "utf8");
if (bytes !== chars) {
  fail(`entry is not ASCII-only (${bytes} bytes vs ${chars} chars)`);
}
// Must read like a real commit message: conventional-commit prefix.
if (!/^(fix|feat|chore|docs|refactor|hotfix)(\([^)]*\))?: /.test(ENTRY)) {
  fail("entry must start with a conventional-commit prefix");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");
console.log(`wrote /output/entry.txt (${chars} chars, ${bytes} bytes)`);
