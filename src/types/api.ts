export interface RxNormHit {
  rxcui: string;
  name: string;
  tty: string; // "SCD", "SBD", "IN", "BN", etc.
}

export interface ApiDrugDetail {
  rxcui?: string;
  name: string;
  genericName?: string;
  brandNames: string[];
  otcOrRx: "OTC" | "Rx" | "unknown";
  description?: string;
  indicationsAndUsage?: string;
  warnings?: string;
  adverseReactions?: string;
  contraindications?: string;
  drugInteractions?: string;
  dosageAndAdministration?: string;
  dosageForms?: string[];
  activeIngredients?: string[];
  pregnancyInfo?: string;
  nursingMotherInfo?: string;
  keepOutOfReachOfChildren?: string;
  source: "openFDA" | "DailyMed" | "mock";
  sourceUrl?: string;
  lastUpdated: string;
}

export interface ApiSearchResult {
  rxcui: string;
  name: string;
  genericName?: string;
  tty: string;
  source: "RxNorm";
}
