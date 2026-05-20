import type { Drug, DrugCategory } from "../types";
import { drugs as baseDrugs } from "./drugs";

let expandedDrugs: Drug[] = [];
let expandedLoaded = false;
let expandedPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribeCatalog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isCatalogExpanded(): boolean {
  return expandedLoaded;
}

export async function ensureExpandedLoaded(): Promise<void> {
  if (expandedLoaded) return;
  if (!expandedPromise) {
    expandedPromise = import("./expandedDrugs").then((mod) => {
      expandedDrugs = mod.expandedDrugs;
      expandedLoaded = true;
      notify();
    });
  }
  await expandedPromise;
}

export function getDrugs(): Drug[] {
  return [...baseDrugs, ...expandedDrugs];
}

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
  return getDrugs().find((d) => d.id === id);
}

export function searchDrugs(query: string): Drug[] {
  const q = query.toLowerCase().trim();
  if (!q) return getDrugs();
  return getDrugs().filter((drug) => getSearchableText(drug).includes(q));
}

export function getDrugsByCategory(category: DrugCategory | "All"): Drug[] {
  const drugs = getDrugs();
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

// Back-compat export for modules that imported `drugs` directly
export const drugs: Drug[] = baseDrugs;
