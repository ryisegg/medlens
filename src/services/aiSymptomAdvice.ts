import { fetchJson, getApiUrl } from "./apiClient";

export interface AiOtcCategory {
  name: string;
  examples: string[];
  rationale: string;
  avoidIf: string;
  keyRisks: string;
}

export interface AiSymptomAdvice {
  source: "ai";
  emergency: boolean;
  summary: string;
  redFlags: string[];
  otcCategories: AiOtcCategory[];
  selfCare: string[];
  askForMore: string[];
  disclaimer: string;
}

interface HealthProfilePayload {
  allergies: string[];
  conditions: string[];
  currentMeds: string[];
}

interface FetchAiSymptomAdviceParams {
  language: string;
  freeText: string;
  selectedSymptoms: string[];
  healthProfile?: HealthProfilePayload;
}

export async function fetchAiSymptomAdvice({
  language,
  freeText,
  selectedSymptoms,
  healthProfile,
}: FetchAiSymptomAdviceParams): Promise<AiSymptomAdvice> {
  const endpoint = getApiUrl("/api/symptom-advice", import.meta.env.VITE_AI_API_URL as string | undefined);

  return fetchJson<AiSymptomAdvice>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, freeText, selectedSymptoms, healthProfile }),
  });
}
