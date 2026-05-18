import { useNavigate } from "react-router-dom";
import type { Drug } from "../../types";
import { DrugCard } from "../shared/DrugCard";

interface DrugGridProps {
  drugs: Drug[];
  emptyMessage?: string;
}

export function DrugGrid({ drugs, emptyMessage = "No medications found." }: DrugGridProps) {
  const navigate = useNavigate();

  if (drugs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {drugs.map((drug) => (
        <DrugCard
          key={drug.id}
          drug={drug}
          onClick={() => navigate(`/drugs/${drug.id}`)}
        />
      ))}
    </div>
  );
}
