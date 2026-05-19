import { en } from "./en";
import { zh } from "./zh";
import type { Translations } from "./en";

export type Language = "en" | "zh";
export type { Translations };

export const translations = { en, zh };

export function getTranslations(lang: Language): Translations {
  return translations[lang] as Translations;
}
