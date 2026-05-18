import type { RxNormHit, ApiSearchResult } from "../types/api";
import { cacheGet, cacheSet } from "./cache";

const BASE = "https://rxnav.nlm.nih.gov/REST";

interface RxNormDrugsResponse {
  drugGroup?: {
    conceptGroup?: Array<{
      tty: string;
      conceptProperties?: Array<{ rxcui: string; name: string; tty: string }>;
    }>;
  };
}

export async function searchRxNorm(query: string): Promise<ApiSearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const cacheKey = `rxnorm_search_${q.toLowerCase()}`;
  const cached = cacheGet<ApiSearchResult[]>(cacheKey);
  if (cached) return cached;

  const url = `${BASE}/drugs.json?name=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RxNorm error ${res.status}`);

  const json: RxNormDrugsResponse = await res.json();
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

  // De-duplicate by rxcui, limit to 20
  const seen = new Set<string>();
  const deduped = results.filter((r) => {
    if (seen.has(r.rxcui)) return false;
    seen.add(r.rxcui);
    return true;
  }).slice(0, 20);

  cacheSet(cacheKey, deduped, 6 * 60 * 60 * 1000); // 6-hour cache for search
  return deduped;
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
