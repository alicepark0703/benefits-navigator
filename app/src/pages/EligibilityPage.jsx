import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EligibilityForm from "../components/EligibilityForm";
import Sidebar from "../components/Sidebar";

export default function EligibilityPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    return <div style={styles.loadingPage}>Checking eligibility...</div>;
  }
  

  const navItems = [
    {
      icon: "",
      label: "Eligibility Form",
      active: true,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/eligibility");
      },
    },
    {
      icon: "",
      label: "Results",
      active: false,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/results");
      },
    },
    {
      icon: "",
      label: "AI Agent",
      active: false,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/agent");
      },
    },
  ];

  return (
    <div style={styles.page}>
      <button
        type="button"
        onClick={() => setSidebarOpen((prev) => !prev)}
        style={{
          ...styles.logoButton,
          display: sidebarOpen ? "none" : "block",
        }} 
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
         ❤ 
      </button>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showOverlay={true}
        navItems={navItems}
      />

      <main style={styles.main}>
        <EligibilityForm onSubmit={handleSubmit} initialData={initialData} />
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f4f6",
    fontFamily: "Inter, sans-serif",
    position: "relative",
  },
  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
    background: "#f4f4f6",
    color: "#11151c",
  },
  logoButton: {
    position: "fixed",
    top: 24,
    left: 24,
    zIndex: 30,
    width: 56,
    height: 56,
    borderRadius: 16,
    border: "none",
    background: "#7d4e57",
    color: "#fff",
    fontSize: 22,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(17, 21, 28, 0.18)",
  },
  main: {
    minHeight: "100vh",
    padding: "96px 24px 40px 24px",
  },
};