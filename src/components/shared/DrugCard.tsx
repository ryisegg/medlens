import type { Drug, DrugCategory } from "../../types";

interface DrugCardProps {
  drug: Drug;
  onClick?: () => void;
}

const CATEGORY_COLORS: Record<DrugCategory, string> = {
  "Pain Relief": "bg-red-100 text-red-700",
  "Allergy": "bg-purple-100 text-purple-700",
  "Cold & Flu": "bg-blue-100 text-blue-700",
  "Digestive Health": "bg-orange-100 text-orange-700",
  "Skin": "bg-green-100 text-green-700",
  "Sleep": "bg-indigo-100 text-indigo-700",
  "Vitamins": "bg-yellow-100 text-yellow-700",
  "Chronic Conditions": "bg-slate-100 text-slate-700",
};

export function DrugCard({ drug, onClick }: DrugCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[drug.category]}`}>
            {drug.category}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              drug.otcOrRx === "OTC"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {drug.otcOrRx}
          </span>
        </div>
      </div>
      <h3 className="mt-2.5 text-base font-semibold text-slate-900">{drug.name}</h3>
      <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">{drug.description}</p>
      {drug.brandNames.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          Also: {drug.brandNames.slice(0, 3).join(", ")}
        </p>
      )}
    </button>
  );
}
