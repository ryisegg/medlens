import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDrugById } from "../data/catalog";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { DrugDetailPage } from "../components/drugs/DrugDetailPage";

export function DrugDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, addToRecentlyViewed } = useApp();
  const t = getTranslations(language);
  const drug = id ? getDrugById(id) : undefined;

  useEffect(() => {
    if (drug) {
      document.title = `${drug.name} — ${t.appName}`;
      addToRecentlyViewed(drug);
    } else {
      document.title = `Not Found — ${t.appName}`;
    }
  }, [drug, t.appName, addToRecentlyViewed]);

  if (!drug) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl font-bold text-slate-200 dark:text-slate-700">404</div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Medication not found</h1>
        <p className="text-slate-500 dark:text-[#8e8e93]">"{id}" doesn't exist in our database.</p>
        <button
          type="button"
          onClick={() => navigate("/drugs")}
          className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white dark:bg-[#0a84ff]"
        >
          {t.drug.backToSearch}
        </button>
      </div>
    );
  }

  return <DrugDetailPage drug={drug} />;
}
