export interface TranslationSection {
  id: string;
  text: string;
}

export interface TranslationResponse {
  translations: TranslationSection[];
  disclaimer: string;
}

interface TranslateSectionsParams {
  targetLanguage: "zh" | "en";
  context: string;
  sections: TranslationSection[];
}

function getTranslateEndpoint() {
  const configuredEndpoint = import.meta.env.VITE_TRANSLATE_API_URL as string | undefined;
  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    return "";
  }

  return "/api/translate";
}

export async function translateSections({
  targetLanguage,
  context,
  sections,
}: TranslateSectionsParams): Promise<TranslationResponse> {
  const endpoint = getTranslateEndpoint();
  if (!endpoint) {
    throw new Error("Translation API endpoint is not configured for this deployment.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetLanguage, context, sections }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "Translation is unavailable.");
  }

  return data as TranslationResponse;
}
