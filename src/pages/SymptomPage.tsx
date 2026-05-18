import { useEffect } from "react";
import { SymptomChecker } from "../components/symptoms/SymptomChecker";

export function SymptomPage() {
  useEffect(() => {
    document.title = "Symptom Checker — MedLens";
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Symptom Checker</h1>
        <p className="text-sm text-slate-500">
          Describe your symptoms to see general OTC medication options. This does not replace a doctor's advice.
        </p>
      </div>
      <SymptomChecker />
    </div>
  );
}
