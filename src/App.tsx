import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { TopBar } from "./components/layout/TopBar";
import { TabBar } from "./components/layout/TabBar";
import { HomePage } from "./pages/HomePage";
import { DrugSearchPage } from "./pages/DrugSearchPage";
import { DrugDetailRoute } from "./pages/DrugDetailRoute";
import { IdentifierPage } from "./pages/IdentifierPage";
import { SymptomPage } from "./pages/SymptomPage";
import { SafetyPage } from "./pages/SafetyPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-6xl font-bold text-slate-200">404</div>
      <h1 className="text-2xl font-semibold text-slate-800">Page not found</h1>
      <a href="/" className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white">
        Go home
      </a>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-100">
        <ScrollToTop />
        <TopBar />
        {/* pt-12 = TopBar height, pb-20 = TabBar height + safe area */}
        <main className="pt-12 pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/drugs" element={<DrugSearchPage />} />
            <Route path="/drugs/:id" element={<DrugDetailRoute />} />
            <Route path="/identifier" element={<IdentifierPage />} />
            <Route path="/symptoms" element={<SymptomPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </AppProvider>
  );
}

export default App;
