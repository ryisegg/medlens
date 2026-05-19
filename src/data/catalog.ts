import type { Drug, DrugCategory } from "../types";
import { drugs as baseDrugs } from "./drugs";
import { expandedDrugs } from "./expandedDrugs";

export const drugs: Drug[] = [...baseDrugs, ...expandedDrugs];

function getSearchableText(drug: Drug) {
  const localized = drug as Drug & { chineseName?: string; chineseSummary?: string; aliases?: string[] };
  return [
    drug.name,
    drug.genericName,
    drug.activeIngredient,
    drug.description,
    ...drug.brandNames,
    ...drug.pillColors,
    ...drug.imprintExamples,
    localized.chineseName,
    localized.chineseSummary,
    ...(localized.aliases ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getDrugById(id: string): Drug | undefined {
  return drugs.find((d) => d.id === id);
}

export function searchDrugs(query: string): Drug[] {
  const q = query.toLowerCase().trim();
  if (!q) return drugs;
  return drugs.filter((drug) => getSearchableText(drug).includes(q));
}

export function getDrugsByCategory(category: DrugCategory | "All"): Drug[] {
  if (category === "All") return drugs;
  return drugs.filter((d) => d.category === category);
}

export const ALL_CATEGORIES: readonly (DrugCategory | "All")[] = [
  "All",
  "Pain Relief",
  "Allergy",
  "Cold & Flu",
  "Digestive Health",
  "Skin",
  "Sleep",
  "Vitamins",
  "Chronic Conditions",
] as const;
