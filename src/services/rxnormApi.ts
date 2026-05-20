import type { RxNormHit, ApiSearchResult } from "../types/api";
import { getApiUrl, fetchJson } from "./apiClient";
import { cacheGet, cacheSet } from "./cache";
import { normalizeSearchInput } from "../utils/medicalTranslation";

const BASE = "https://rxnav.nlm.nih.gov/REST";

interface RxNormDrugsResponse {
  drugGroup?: {
    conceptGroup?: Array<{
      tty: string;
      conceptProperties?: Array<{ rxcui: string; name: string; tty: string }>;
    }>;
  };
}

interface BackendDrugSearchResponse {
  results?: ApiSearchResult[];
}

function normalizeRxNormResults(json: RxNormDrugsResponse): ApiSearchResult[] {
  const results: ApiSearchResult[] = [];
  const groups = json.drugGroup?.conceptGroup ?? [];

  for (const group of groups) {
    for (const concept of group.conceptProperties ?? []) {
      // Only keep top-level types: brand (SBD/SBN), generic (SCD/GPCK), ingredient (IN/MIN)
      if (["SBD", "SBN", "SCD", "GPCK", "IN", "MIN", "BN"].includes(concept.tty)) {
        results.push({
          rxcui: concept.rxcui,
          name: concept.name,
          tty: concept.tty,
          source: "RxNorm",
        });
      }
    }
  }

  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.rxcui)) return false;
    seen.add(r.rxcui);
    return true;
  }).slice(0, 20);
}

async function searchRxNormDirect(q: string): Promise<ApiSearchResult[]> {
  const url = `${BASE}/drugs.json?name=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RxNorm error ${res.status}`);

  const json: RxNormDrugsResponse = await res.json();
  return normalizeRxNormResults(json);
}

export async function searchRxNorm(query: string): Promise<ApiSearchResult[]> {
  const raw = query.trim();
  if (!raw) return [];
  // Translate Chinese input to English before hitting RxNorm
  const q = normalizeSearchInput(raw);

  const cacheKey = `rxnorm_search_${q.toLowerCase()}`;
  const cached = cacheGet<ApiSearchResult[]>(cacheKey);
  if (cached) return cached;

  const backendUrl = getApiUrl(`/api/drug-search?q=${encodeURIComponent(q)}`);

  let results: ApiSearchResult[];
  try {
    const data = await fetchJson<BackendDrugSearchResponse>(backendUrl);
    results = data.results ?? [];
  } catch {
    results = await searchRxNormDirect(q);
  }

  cacheSet(cacheKey, results, 6 * 60 * 60 * 1000); // 6-hour cache for search
  return results;
}

interface SpellingSuggestionResponse {
  suggestionGroup?: {
    suggestionList?: { suggestion?: string[] };
  };
}

export async function getSpellingSuggestions(query: string): Promise<string[]> {
  const q = query.trim();
  if (!q || q.length < 3) return [];

  const cacheKey = `rxnorm_spell_${q.toLowerCase()}`;
  const cached = cacheGet<string[]>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${BASE}/spellingsuggestions.json?name=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json: SpellingSuggestionResponse = await res.json();
    const suggestions = json.suggestionGroup?.suggestionList?.suggestion ?? [];
    cacheSet(cacheKey, suggestions, 60 * 60 * 1000); // 1-hour cache
    return suggestions.slice(0, 4);
  } catch {
    return [];
  }
}

export async function getRxNormInfo(rxcui: string): Promise<RxNormHit | null> {
  const cacheKey = `rxnorm_info_${rxcui}`;
  const cached = cacheGet<RxNormHit>(cacheKey);
  if (cached) return cached;

  const url = `${BASE}/rxcui/${rxcui}/allProperties.json?prop=names`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const json = await res.json();
  const name: string = json?.propConceptGroup?.propConcept?.[0]?.propValue ?? "";
  if (!name) return null;

  const hit: RxNormHit = { rxcui, name, tty: "IN" };
  cacheSet(cacheKey, hit);
  return hit;
}
