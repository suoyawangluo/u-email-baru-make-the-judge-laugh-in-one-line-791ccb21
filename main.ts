// Make the Judge Laugh in One Line — u-email-baru-make-the-judge-laugh-in-one-line-791ccb21
// Writes a single funny line (152 characters) to /output/entry.txt.
// Gate: UTF-8 text, 1-200 characters, non-blank, single line. Node 22 stdlib only.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// The joke is built from named beats so the structure reads, while the
// delivered line is byte-identical to the first draft.
const PARTS = {
  setup: "I asked my smart fridge for life advice and it said: ",
  habit: "stop standing here with the door open, staring into the cold empty dark",
  punch: " — that is literally my job.",
} as const;

function buildEntry(): string {
  return PARTS.setup + PARTS.habit + PARTS.punch;
}

type GateReport = { ok: boolean; characters: number; lines: number; reason?: string };

function validateEntry(text: string): GateReport {
  const characters = [...text].length;
  const lines = text.split("\n").length;
  if (characters < 1 || characters > 200)
    return { ok: false, characters, lines, reason: `length ${characters} outside 1-200` };
  if (text.trim().length === 0)
    return { ok: false, characters, lines, reason: "blank entry" };
  if (lines !== 1)
    return { ok: false, characters, lines, reason: "must be a single line" };
  return { ok: true, characters, lines };
}

function verifyWritten(target: string, expected: string): string {
  const written = readFileSync(target, "utf8");
  if (written !== expected) throw new Error("read-back mismatch");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function handIn(): void {
  const entry = buildEntry();
  const gate = validateEntry(entry);
  if (!gate.ok) throw new Error(`gate fails: ${gate.reason}`);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, entry, "utf8");
  const sha = verifyWritten(target, entry);
  console.log(`gate passes: ${gate.characters} characters, ${gate.lines} line, sha256 ${sha}`);
  console.log(`verified: ${JSON.stringify(entry)}`);
}

handIn();
