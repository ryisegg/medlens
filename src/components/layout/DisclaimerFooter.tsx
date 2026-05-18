import { Link } from "react-router-dom";

export function DisclaimerFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200">
      <div className="bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-slate-700">Medical Disclaimer</p>
              <p className="mt-1 text-sm text-slate-600">
                MedLens is for informational purposes only and does not constitute medical
                advice, diagnosis, or treatment. Always consult a qualified healthcare
                provider before starting, stopping, or changing any medication. In an
                emergency, call 911 immediately.{" "}
                <Link to="/safety" className="font-medium text-blue-600 underline hover:text-blue-800">
                  Read full disclaimer
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white px-4 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} MedLens — Educational use only</span>
          <span>Not a substitute for professional medical advice</span>
        </div>
      </div>
    </footer>
  );
}
