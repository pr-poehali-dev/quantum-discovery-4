import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import SessionsPage from "./pages/SessionsPage";
import ObservationsPage from "./pages/ObservationsPage";
import BirdMapPage from "./pages/BirdMapPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DictionariesPage from "./pages/DictionariesPage";
import ReportsPage from "./pages/ReportsPage";
import ExportPage from "./pages/ExportPage";
import ImportPage from "./pages/ImportPage";
import AdminPage from "./pages/AdminPage";
import AuditPage from "./pages/AuditPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<DashboardPage />} />
          <Route path="/sessions"      element={<SessionsPage />} />
          <Route path="/sessions/new"  element={<SessionsPage />} />
          <Route path="/observations"  element={<ObservationsPage />} />
          <Route path="/observations/new" element={<ObservationsPage />} />
          <Route path="/map"           element={<BirdMapPage />} />
          <Route path="/analytics"     element={<AnalyticsPage />} />
          <Route path="/dictionaries"  element={<DictionariesPage />} />
          <Route path="/reports"       element={<ReportsPage />} />
          <Route path="/export"        element={<ExportPage />} />
          <Route path="/import"        element={<ImportPage />} />
          <Route path="/admin"         element={<AdminPage />} />
          <Route path="/audit"         element={<AuditPage />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
