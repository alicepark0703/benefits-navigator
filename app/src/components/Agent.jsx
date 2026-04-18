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

export default function Agent({ children }) {
    const location = useLocation();
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
    
    async function handleSubmit(query) {
        setLoading(true);
        setError("");

        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
      
            const response = await fetch("http://localhost:8000/api/query", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: query,
                user_profile: initialData,
                user_id: user?.id ?? null,
              }),
            });
      
            const result = await response.json();
      
            if (!response.ok) {
              throw new Error(result.detail || "Failed to find information.");
            }
      
            localStorage.setItem("agentResults", JSON.stringify(result));
            setAgentResult(result);
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