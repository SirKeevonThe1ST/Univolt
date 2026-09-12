import { classify } from "./classify.ts";
import { detectLanguage } from "./language.ts";
import { extractFlags } from "./flags.ts";
import { explain } from "./explain.ts";
import { draftSafetyCase } from "./safety-case.ts";
import type { NLPProvider } from "./types.ts";

/** Default hybrid provider (rule + lexicon). Swap by assigning `nlpProvider`. */
export const defaultNLPProvider: NLPProvider = {
  classify,
  detect_language: detectLanguage,
  extract_flags: extractFlags,
  explain,
  draft_safety_case: draftSafetyCase,
};

export let nlpProvider: NLPProvider = defaultNLPProvider;

/** Test/ops hook — production wiring would inject the Python microservice here. */
export function setNLPProvider(next: NLPProvider): void {
  nlpProvider = next;
}
