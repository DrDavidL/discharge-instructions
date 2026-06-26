import type { Readability } from "@dci/shared";

// Deterministic, dependency-free readability scoring (Flesch–Kincaid grade level and
// Flesch reading ease). The server computes these so the reported reading level is
// reproducible for the same text — consistent with the app's "never trust LLM math" rule.

/** Strip lightweight markdown so symbols don't distort word/syllable counts. */
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ") // code fences
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/^[#>\-*+]+\s*/gm, " ") // headings, quotes, list bullets
    .replace(/[*_~]/g, " ") // emphasis markers
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → link text
    .replace(/[|]/g, " "); // table pipes
}

/** Estimate syllables in an English word with a vowel-group heuristic. */
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  let trimmed = w.replace(/e$/, ""); // common silent trailing 'e'
  if (trimmed === "") trimmed = w;
  const groups = trimmed.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function computeReadability(rawText: string): Readability | null {
  const text = stripMarkdown(rawText).trim();
  if (!text) return null;

  const words = text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
  if (words.length === 0) return null;

  // Sentence terminators; fall back to 1 so single-line drafts still score.
  const sentenceCount = Math.max(1, (text.match(/[.!?]+(?:\s|$)/g) ?? []).length);
  const wordCount = words.length;
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;

  const grade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  const ease = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;

  const round1 = (n: number): number => Math.round(n * 10) / 10;
  return {
    fleschKincaidGrade: Math.max(0, round1(grade)),
    fleschReadingEase: round1(Math.max(0, Math.min(100, ease))),
    wordCount,
    sentenceCount,
  };
}

/** Human-friendly grade label, e.g. "7th grade" or "College level". */
export function gradeLabel(grade: number): string {
  const g = Math.round(grade);
  if (g <= 0) return "Kindergarten";
  if (g >= 16) return "Graduate level";
  if (g >= 13) return "College level";
  const suffix = g === 1 ? "st" : g === 2 ? "nd" : g === 3 ? "rd" : "th";
  return `${g}${suffix} grade`;
}
