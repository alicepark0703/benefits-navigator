import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EligibilityPage from "./pages/EligibilityPage";
import Results from "./components/Results";

function AgentPage() {
  return <div style={{ padding: "40px" }}>AI Agent page coming soon.</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eligibility" element={<EligibilityPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/agent" element={<AgentPage />} />
      </Routes>
    </BrowserRouter>
  );
}