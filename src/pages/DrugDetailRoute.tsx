import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDrugById } from "../data/drugs";
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
        <div className="text-5xl font-bold text-slate-200">404</div>
        <h1 className="text-xl font-semibold text-slate-800">Medication not found</h1>
        <p className="text-slate-500">"{id}" doesn't exist in our database.</p>
        <button
          type="button"
          onClick={() => navigate("/drugs")}
          className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
        >
          {t.drug.backToSearch}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-slate-100 px-4 py-2.5">
        <button
          type="button"
          onClick={() => navigate("/drugs")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {t.drug.backToSearch}
        </button>
      </div>
      <DrugDetailPage drug={drug} />
    </>
  );
}
