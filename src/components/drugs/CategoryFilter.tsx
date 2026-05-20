import type { DrugCategory } from "../../types";
import { ALL_CATEGORIES } from "../../data/catalog";

interface CategoryFilterProps {
  active: DrugCategory | "All";
  onChange: (c: DrugCategory | "All") => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            active === cat
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
