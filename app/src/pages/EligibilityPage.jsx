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
        navigate("/eligibility-results");
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
    {
      icon: "",
      label: "Nearby Offices",
      active: false,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/locations");
      },
    },
  ];

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes loadingWave {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.35;
            }
            30% {
              transform: translateY(-8px);
              opacity: 1;
            }
          }
        `}
      </style>

      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingModal}>
            <div style={styles.loadingTitle}>Checking eligibility</div>
            <div style={styles.loadingDots}>
              <span style={{ ...styles.loadingDot, animationDelay: "0s" }}>•</span>
              <span style={{ ...styles.loadingDot, animationDelay: "0.15s" }}>•</span>
              <span style={{ ...styles.loadingDot, animationDelay: "0.3s" }}>•</span>
            </div>
          </div>
        </div>
      )}

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

  loadingOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17, 21, 28, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    backdropFilter: "blur(3px)",
  },

  loadingModal: {
    background: "#fff",
    color: "#212d40",
    borderRadius: 20,
    padding: "28px 36px",
    minWidth: 280,
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(17, 21, 28, 0.28)",
    border: "1px solid rgba(125, 78, 87, 0.45)",
  },

  loadingTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 10,
  },

  loadingDots: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    minHeight: 24,
  },

  loadingDot: {
    fontSize: 28,
    color: "#7d4e57",
    display: "inline-block",
    animation: "loadingWave 1s infinite ease-in-out",
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