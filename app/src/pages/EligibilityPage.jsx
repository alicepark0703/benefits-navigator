import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EligibilityForm from "../components/EligibilityForm";

export default function EligibilityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const initialData =
    location.state?.initialData ||
    JSON.parse(localStorage.getItem("eligibilityData") || "null");

  async function handleSubmit(data) {
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "What benefits am I eligible for?",
          user_profile: data,
          user_id: user?.id ?? null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Failed to check eligibility.");
      }

      localStorage.setItem("eligibilityData", JSON.stringify(data));
      localStorage.setItem("eligibilityResults", JSON.stringify(result));

      navigate("/results", {
        state: {
          data: result,
        },
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      alert(error.message || "Something went wrong while checking eligibility.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          background: "#f4f4f6",
          color: "#11151c",
        }}
      >
        Checking eligibility...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f6",
        padding: "40px 24px",
      }}
    >
      <EligibilityForm onSubmit={handleSubmit} initialData={initialData} />
    </div>
  );
}