import { fetchJson, getApiUrl } from "./apiClient";

export type AiDrugSuggestion = {
  name: string;
  genericName: string;
  category: string;
  summary: string;
  otcOrRx: "OTC" | "Rx" | "Unknown";
  keyUses: string[];
  warnings: string;
};

export type AiDrugSearchResult = {
  suggestions: AiDrugSuggestion[];
  seeDoctor: boolean;
  disclaimer: string;
};

export async function fetchAiDrugSearch({
  query,
  language,
}: {
  query: string;
  language: string;
}): Promise<AiDrugSearchResult> {
  return fetchJson<AiDrugSearchResult>(getApiUrl("/api/ai-drug-search"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, language }),
  });
}
