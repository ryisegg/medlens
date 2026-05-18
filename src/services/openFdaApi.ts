import type { ApiDrugDetail } from "../types/api";
import { cacheGet, cacheSet } from "./cache";

const BASE = "https://api.fda.gov/drug/label.json";

function stripHtml(raw: string | string[] | undefined): string | undefined {
  if (!raw) return undefined;
  const text = Array.isArray(raw) ? raw.join(" ") : raw;
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim() || undefined;
}

function firstField(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined;
  if (Array.isArray(val)) return stripHtml(val[0]);
  return stripHtml(val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseLabel(label: Record<string, any>, name: string): ApiDrugDetail {
  const openfda = label.openfda ?? {};

  const brandNames: string[] = openfda.brand_name ?? [];
  const genericNames: string[] = openfda.generic_name ?? [];

  const isOtc =
    (openfda.product_type as string[] | undefined)?.some((t: string) =>
      t.toLowerCase().includes("otc")
    ) ?? false;

  return {
    name: brandNames[0] ?? genericNames[0] ?? name,
    genericName: genericNames[0],
    brandNames,
    otcOrRx: isOtc ? "OTC" : "Rx",
    description: firstField(label.description),
    indicationsAndUsage: firstField(label.indications_and_usage) ?? firstField(label.purpose),
    warnings: firstField(label.warnings) ?? firstField(label.warnings_and_cautions),
    adverseReactions: firstField(label.adverse_reactions),
    contraindications: firstField(label.contraindications) ?? firstField(label.do_not_use),
    drugInteractions: firstField(label.drug_interactions),
    dosageAndAdministration: firstField(label.dosage_and_administration) ?? firstField(label.directions),
    dosageForms: openfda.dosage_form ?? [],
    activeIngredients: openfda.substance_name ?? [],
    pregnancyInfo: firstField(label.pregnancy),
    nursingMotherInfo: firstField(label.nursing_mothers),
    keepOutOfReachOfChildren: firstField(label.keep_out_of_reach_of_children),
    source: "openFDA",
    sourceUrl: `https://open.fda.gov/drug/label/`,
    lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
  };
}

export async function fetchOpenFdaByName(name: string): Promise<ApiDrugDetail | null> {
  const q = name.trim();
  if (!q) return null;

  const cacheKey = `openfda_${q.toLowerCase().replace(/\s+/g, "_")}`;
  const cached = cacheGet<ApiDrugDetail>(cacheKey);
  if (cached) return cached;

  // Try generic name first, then brand name
  const queries = [
    `openfda.generic_name:"${q}"`,
    `openfda.brand_name:"${q}"`,
    `openfda.substance_name:"${q}"`,
  ];

  for (const search of queries) {
    try {
      const url = `${BASE}?search=${encodeURIComponent(search)}&limit=1`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      const results: Record<string, unknown>[] = json.results ?? [];
      if (results.length === 0) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detail = parseLabel(results[0] as Record<string, any>, q);
      cacheSet(cacheKey, detail);
      return detail;
    } catch {
      continue;
    }
  }

  return null;
}

export async function fetchOpenFdaByImprint(imprint: string): Promise<ApiDrugDetail[]> {
  const q = imprint.trim().toUpperCase();
  if (!q) return [];

  const cacheKey = `openfda_imprint_${q}`;
  const cached = cacheGet<ApiDrugDetail[]>(cacheKey);
  if (cached) return cached;

  try {
    // Search within the full-text of SPL labels for the imprint
    const search = `(openfda.brand_name:"${q}" OR openfda.generic_name:"${q}" OR openfda.substance_name:"${q}")`;
    const url = `${BASE}?search=${encodeURIComponent(search)}&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const json = await res.json();
    const results: Record<string, unknown>[] = json.results ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const details = results.map((r) => parseLabel(r as Record<string, any>, q));
    cacheSet(cacheKey, details, 12 * 60 * 60 * 1000);
    return details;
  } catch {
    return [];
  }
}

export async function fetchOpenFdaByRxcui(rxcui: string, fallbackName: string): Promise<ApiDrugDetail | null> {
  const cacheKey = `openfda_rxcui_${rxcui}`;
  const cached = cacheGet<ApiDrugDetail>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${BASE}?search=openfda.rxcui:"${rxcui}"&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return fetchOpenFdaByName(fallbackName);
    const json = await res.json();
    const results: Record<string, unknown>[] = json.results ?? [];
    if (results.length === 0) return fetchOpenFdaByName(fallbackName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detail = parseLabel(results[0] as Record<string, any>, fallbackName);
    cacheSet(cacheKey, detail);
    return detail;
  } catch {
    return fetchOpenFdaByName(fallbackName);
  }
}
