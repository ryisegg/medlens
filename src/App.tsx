import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { NavBar } from "./components/layout/NavBar";
import { DisclaimerFooter } from "./components/layout/DisclaimerFooter";
import { HomePage } from "./pages/HomePage";
import { DrugSearchPage } from "./pages/DrugSearchPage";
import { DrugDetailRoute } from "./pages/DrugDetailRoute";
import { IdentifierPage } from "./pages/IdentifierPage";
import { SymptomPage } from "./pages/SymptomPage";
import { SafetyPage } from "./pages/SafetyPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <ScrollToTop />
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/drugs" element={<DrugSearchPage />} />
            <Route path="/drugs/:id" element={<DrugDetailRoute />} />
            <Route path="/identifier" element={<IdentifierPage />} />
            <Route path="/symptoms" element={<SymptomPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route
              path="*"
              element={
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
                  <div className="text-6xl font-bold text-slate-200">404</div>
                  <h1 className="text-2xl font-semibold text-slate-800">Page not found</h1>
                  <p className="text-slate-500">
                    The page you're looking for doesn't exist.
                  </p>
                  <a href="/" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                    Go home
                  </a>
                </div>
              }
            />
          </Routes>
        </main>
        <DisclaimerFooter />
      </div>
    </AppProvider>
  );
}

export default App;
