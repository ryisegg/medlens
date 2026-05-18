import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getTranslations } from "../../i18n";
import { WarningBanner } from "../shared/WarningBanner";
import { Spinner } from "../shared/Spinner";
import { fetchOpenFdaByImprint } from "../../services/openFdaApi";
import type { PillColor, PillShape } from "../../types";
import type { ApiDrugDetail } from "../../types/api";

const PILL_COLORS: PillColor[] = [
  "white", "off-white", "yellow", "orange", "pink", "red",
  "purple", "blue", "green", "brown", "gray", "black", "clear",
];
const PILL_SHAPES: PillShape[] = [
  "round", "oval", "oblong", "capsule", "square",
  "diamond", "pentagon", "hexagon", "triangle",
];
const CONFIDENCE_BADGE = {
  high:   "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  low:    "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]",
};
const SELECT_CLASS = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:focus:border-[#0a84ff]";
const INPUT_CLASS  = "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-[#3a3a3c] dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-[#636366] dark:focus:border-[#0a84ff]";
const LABEL_CLASS  = "mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-[#636366]";

interface ApiResult {
  drug: ApiDrugDetail;
  confidence: "high" | "medium" | "low";
  matchedOn: string[];
}

export function IdentifierForm() {
  const { language, pillQuery, setPillQuery, identifierResults, runIdentifier } = useApp();
  const t = getTranslations(language);
  const ti = t.identifier;
  const navigate = useNavigate();

  const [apiResults, setApiResults] = useState<ApiResult[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const hasAnyInput = pillQuery.color || pillQuery.shape || pillQuery.imprint.trim() || pillQuery.scored;

  async function handleSearch() {
    // Always run mock identifier
    runIdentifier();

    // If imprint provided, also search openFDA
    const imprint = pillQuery.imprint.trim();
    if (imprint) {
      setApiLoading(true);
      setApiError(null);
      setApiResults([]);
      try {
        const results = await fetchOpenFdaByImprint(imprint);
        const mapped: ApiResult[] = results.map((drug) => ({
          drug,
          confidence: "medium",
          matchedOn: ["imprint"],
        }));
        setApiResults(mapped);
      } catch {
        setApiError("Could not reach FDA database. Showing local results only.");
      } finally {
        setApiLoading(false);
      }
    } else {
      setApiResults([]);
    }
  }

  return (
    <div className="space-y-3 px-4 py-4">
      <WarningBanner level="caution" title={ti.disclaimer} message={ti.disclaimerDesc} />

      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm space-y-4 dark:bg-[#1c1c1e]">
        {/* Color */}
        <div>
          <label className={LABEL_CLASS}>{ti.color}</label>
          <select
            value={pillQuery.color}
            onChange={(e) => setPillQuery({ ...pillQuery, color: e.target.value as PillColor | "" })}
            className={SELECT_CLASS}
          >
            <option value="">{ti.anyColor}</option>
            {PILL_COLORS.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Shape */}
        <div>
          <label className={LABEL_CLASS}>{ti.shape}</label>
          <select
            value={pillQuery.shape}
            onChange={(e) => setPillQuery({ ...pillQuery, shape: e.target.value as PillShape | "" })}
            className={SELECT_CLASS}
          >
            <option value="">{ti.anyShape}</option>
            {PILL_SHAPES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Scored */}
        <div>
          <label className={LABEL_CLASS}>{ti.scoredDesc}</label>
          <div className="flex gap-2">
            {(["", "yes", "no"] as const).map((val) => {
              const label = val === "" ? ti.scoredAny : val === "yes" ? ti.scored : ti.notScored;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPillQuery({ ...pillQuery, scored: val })}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                    pillQuery.scored === val
                      ? "bg-blue-600 text-white dark:bg-[#0a84ff]"
                      : "bg-slate-100 text-slate-600 dark:bg-[#2c2c2e] dark:text-[#8e8e93]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Imprint */}
        <div>
          <label className={LABEL_CLASS}>
            {ti.imprint}{" "}
            <span className="normal-case font-normal text-blue-600 dark:text-[#0a84ff]">· Searches FDA database</span>
          </label>
          <input
            type="text"
            value={pillQuery.imprint}
            onChange={(e) => setPillQuery({ ...pillQuery, imprint: e.target.value })}
            placeholder={ti.imprintPlaceholder}
            className={INPUT_CLASS}
          />
        </div>

        {/* Strength */}
        <div>
          <label className={LABEL_CLASS}>{ti.strength}</label>
          <input
            type="text"
            value={pillQuery.strength}
            onChange={(e) => setPillQuery({ ...pillQuery, strength: e.target.value })}
            placeholder={ti.strengthPlaceholder}
            className={INPUT_CLASS}
          />
        </div>

        {/* Image upload placeholder */}
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center dark:border-[#3a3a3c]">
          <svg className="mx-auto h-8 w-8 text-slate-300 dark:text-[#3a3a3c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          <p className="mt-2 text-sm text-slate-400 dark:text-[#636366]">{ti.imageUpload}</p>
          <p className="text-xs text-slate-400 dark:text-[#636366]">{ti.imageUploadSub}</p>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={!hasAnyInput}
          className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white transition disabled:opacity-40 dark:bg-[#0a84ff]"
        >
          {ti.searchButton}
        </button>
      </div>

      {/* FDA API results (imprint search) */}
      {apiLoading && (
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
          <Spinner size="sm" />
          <p className="text-sm text-slate-600 dark:text-[#8e8e93]">{t.api.loadingLive}</p>
        </div>
      )}

      {apiError && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 dark:bg-amber-950/30 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-300">{apiError}</p>
        </div>
      )}

      {apiResults.length > 0 && (
        <div className="space-y-3">
          <p className="px-1 text-sm font-semibold text-slate-700 dark:text-white">
            {apiResults.length} FDA result{apiResults.length !== 1 ? "s" : ""} for "{pillQuery.imprint}"
          </p>
          {apiResults.map((result, i) => (
            <div key={i} className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    type="button"
                    onClick={() => navigate(`/drugs/api/${encodeURIComponent(result.drug.name)}`)}
                    className="text-left text-base font-semibold text-blue-700 dark:text-[#0a84ff]"
                  >
                    {result.drug.name}
                  </button>
                  {result.drug.genericName && (
                    <p className="text-sm text-slate-500 dark:text-[#8e8e93]">{result.drug.genericName}</p>
                  )}
                </div>
                <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CONFIDENCE_BADGE[result.confidence]}`}>
                  {ti.confidence[result.confidence]}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400 dark:text-[#636366]">
                Matched on: {result.matchedOn.join(", ")} · FDA Drug Label
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Mock local results */}
      {identifierResults.length > 0 && (
        <div className="space-y-3">
          <p className="px-1 text-sm font-semibold text-slate-700 dark:text-white">
            {identifierResults.length}{" "}
            {identifierResults.length === 1 ? ti.resultsFound : ti.resultsFountPlural}
            {" "}· local database
          </p>
          {identifierResults.map((result, i) => (
            <div key={i} className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-[#1c1c1e]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    type="button"
                    onClick={() => navigate(`/drugs/${result.drug.id}`)}
                    className="text-left text-base font-semibold text-blue-700 dark:text-[#0a84ff]"
                  >
                    {result.drug.name}
                  </button>
                  <p className="text-sm text-slate-500 dark:text-[#8e8e93]">{result.drug.genericName}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CONFIDENCE_BADGE[result.confidence]}`}>
                  {ti.confidence[result.confidence]}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 dark:text-[#636366]">
                {ti.matchedOn}: {result.matchedOn.join(", ")}
              </p>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2 dark:text-[#8e8e93]">{result.drug.description}</p>
            </div>
          ))}
          <WarningBanner level="caution" title={ti.disclaimer} message={ti.disclaimerDesc} />
        </div>
      )}
    </div>
  );
}
