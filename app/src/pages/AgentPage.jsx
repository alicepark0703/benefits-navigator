import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Agent, { COLORS } from "../components/Agent";
import Sidebar from "../components/Sidebar";
import ReactMarkdown from "react-markdown";

const PAGE_FONT = "Inter, sans-serif";

export default function AgentPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
      active: false,
      onClick: () => { setSidebarOpen(false); navigate("/eligibility-results"); },
    },
    {
      icon: "",
      label: "AI Agent",
      active: true,
      onClick: () => { setSidebarOpen(false); navigate("/agent"); },
    },
  ];

  const handleAgentResult = (result, resultSources) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "agent",
        content: result.answer || "No answer returned.",
        sources: resultSources,
        programs: result.eligible_programs || [],
      },
    ]);
  };

  return (
    <Agent onResult={handleAgentResult}>
      {({
        initialData,
        loading,
        query,
        setQuery,
        error,
        handleSubmit: agentHandleSubmit,
      }) => {

        // Keep AgentPage's isLoading in sync so useEffect can see it
        if (isLoading !== loading) setIsLoading(loading);

        const handleSubmit = (q) => {
          if (!q.trim()) return;
          setMessages((prev) => [...prev, { role: "user", content: q }]);
          setQuery("");
          agentHandleSubmit(q);
        };

        if (initialData === null) {
          return (
            <div style={{
              minHeight: "100vh", display: "flex", alignItems: "center",
              justifyContent: "center", fontFamily: PAGE_FONT,
              background: COLORS.soft, color: COLORS.ink,
            }}>
              No eligibility data found. Please complete the eligibility form first.
            </div>
          );
        }

        return (
          <div style={styles.page}>
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              style={{ ...styles.logoButton, display: sidebarOpen ? "none" : "block" }}
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

            <div style={{
              flex: 1, minHeight: "100vh", background: COLORS.soft,
              padding: "40px 24px", fontFamily: PAGE_FONT,
            }}>
              <div style={{
                maxWidth: 680, margin: "0 auto", padding: "2rem",
                background: COLORS.white, borderRadius: 24,
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 8px 24px rgba(17, 21, 28, 0.05)",
                fontFamily: PAGE_FONT, display: "flex",
                flexDirection: "column", height: "75vh",
              }}>

                {/* Messages area */}
                <div style={{
                  flex: 1, overflowY: "auto", display: "flex",
                  flexDirection: "column", gap: 12, paddingBottom: 12,
                }}>
                  {messages.length === 0 && !loading && (
                    <div style={{ color: COLORS.muted, fontSize: 15, marginTop: 8 }}>
                      Ask me anything about your benefits.
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <div style={{
                        background: msg.role === "user" ? "#7d4e57" : "#f0edf0",
                        color: msg.role === "user" ? "#fff" : COLORS.ink,
                        borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        padding: "12px 16px",
                        maxWidth: "80%",
                        fontSize: 15,
                        fontFamily: PAGE_FONT,
                        lineHeight: 1.55,
                      }}>
                        {msg.role === "user" ? (
                          msg.content
                        ) : (
                          <>
                            <ReactMarkdown
                              components={{
                                a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" style={{ color: COLORS.accent }} />,
                                p: ({ ...props }) => <p {...props} style={{ margin: "0 0 10px" }} />,
                                ul: ({ ...props }) => <ul {...props} style={{ margin: "0 0 10px", paddingLeft: 20 }} />,
                                ol: ({ ...props }) => <ol {...props} style={{ margin: "0 0 10px", paddingLeft: 20 }} />,
                                li: ({ ...props }) => <li {...props} />,
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
                              {msg.content}
                            </ReactMarkdown>

                            {msg.programs?.length ? (
                              <div style={{ marginTop: 12 }}>
                                <strong>Mentioned Content</strong>
                                <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                                  {msg.programs.map((p) => <li key={p}>{p}</li>)}
                                </ul>
                              </div>
                            ) : null}

                            {msg.sources?.length ? (
                              <div style={{ marginTop: 12, fontSize: 13, color: COLORS.muted }}>
                                <strong>Sources</strong>
                                <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                                  {msg.sources.slice(0, 10).map((source, idx) => (
                                    <li key={idx} style={{ marginBottom: 4 }}>
                                      {typeof source?.source === "string" ? source.source : JSON.stringify(source)}
                                    </li>
                                  ))}
                                </ul>
                                {msg.sources.length > 10 && (
                                  <div style={{ marginTop: 4 }}>Showing 10 of {msg.sources.length} sources.</div>
                                )}
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div style={{
                        background: "#f0edf0", borderRadius: "18px 18px 18px 4px",
                        padding: "12px 18px", fontSize: 22, letterSpacing: 2,
                      }}>
                        <span style={styles.dot1}>•</span>
                        <span style={styles.dot2}>•</span>
                        <span style={styles.dot3}>•</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div style={{
                      alignSelf: "flex-start", background: "#fff5f5",
                      border: "1px solid #ffd6d6", color: "#8a1f1f",
                      borderRadius: "18px 18px 18px 4px", padding: "12px 16px",
                      maxWidth: "80%", fontSize: 15,
                    }}>
                      {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input row */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSubmit(query); }}
                  style={{
                    display: "flex", alignItems: "flex-end", gap: 10,
                    borderTop: `1px solid ${COLORS.border}`, paddingTop: 12,
                  }}
                >
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(query);
                      }
                    }}
                    style={{
                      flex: 1, padding: "12px",
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 12, fontSize: 15,
                      fontFamily: PAGE_FONT, resize: "none", outline: "none",
                    }}
                    placeholder="Ask about your benefits..."
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: 48, height: 48, borderRadius: 14, border: "none",
                      background: loading ? "#b89099" : "#7d4e57",
                      color: "#fff", fontSize: 20,
                      cursor: loading ? "not-allowed" : "pointer",
                      flexShrink: 0, boxShadow: "0 4px 12px rgba(125, 78, 87, 0.35)",
                    }}
                  >
                    ❤
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      }}
    </Agent>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", position: "relative",
    background: "#f4f4f6", fontFamily: "Inter, sans-serif",
  },
  logoButton: {
    position: "fixed", top: 24, left: 24, zIndex: 30,
    width: 56, height: 56, borderRadius: 16, border: "none",
    background: "#7d4e57", color: "#fff", fontSize: 22,
    cursor: "pointer", boxShadow: "0 8px 20px rgba(17, 21, 28, 0.18)",
  },
  dot1: { animation: "bounce 1.2s infinite", display: "inline-block" },
  dot2: { animation: "bounce 1.2s infinite 0.2s", display: "inline-block" },
  dot3: { animation: "bounce 1.2s infinite 0.4s", display: "inline-block" },
};