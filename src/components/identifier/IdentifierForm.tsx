import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { WarningBanner } from "../shared/WarningBanner";
import type { PillColor, PillShape } from "../../types";

const PILL_COLORS: PillColor[] = [
  "white", "off-white", "yellow", "orange", "pink", "red",
  "purple", "blue", "green", "brown", "gray", "black", "clear",
];

const PILL_SHAPES: PillShape[] = [
  "round", "oval", "oblong", "capsule", "square",
  "diamond", "pentagon", "hexagon", "triangle",
];

const CONFIDENCE_BADGE = {
  high: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-slate-100 text-slate-600",
};

export function IdentifierForm() {
  const { pillQuery, setPillQuery, identifierResults, runIdentifier } = useApp();
  const navigate = useNavigate();

  const hasAnyInput = pillQuery.color || pillQuery.shape || pillQuery.imprint.trim();

  return (
    <div className="space-y-5">
      <WarningBanner
        level="caution"
        title="Always verify with a pharmacist or doctor"
        message="Pill identification by physical characteristics alone is not definitive. Always confirm an unknown medication with a licensed pharmacist or healthcare provider before taking it."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Describe the pill</h2>

        <div className="space-y-4">
          {/* Color */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Color</label>
            <select
              value={pillQuery.color}
              onChange={(e) => setPillQuery({ ...pillQuery, color: e.target.value as PillColor | "" })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Any color</option>
              {PILL_COLORS.map((c) => (
                <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Shape */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Shape</label>
            <select
              value={pillQuery.shape}
              onChange={(e) => setPillQuery({ ...pillQuery, shape: e.target.value as PillShape | "" })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Any shape</option>
              {PILL_SHAPES.map((s) => (
                <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Imprint */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Imprint code</label>
            <input
              type="text"
              value={pillQuery.imprint}
              onChange={(e) => setPillQuery({ ...pillQuery, imprint: e.target.value })}
              placeholder="e.g. I2, ADVIL, 44 183"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Strength */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Dosage strength (optional)</label>
            <input
              type="text"
              value={pillQuery.strength}
              onChange={(e) => setPillQuery({ ...pillQuery, strength: e.target.value })}
              placeholder="e.g. 200 mg, 500 mg"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Image placeholder */}
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center">
            <svg className="mx-auto h-8 w-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <p className="mt-2 text-sm text-slate-400">Image upload coming soon</p>
            <p className="text-xs text-slate-400">For now, use the fields above to describe the pill</p>
          </div>
        </div>

        <button
          type="button"
          onClick={runIdentifier}
          disabled={!hasAnyInput}
          className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search Pills
        </button>
      </div>

      {/* Results */}
      {identifierResults.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            {identifierResults.length} possible match{identifierResults.length !== 1 ? "es" : ""} found
          </p>
          {identifierResults.map((result, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    type="button"
                    onClick={() => navigate(`/drugs/${result.drug.id}`)}
                    className="text-left text-base font-semibold text-blue-700 hover:underline"
                  >
                    {result.drug.name}
                  </button>
                  <p className="text-sm text-slate-500">{result.drug.genericName}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CONFIDENCE_BADGE[result.confidence]}`}>
                  {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} match
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Matched on: {result.matchedOn.join(", ")}
              </p>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{result.drug.description}</p>
            </div>
          ))}
          <WarningBanner
            level="caution"
            title="Verify with a pharmacist"
            message="These are possible matches only. Do not take any medication based solely on appearance. Always confirm the identity of an unknown pill with a licensed pharmacist."
          />
        </div>
      )}

      {identifierResults.length === 0 && hasAnyInput && (
        <p className="text-center text-sm text-slate-500">
          Click "Search Pills" to find matches. No results will appear until you search.
        </p>
      )}
    </div>
  );
}
