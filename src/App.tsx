import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { useApp } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { MedicationProvider } from "./context/MedicationContext";
import { TopBar } from "./components/layout/TopBar";
import { TabBar } from "./components/layout/TabBar";
import { HomePage } from "./pages/HomePage";
import { DrugSearchPage } from "./pages/DrugSearchPage";
import { DrugDetailRoute } from "./pages/DrugDetailRoute";
import { ApiDrugDetailRoute } from "./pages/ApiDrugDetailRoute";
import { IdentifierPage } from "./pages/IdentifierPage";
import { SymptomPage } from "./pages/SymptomPage";
import { CalendarPage } from "./pages/CalendarPage";
import { CabinetPage } from "./pages/CabinetPage";
import { SafetyPage } from "./pages/SafetyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { TCMHerbDetailPage } from "./pages/TCMHerbDetailPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-6xl font-bold text-slate-200 dark:text-slate-700">404</div>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Page not found</h1>
      <a href="/" className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white">
        Go home
      </a>
    </div>
  );
}

function AppShell() {
  const { isDark, hasOnboarded } = useApp();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  if (!hasOnboarded) {
    return <OnboardingPage />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a]">
      <ScrollToTop />
      <TopBar />
      <main className="pt-12 pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/drugs" element={<DrugSearchPage />} />
          <Route path="/drugs/api/:name" element={<ApiDrugDetailRoute />} />
          <Route path="/drugs/:id" element={<DrugDetailRoute />} />
          <Route path="/identifier" element={<IdentifierPage />} />
          <Route path="/symptoms" element={<SymptomPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tcm/:id" element={<TCMHerbDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MedicationProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </MedicationProvider>
    </AuthProvider>
  );
}

export default App;
