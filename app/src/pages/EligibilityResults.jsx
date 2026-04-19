import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { COLORS } from "../components/Agent";
import ReactMarkdown from "react-markdown";

const PAGE_FONT = "Inter, sans-serif";

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const result =
    location.state?.data ||
    JSON.parse(localStorage.getItem("eligibilityResults") || "null");

  const programs = Array.isArray(result?.eligible_programs)
    ? result.eligible_programs
    : [];

  const sources = Array.isArray(result?.sources) ? result.sources : [];

  const navItems = [
    {
      icon: "",
      label: "Eligibility Form",
      active: false,
      onClick: () => { setSidebarOpen(false); navigate("/eligibility"); },
    },
    {
      icon: "",
      label: "Results",
      active: true,
      onClick: () => { setSidebarOpen(false); navigate("/eligibility-results"); },
    },
    {
      icon: "",
      label: "AI Agent",
      active: false,
      onClick: () => { setSidebarOpen(false); navigate("/agent"); },
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", background: COLORS.soft, fontFamily: PAGE_FONT }}>
      <button
        type="button"
        onClick={() => setSidebarOpen((prev) => !prev)}
        style={{ ...styles.logoButton, display: sidebarOpen ? "none" : "block" }}
        aria-label="Open sidebar"
      >
        ❤
      </button>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showOverlay={true}
        navItems={navItems}
      />

      <div style={{ flex: 1, padding: "40px 24px" }}>
        <div style={{
          maxWidth: 680, margin: "0 auto", padding: "2rem",
          background: COLORS.white, borderRadius: 24,
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 8px 24px rgba(17, 21, 28, 0.05)",
        }}>

          <h2 style={{ fontSize: 26, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>
            Your Eligibility Results
          </h2>
          <p style={{ fontSize: 14, color: COLORS.muted, marginBottom: "2rem" }}>
            Based on your profile, here are the programs you may qualify for.
          </p>

          {!result ? (
            <div style={{
              padding: "2rem", textAlign: "center", borderRadius: 12,
              background: COLORS.soft, color: COLORS.muted, fontSize: 15,
            }}>
              No results found. Please{" "}
              <span
                onClick={() => navigate("/eligibility")}
                style={{ color: COLORS.accent, cursor: "pointer", textDecoration: "underline" }}
              >
                complete the eligibility form
              </span>{" "}
              first.
            </div>
          ) : (
            <>
              {/* Summary answer */}
              {result.answer && (
                <div style={{
                    padding: "1.25rem 1.5rem", borderRadius: 14,
                    background: COLORS.soft, border: `1px solid ${COLORS.border}`,
                    fontSize: 15, color: COLORS.ink, lineHeight: 1.6,
                    marginBottom: "2rem",
                }}>
                    <ReactMarkdown
                    components={{
                        a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" style={{ color: COLORS.accent }} />,
                        p: ({ ...props }) => <p {...props} style={{ margin: "0 0 10px" }} />,
                        ul: ({ ...props }) => <ul {...props} style={{ margin: "0 0 10px", paddingLeft: 20 }} />,
                        ol: ({ ...props }) => <ol {...props} style={{ margin: "0 0 10px", paddingLeft: 20 }} />,
                        li: ({ ...props }) => <li {...props} style={{ marginBottom: 4 }} />,
                        strong: ({ ...props }) => <strong {...props} />,
                        h1: ({ ...props }) => <h1 {...props} style={{ fontSize: "1.35em", margin: "0 0 10px" }} />,
                        h2: ({ ...props }) => <h2 {...props} style={{ fontSize: "1.2em", margin: "0 0 10px" }} />,
                        h3: ({ ...props }) => <h3 {...props} style={{ fontSize: "1.1em", margin: "0 0 8px" }} />,
                        code: ({ ...props }) => <code {...props} style={{ fontSize: "0.95em" }} />,
                        pre: ({ ...props }) => (
                        <pre {...props} style={{
                            fontSize: 14, margin: "0 0 12px", padding: 12,
                            borderRadius: 8, background: "#e8e4e8", overflow: "auto",
                        }} />
                        ),
                    }}
                    >
                    {result.answer}
                    </ReactMarkdown>
                </div>
                )}
              
              {/* Sources */}
              {sources.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 12 }}>
                    Sources
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {sources.slice(0, 10).map((source, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: COLORS.muted, paddingLeft: 10,
                        borderLeft: `2px solid ${COLORS.border}`, lineHeight: 1.5,
                      }}>
                        {typeof source?.source === "string" ? source.source : JSON.stringify(source)}
                      </div>
                    ))}
                    {sources.length > 10 && (
                      <div style={{ fontSize: 13, color: COLORS.muted }}>
                        Showing 10 of {sources.length} sources.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div style={{
                paddingTop: "1.5rem", borderTop: `1px solid ${COLORS.border}`,
                display: "flex", gap: 12, flexWrap: "wrap",
              }}>
                <button
                  onClick={() => navigate("/agent")}
                  style={{
                    padding: "11px 24px", borderRadius: 8, border: "none",
                    background: COLORS.accent, color: COLORS.white,
                    fontSize: 15, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Ask a follow-up question
                </button>
                <button
                  onClick={() => navigate("/eligibility")}
                  style={{
                    padding: "11px 24px", borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    background: "transparent", color: COLORS.ink,
                    fontSize: 15, cursor: "pointer",
                  }}
                >
                  Update my information
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  logoButton: {
    position: "fixed", top: 24, left: 24, zIndex: 30,
    width: 56, height: 56, borderRadius: 16, border: "none",
    background: "#5b5271", color: "#fff", fontSize: 22,
    cursor: "pointer", boxShadow: "0 8px 20px rgba(17, 21, 28, 0.18)",
  },
};