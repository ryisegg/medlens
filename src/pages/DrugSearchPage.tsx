import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { SearchBar } from "../components/shared/SearchBar";
import { CategoryFilter } from "../components/drugs/CategoryFilter";
import { DrugGrid } from "../components/drugs/DrugGrid";

export function DrugSearchPage() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory, filteredDrugs } = useApp();

  useEffect(() => {
    document.title = "Drug Search — MedLens";
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Drug Dictionary</h1>
        <p className="text-sm text-slate-500">
          Search by name, brand, generic name, or active ingredient.
        </p>
      </div>

      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search medications, brands, or ingredients…"
          autoFocus
        />
      </div>

      <div className="mb-6">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      <div className="mb-3 text-sm text-slate-500">
        {filteredDrugs.length} medication{filteredDrugs.length !== 1 ? "s" : ""} found
      </div>

      <DrugGrid
        drugs={filteredDrugs}
        emptyMessage="No medications match your search. Try a different name or category."
      />
    </div>
  );
}
