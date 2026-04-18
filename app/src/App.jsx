import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EligibilityPage from "./pages/EligibilityPage";
import Results from "./pages/Results";
import AgentPage from "./pages/AgentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eligibility" element={<EligibilityPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/chatbot" element={<AgentPage />} />
      </Routes>
    </BrowserRouter>
  );
}