import type { ApiSearchResult, ApiDrugDetail } from "../types/api";
import { getRxNormInfo, searchRxNorm } from "./rxnormApi";
import { fetchOpenFdaByName, fetchOpenFdaByRxcui } from "./openFdaApi";
import { fetchDailyMedByName } from "./dailymedApi";

export type { ApiSearchResult, ApiDrugDetail };

export async function searchDrugsLive(query: string): Promise<ApiSearchResult[]> {
  return searchRxNorm(query);
}

function simplifyRxNormName(name: string): string | null {
  const withoutPack = name.replace(/^\{.*?\}\s*Pack$/i, "").trim();
  const withoutBrand = withoutPack.replace(/\s*\[[^\]]+\]\s*$/g, "").trim();
  const beforeStrength = withoutBrand.split(/\s+\d+(?:\.\d+)?\s*(?:MG|MCG|G|ML|%|UNT|ACTUAT)\b/i)[0]?.trim();
  if (!beforeStrength || beforeStrength.length < 3 || beforeStrength === name) return null;
  return beforeStrength;
}

async function fetchByCandidateNames(names: string[]): Promise<ApiDrugDetail | null> {
  const uniqueNames = [...new Set(names.map((name) => name.trim()).filter(Boolean))];

  for (const name of uniqueNames) {
    const openFdaResult = await fetchOpenFdaByName(name);
    if (openFdaResult?.indicationsAndUsage || openFdaResult?.warnings || openFdaResult?.adverseReactions) {
      return openFdaResult;
    }

    const dmDetail = await fetchDailyMedByName(name);
    if (dmDetail) {
      if (openFdaResult) {
        return {
          ...openFdaResult,
          source: "DailyMed",
          sourceUrl: dmDetail.sourceUrl,
        };
      }
      return dmDetail;
    }

    if (openFdaResult) return openFdaResult;
  }

  return null;
}

export async function fetchDrugDetail(
  nameOrRxcui: string,
  isRxcui = false
): Promise<ApiDrugDetail | null> {
  const rxNormInfo = isRxcui ? await getRxNormInfo(nameOrRxcui) : null;
  const lookupName = rxNormInfo?.name ?? nameOrRxcui;
  const simplifiedName = simplifyRxNormName(lookupName);

  if (isRxcui) {
    const openFdaByRxcui = await fetchOpenFdaByRxcui(nameOrRxcui, simplifiedName ?? lookupName);
    if (openFdaByRxcui?.indicationsAndUsage || openFdaByRxcui?.warnings || openFdaByRxcui?.adverseReactions) {
      return openFdaByRxcui;
    }
  }

  return fetchByCandidateNames([lookupName, simplifiedName ?? ""]);
}
