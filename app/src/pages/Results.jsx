import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // adjust path as needed

export default function ResultsHub() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      icon: "",
      label: "Eligibility Form",
      active: false,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/eligibility");
      },
    },
    {
      icon: "",
      label: "Results",
      active: true,
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
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #d9dde3",
            boxShadow: "0 8px 24px rgba(17, 21, 28, 0.05)",
            padding: "2.5rem",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              color: "#212d40",
            }}
          >
            You're all set!
          </h2>

          <p style={{ color: "#364156", fontSize: 15, marginBottom: "2rem" }}>
            Choose what you'd like to see next.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              onClick={() => navigate("/eligibility-results")}
              style={cardStyle}
            >
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: "#212d40",
                }}
              >
                View my results
              </h3>
              <p style={{ fontSize: 14, color: "#364156", margin: 0 }}>
                See which programs and benefits you may qualify for.
              </p>
            </div>

            <div onClick={() => navigate("/chatbot")} style={cardStyle}>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: "#212d40",
                }}
              >
                Ask a question
              </h3>
              <p style={{ fontSize: 14, color: "#364156", margin: 0 }}>
                Chat with our AI to learn more about your options.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "Inter, sans-serif",
    position: "relative",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
};

const cardStyle = {
  padding: "1.5rem",
  border: "1px solid #364156",
  borderRadius: 14,
  cursor: "pointer",
  transition: "all 0.15s",
  background: "#fff",
};