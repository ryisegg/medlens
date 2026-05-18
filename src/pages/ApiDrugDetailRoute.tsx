import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";
import { useApiDrug } from "../hooks/useApiDrug";
import { ApiDrugDetailView } from "../components/drugs/ApiDrugDetail";
import { DrugDetailSkeleton } from "../components/shared/DrugCardSkeleton";

export function ApiDrugDetailRoute() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { language } = useApp();
  const t = getTranslations(language);

  const decodedName = name ? decodeURIComponent(name) : "";
  const { drug, loading, error } = useApiDrug(decodedName);

  useEffect(() => {
    if (drug) {
      document.title = `${drug.name} — ${t.appName}`;
    } else if (!loading) {
      document.title = `${t.api.notFound} — ${t.appName}`;
    }
  }, [drug, loading, t.appName, t.api.notFound]);

  if (loading) {
    return <DrugDetailSkeleton />;
  }

  if (error || !drug) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl">🔍</div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{t.api.notFound}</h1>
        <p className="text-sm text-slate-500 dark:text-[#8e8e93]">
          {error ?? `"${decodedName}" ${t.api.notFoundDesc}`}
        </p>
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

  return <ApiDrugDetailView drug={drug} />;
}
