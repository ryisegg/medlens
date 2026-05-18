import type { ApiSearchResult, ApiDrugDetail } from "../types/api";
import { searchRxNorm } from "./rxnormApi";
import { fetchOpenFdaByName, fetchOpenFdaByRxcui } from "./openFdaApi";
import { fetchDailyMedByName } from "./dailymedApi";

export type { ApiSearchResult, ApiDrugDetail };

export async function searchDrugsLive(query: string): Promise<ApiSearchResult[]> {
  return searchRxNorm(query);
}

export async function fetchDrugDetail(
  nameOrRxcui: string,
  isRxcui = false
): Promise<ApiDrugDetail | null> {
  const openFdaResult = isRxcui
    ? await fetchOpenFdaByRxcui(nameOrRxcui, nameOrRxcui)
    : await fetchOpenFdaByName(nameOrRxcui);

  // If openFDA has substantive content, return it directly
  if (openFdaResult?.indicationsAndUsage || openFdaResult?.warnings || openFdaResult?.adverseReactions) {
    return openFdaResult;
  }

  // Otherwise try DailyMed as fallback
  const dmDetail = await fetchDailyMedByName(nameOrRxcui);
  if (dmDetail) {
    // Merge: if openFDA had partial data (name/brand), prefer it but fill source from DailyMed
    if (openFdaResult) {
      return {
        ...openFdaResult,
        source: "DailyMed",
        sourceUrl: dmDetail.sourceUrl,
      };
    }
    return dmDetail;
  }

  return openFdaResult;
}
