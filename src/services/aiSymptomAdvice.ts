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

interface FetchAiSymptomAdviceParams {
  language: string;
  freeText: string;
  selectedSymptoms: string[];
}

function getAiEndpoint() {
  const configuredEndpoint = import.meta.env.VITE_AI_API_URL as string | undefined;
  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    return "";
  }

  return "/api/symptom-advice";
}

export async function fetchAiSymptomAdvice({
  language,
  freeText,
  selectedSymptoms,
}: FetchAiSymptomAdviceParams): Promise<AiSymptomAdvice> {
  const endpoint = getAiEndpoint();
  if (!endpoint) {
    throw new Error("AI backend endpoint is not configured for this deployment.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, freeText, selectedSymptoms }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "AI advice is unavailable.");
  }

  return data as AiSymptomAdvice;
}
