import { useEffect } from "react";
import { IdentifierForm } from "../components/identifier/IdentifierForm";

export function IdentifierPage() {
  useEffect(() => {
    document.title = "Pill Identifier — MedLens";
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Unknown Pill Identifier</h1>
        <p className="text-sm text-slate-500">
          Enter pill characteristics to find possible matches. Always verify with a pharmacist.
        </p>
      </div>
      <IdentifierForm />
    </div>
  );
}
