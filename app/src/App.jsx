import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EligibilityPage from "./pages/EligibilityPage";
import Results from "./pages/Results";
import AgentPage from "./pages/AgentPage";
import EligibilityResults from "./pages/EligibilityResults";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eligibility" element={<EligibilityPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/eligibility-results" element={<EligibilityResults />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}