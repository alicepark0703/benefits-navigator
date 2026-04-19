import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EligibilityPage from "./pages/EligibilityPage";
import Results from "./pages/Results";
import AgentPage from "./pages/AgentPage";
import LocationsPage from "./pages/LocationsPage";
import EligibilityResults from "./pages/EligibilityResults";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home/eligibility" element={<EligibilityPage />} />
        <Route path="/home/results" element={<Results />} />
        <Route path="/home/agent" element={<AgentPage />} />
        <Route path="/home/eligibility-results" element={<EligibilityResults />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/locations" element={<LocationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}