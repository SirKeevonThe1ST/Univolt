import type { AnalysisResult } from "@/lib/demo/types";
import { ExplainableAi } from "./explainable-ai";

export function ExplainPanel({ result }: { result: AnalysisResult }) {
  return <ExplainableAi result={result} indicators={result.indicators} />;
}
