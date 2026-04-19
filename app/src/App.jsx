import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EligibilityPage from "./pages/EligibilityPage";
import Results from "./pages/Results";
import AgentPage from "./pages/AgentPage";
import LocationsPage from "./pages/LocationsPage";
import EligibilityResults from "./pages/EligibilityResults";
import HomePage from "./pages/HomePage";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/results" element={<Results />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/eligibility-results" element={<EligibilityResults />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
