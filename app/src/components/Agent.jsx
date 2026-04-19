import { useState } from "react";
import { useLocation } from "react-router-dom";

export const COLORS = {
  ink: "#11151c",
  panel: "#212d40",
  muted: "#364156",
  accent: "#7d4e57",
  border: "#d6d9df",
  soft: "#f4f4f6",
  white: "#ffffff",
};

export default function Agent({ children, onResult }) {
  const location = useLocation();

// Coerce numeric fields saved as strings by the eligibility form
function sanitizeProfile(data) {
  if (!data) return {};
  const INT_FIELDS  = ["householdSize", "numAdults", "numChildren"];
  const FLOAT_FIELDS = ["annualIncome", "assets", "hoursPerWeek", "monthlyRent", "monthlyUtilities"];
  const out = { ...data };
  for (const f of INT_FIELDS) {
    if (out[f] === "" || out[f] === undefined) { out[f] = null; continue; }
    const n = parseInt(out[f], 10);
    out[f] = isNaN(n) ? null : n;
  }
  for (const f of FLOAT_FIELDS) {
    if (out[f] === "" || out[f] === undefined) { out[f] = null; continue; }
    const n = parseFloat(out[f]);
    out[f] = isNaN(n) ? null : n;
  }
  return out;
}
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [agentResult, setAgentResult] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("agentResults") || "null");
    } catch {
      return null;
    }
  });

  const initialData =
    location.state?.initialData ||
    JSON.parse(localStorage.getItem("eligibilityData") || "null");

  async function handleSubmit(submittedQuery) {
    const trimmed =
      typeof submittedQuery === "string" ? submittedQuery.trim() : "";
    if (!trimmed) {
      setError("Please enter a question.");
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          user_profile: sanitizeProfile(initialData),
          user_id: user?.id ?? null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        let detail = result.detail;
        if (Array.isArray(detail)) {
          // FastAPI validation errors: [{loc, msg, type}, ...]
          detail = detail.map((e) => e.msg || JSON.stringify(e)).join("; ");
        }
        throw new Error(detail || "Failed to find information.");
      }

      localStorage.setItem("agentResults", JSON.stringify(result));
      setAgentResult(result);

      if (onResult) {
        onResult(result, Array.isArray(result?.sources) ? result.sources : []);
      }

      return result;
    } catch (error) {
      console.error("Error fetching results:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while finding information.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  const sources = Array.isArray(agentResult?.sources) ? agentResult.sources : [];

  return children({
    initialData,
    loading,
    query,
    setQuery,
    error,
    agentResult,
    sources,
    handleSubmit,
  });
}