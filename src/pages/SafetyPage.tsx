import { useEffect } from "react";
import { WarningBanner } from "../components/shared/WarningBanner";

export function SafetyPage() {
  useEffect(() => {
    document.title = "Safety & Disclaimer — MedLens";
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Safety Information & Disclaimer</h1>

      <div className="space-y-6">
        <WarningBanner
          level="emergency"
          title="In an emergency, call 911"
          message="If you or someone else is experiencing a medical emergency — including chest pain, difficulty breathing, stroke symptoms, severe allergic reaction, overdose, or suicidal crisis — call 911 or your local emergency number immediately. Do not use this app in place of emergency services."
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Medical Disclaimer</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              MedLens is an educational tool designed to provide general information about common medications. It is <strong>not</strong> a medical device, and the information it provides does not constitute medical advice, medical diagnosis, or treatment recommendations.
            </p>
            <p>
              All medication information on MedLens is for general educational purposes only. Individual responses to medications vary greatly based on age, weight, health conditions, other medications, and other factors.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Always Consult a Professional When…</h2>
          <ul className="space-y-2.5">
            {[
              "You are unsure whether a medication is right for you",
              "You take prescription drugs or have chronic health conditions",
              "You are pregnant, breastfeeding, or planning to become pregnant",
              "You are giving medication to a child or elderly person",
              "Your symptoms are severe, unusual, or getting worse",
              "You are considering stopping or changing a prescription medication",
              "You think you may have drug interactions",
              "You experience unexpected side effects",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex-shrink-0 text-blue-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Emergency Resources</h2>
          <div className="space-y-3">
            {[
              { name: "Emergency Services", number: "911", desc: "Life-threatening emergencies" },
              { name: "Poison Control", number: "1-800-222-1222", desc: "Suspected overdose or poisoning" },
              { name: "Suicide & Crisis Lifeline", number: "988", desc: "Mental health crisis (call or text)" },
              { name: "Crisis Text Line", number: "Text HOME to 741741", desc: "Text-based crisis support" },
            ].map((resource) => (
              <div key={resource.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{resource.name}</p>
                  <p className="text-xs text-slate-500">{resource.desc}</p>
                </div>
                <span className="text-sm font-bold text-blue-700">{resource.number}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">About Our Data</h2>
          <p className="text-sm text-slate-700">
            Medication information on MedLens is sourced from publicly available references including FDA drug labels, NIH MedlinePlus, and major clinical guidelines. Data is for educational purposes and may not reflect the most current prescribing information. Always check with your pharmacist or the current package insert for up-to-date information.
          </p>
        </section>
      </div>
    </div>
  );
}
