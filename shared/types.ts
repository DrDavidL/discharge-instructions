// Shared types between the React client and the Express server.
// Imported via the `@dci/shared` workspace package.

export type NoteType = "discharge_instructions";

// ---- Outline (parsed from features.md) ----

export interface OutlineSection {
  /** Stable slug derived from the title, used as the editor field key. */
  key: string;
  /** Section header shown to the student (headers only — no examples). */
  title: string;
  /** Faculty/LLM guidance for this section. Not shown in the editor. */
  guidance: string;
}

export interface OutlineResponse {
  noteType: NoteType;
  documentTitle: string;
  sections: OutlineSection[];
}

// ---- Cases ----

export interface CaseSummary {
  id: string;
  title: string;
  /** One-line teaser shown on the selection card. */
  blurb: string;
  /** Markdown body of the discharge summary (the clinical source). */
  content: string;
}

// ---- Scoring ----

/** One scored criterion (the server merges LLM output with the rubric definition). */
export interface CriterionScore {
  id: number;
  category: string;
  criterion: string;
  score: number; // 0..maxScore
  maxScore: number;
  rationale: string;
  improvement: string;
}

/** Category-level aggregate, computed by the server from criteria. */
export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percent: number; // 0..100
}

export type PerformanceBand = "Optimal" | "Adequate" | "Inadequate";

/** Deterministic readability metrics computed server-side from the student's draft. */
export interface Readability {
  /** Flesch–Kincaid grade level (U.S. school grade). */
  fleschKincaidGrade: number;
  /** Flesch reading ease (0–100; higher is easier). */
  fleschReadingEase: number;
  wordCount: number;
  sentenceCount: number;
}

export interface Assessment {
  overallScore: number;
  maxScore: number;
  percent: number; // 0..100
  band: PerformanceBand;
  summary: string;
  categories: CategoryScore[];
  criteria: CriterionScore[];
  topPriorities: string[];
  safetyFlags: string[];
  /** Computed reading level of the draft; null if the draft had no scoreable text. */
  readability: Readability | null;
}

export interface ScoreRequest {
  caseId: string;
  caseTitle: string;
  /** The discharge summary the student worked from (not persisted for uploaded cases). */
  sourceSummary: string;
  /** True when the source came from user upload/paste (source is not stored). */
  sourceIsUploaded: boolean;
  noteType?: NoteType;
  /** Assembled student draft (markdown with section headers). */
  draft: string;
}

export interface ScoreResponse {
  submissionId: number | null;
  persisted: boolean;
  model: string;
  assessment: Assessment;
  /**
   * Gold-standard example instructions for the chosen built-in case, revealed to the
   * student on the assessment screen for comparison. Null for uploaded cases.
   */
  exemplar: string | null;
}

// ---- Stats ----

export interface CategoryStat {
  category: string;
  avgScore: number;
  avgMax: number;
  avgPercent: number; // 0..100
  count: number;
}

export interface StatsResponse {
  totalSubmissions: number;
  overallAvgPercent: number | null;
  categories: CategoryStat[];
}

// ---- Auth ----

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresInSeconds: number;
}

export interface ApiError {
  error: string;
}
