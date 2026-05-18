import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getDrugById } from "../data/drugs";
import { DrugDetailPage } from "../components/drugs/DrugDetailPage";

export function DrugDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const drug = id ? getDrugById(id) : undefined;

  useEffect(() => {
    if (drug) {
      document.title = `${drug.name} — MedLens`;
    } else {
      document.title = "Not Found — MedLens";
    }
  }, [drug]);

  if (!drug) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl font-bold text-slate-200">404</div>
        <h1 className="text-xl font-semibold text-slate-800">Medication not found</h1>
        <p className="text-slate-500">The medication "{id}" doesn't exist in our database.</p>
        <Link to="/drugs" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          Back to Drug Search
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
        <div className="mx-auto max-w-3xl">
          <Link to="/drugs" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Drug Search
          </Link>
        </div>
      </div>
      <DrugDetailPage drug={drug} />
    </>
  );
}
