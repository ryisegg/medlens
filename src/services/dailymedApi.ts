import type { ApiDrugDetail } from "../types/api";
import { cacheGet, cacheSet } from "./cache";

const BASE = "https://dailymed.nlm.nih.gov/dailymed/services/v2";

interface DailyMedNameResult {
  setid: string;
  title: string;
}

interface DailyMedNameResponse {
  data?: DailyMedNameResult[];
}

interface DailyMedSplResult {
  setid: string;
  title: string;
  // sections omitted — too large for a simple lookup
}

interface DailyMedSplResponse {
  data?: DailyMedSplResult;
}

export async function fetchDailyMedByName(name: string): Promise<ApiDrugDetail | null> {
  const q = name.trim();
  if (!q) return null;

  const cacheKey = `dailymed_${q.toLowerCase().replace(/\s+/g, "_")}`;
  const cached = cacheGet<ApiDrugDetail>(cacheKey);
  if (cached) return cached;

  try {
    // Step 1: look up name → setid
    const searchUrl = `${BASE}/drugnames.json?drug_name=${encodeURIComponent(q)}&pagesize=1`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return null;

    const searchJson: DailyMedNameResponse = await searchRes.json();
    const items = searchJson.data ?? [];
    if (items.length === 0) return null;

    const { setid, title } = items[0];

    // Step 2: fetch SPL metadata for that setid
    const splUrl = `${BASE}/spls/${setid}.json`;
    const splRes = await fetch(splUrl);
    if (!splRes.ok) {
      // Return a minimal record from name search alone
      const minimal: ApiDrugDetail = {
        name: title,
        brandNames: [],
        otcOrRx: "unknown",
        source: "DailyMed",
        sourceUrl: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setid}`,
        lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      };
      cacheSet(cacheKey, minimal);
      return minimal;
    }

    const splJson: DailyMedSplResponse = await splRes.json();
    const spl = splJson.data;

    const detail: ApiDrugDetail = {
      name: spl?.title ?? title,
      brandNames: [],
      otcOrRx: "unknown",
      source: "DailyMed",
      sourceUrl: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setid}`,
      lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };

    cacheSet(cacheKey, detail);
    return detail;
  } catch {
    return null;
  }
}
