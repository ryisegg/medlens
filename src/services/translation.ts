import { fetchJson, getApiUrl } from "./apiClient";

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

export async function translateSections({
  targetLanguage,
  context,
  sections,
}: TranslateSectionsParams): Promise<TranslationResponse> {
  const endpoint = getApiUrl("/api/translate", import.meta.env.VITE_TRANSLATE_API_URL as string | undefined);

  return fetchJson<TranslationResponse>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetLanguage, context, sections }),
  });
}
