import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { SearchBar } from "../components/shared/SearchBar";
import { DrugCard } from "../components/shared/DrugCard";
import { drugs } from "../data/drugs";
import type { DrugCategory } from "../types";

const CATEGORY_ICONS: Record<DrugCategory, string> = {
  "Pain Relief": "💊",
  "Allergy": "🌿",
  "Cold & Flu": "🤧",
  "Digestive Health": "🫁",
  "Skin": "🧴",
  "Sleep": "🌙",
  "Vitamins": "🌟",
  "Chronic Conditions": "🏥",
};

const CATEGORIES: DrugCategory[] = [
  "Pain Relief", "Allergy", "Cold & Flu", "Digestive Health",
  "Skin", "Sleep", "Vitamins", "Chronic Conditions",
];

const FEATURED_IDS = ["ibuprofen", "loratadine", "omeprazole"];

export function HomePage() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setActiveCategory } = useApp();

  useEffect(() => {
    document.title = "MedLens — Medication Lookup";
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/drugs");
    }
  };

  const handleCategoryClick = (cat: DrugCategory) => {
    setActiveCategory(cat);
    navigate("/drugs");
  };

  const featuredDrugs = FEATURED_IDS.map((id) => drugs.find((d) => d.id === id)).filter(Boolean) as typeof drugs;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Understand your medications
          </h1>
          <p className="mt-3 text-base text-blue-100">
            Look up drugs, identify unknown pills, and get OTC guidance for common symptoms. Always in plain English.
          </p>
          <div className="mt-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by drug name, brand, or ingredient…"
              onSubmit={handleSearch}
              autoFocus={false}
            />
          </div>
          <p className="mt-3 text-xs text-blue-300">
            For informational purposes only — not a substitute for medical advice
          </p>
        </div>
      </section>

      {/* Quick links */}
      <section className="border-b border-slate-100 bg-white px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/drugs"
              className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
                💊
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Drug Dictionary</h3>
                <p className="mt-0.5 text-sm text-slate-500">Search 20+ medications with full details</p>
              </div>
            </Link>
            <Link
              to="/identifier"
              className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
                🔍
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Pill Identifier</h3>
                <p className="mt-0.5 text-sm text-slate-500">Identify unknown pills by color, shape, imprint</p>
              </div>
            </Link>
            <Link
              to="/symptoms"
              className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xl">
                🩺
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Symptom Checker</h3>
                <p className="mt-0.5 text-sm text-slate-500">Get OTC suggestions for common symptoms</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Browse by category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                <span className="text-xs font-medium text-slate-700">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured drugs */}
      <section className="border-t border-slate-100 bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Common medications</h2>
            <Link to="/drugs" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featuredDrugs.map((drug) => (
              <DrugCard
                key={drug.id}
                drug={drug}
                onClick={() => navigate(`/drugs/${drug.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Safety banner */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-semibold text-red-800">Having a medical emergency?</p>
                <p className="mt-1 text-sm text-red-700">
                  If you have chest pain, difficulty breathing, stroke symptoms, or another emergency — <strong>call 911 immediately</strong>. Do not use this app for emergencies.
                </p>
                <Link to="/safety" className="mt-2 inline-block text-sm font-medium text-red-700 underline hover:text-red-900">
                  View emergency resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
