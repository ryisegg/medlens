import { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslations } from "../i18n";

const SLIDE_GRADIENTS = [
  "from-blue-700 via-blue-600 to-cyan-500",
  "from-teal-600 via-emerald-500 to-green-600",
  "from-indigo-700 via-purple-600 to-blue-600",
];

const BG_ACCENT = [
  "bg-blue-500/20",
  "bg-emerald-500/20",
  "bg-indigo-500/20",
];

export function OnboardingPage() {
  const { completeOnboarding, language } = useApp();
  const t = getTranslations(language);
  const o = t.onboarding;
  const [slide, setSlide] = useState(0);

  const slides = [
    { icon: o.slide1Icon, title: o.slide1Title, desc: o.slide1Desc },
    { icon: o.slide2Icon, title: o.slide2Title, desc: o.slide2Desc },
    { icon: o.slide3Icon, title: o.slide3Title, desc: o.slide3Desc },
  ];

  const isLast = slide === slides.length - 1;
  const current = slides[slide];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-br ${SLIDE_GRADIENTS[slide]} transition-all duration-500`}
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Skip */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2">
        <span className="text-white/60 text-sm font-medium">{t.appName}</span>
        <button
          type="button"
          onClick={completeOnboarding}
          className="text-white/70 text-sm font-medium px-3 py-1.5 rounded-full bg-white/10 active:bg-white/20"
        >
          {o.skip}
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        {/* Decorative circle */}
        <div className={`mb-8 flex h-36 w-36 items-center justify-center rounded-full ${BG_ACCENT[slide]}`}>
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20">
            <span className="text-6xl">{current.icon}</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          {current.title}
        </h1>
        <p className="text-base text-white/80 leading-relaxed max-w-sm">
          {current.desc}
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 py-6">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === slide ? "w-6 bg-white" : "w-2 bg-white/35"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* CTA button */}
      <div className="px-6 pb-8 space-y-3">
        <button
          type="button"
          onClick={() => (isLast ? completeOnboarding() : setSlide((s) => s + 1))}
          className="w-full rounded-2xl bg-white py-4 text-base font-bold text-blue-700 shadow-lg active:scale-[0.98] transition-transform"
        >
          {isLast ? o.getStarted : o.next}
        </button>
        {!isLast && (
          <button
            type="button"
            onClick={completeOnboarding}
            className="w-full py-2 text-sm text-white/60"
          >
            {o.skip}
          </button>
        )}
      </div>
    </div>
  );
}
