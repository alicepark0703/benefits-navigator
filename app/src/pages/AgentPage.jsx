import Agent, { COLORS } from "../components/Agent";
import ReactMarkdown from "react-markdown";

/** Matches Home, Eligibility, Results */
const PAGE_FONT = "Inter, sans-serif";

export default function AgentPage() {
  return (
    <Agent>
      {({
        initialData,
        loading,
        query,
        setQuery,
        error,
        agentResult,
        sources,
        handleSubmit,
      }) => {
        if (initialData === null) {
          return (
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: PAGE_FONT,
                background: COLORS.soft,
                color: COLORS.ink,
              }}
            >
              No eligibility data found. Please complete the eligibility form
              first.
            </div>
          );
        }

        if (loading) {
          return (
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: PAGE_FONT,
                background: COLORS.soft,
                color: COLORS.ink,
              }}
            >
              Searching for information...
            </div>
          );
        }

        return (
          <div
            style={{
              minHeight: "100vh",
              background: COLORS.soft,
              padding: "40px 24px",
              fontFamily: PAGE_FONT,
            }}
          >
            <div
              style={{
                maxWidth: 680,
                margin: "0 auto",
                padding: "2rem",
                background: COLORS.white,
                borderRadius: 24,
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 8px 24px rgba(17, 21, 28, 0.05)",
                fontFamily: PAGE_FONT,
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 4,
                  color: COLORS.ink,
                  fontFamily: PAGE_FONT,
                }}
              >
                Ask us about your benefits and we'll find information for you.
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(query);
                }}
              >
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    fontSize: 15,
                    fontFamily: PAGE_FONT,
                    marginTop: 16,
                    marginBottom: 16,
                  }}
                  placeholder="What do you want to know?"
                  rows={5}
                />
                <button
                  type="submit"
                  style={{
                    background: COLORS.accent,
                    color: COLORS.white,
                    padding: "12px 24px",
                    borderRadius: 8,
                    fontSize: 15,
                    fontFamily: PAGE_FONT,
                    cursor: "pointer",
                  }}
                >
                  Ask
                </button>
              </form>

              {error ? (
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    borderRadius: 12,
                    background: "#fff5f5",
                    border: "1px solid #ffd6d6",
                    color: "#8a1f1f",
                    fontFamily: PAGE_FONT,
                  }}
                >
                  {error}
                </div>
              ) : null}

              {agentResult ? (
                <div style={{ marginTop: 24 }}>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      margin: "0 0 8px",
                      color: COLORS.ink,
                      fontFamily: PAGE_FONT,
                    }}
                  >
                    Answer
                  </h3>
                  <div
                    style={{
                      lineHeight: 1.55,
                      color: COLORS.muted,
                      fontFamily: PAGE_FONT,
                    }}
                  >
                    <ReactMarkdown
                      components={{
                        a: ({ ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: COLORS.accent, fontFamily: PAGE_FONT }}
                          />
                        ),
                        p: ({ ...props }) => (
                          <p
                            {...props}
                            style={{ margin: "0 0 12px", fontFamily: PAGE_FONT }}
                          />
                        ),
                        ul: ({ ...props }) => (
                          <ul
                            {...props}
                            style={{
                              margin: "0 0 12px",
                              paddingLeft: 20,
                              fontFamily: PAGE_FONT,
                            }}
                          />
                        ),
                        ol: ({ ...props }) => (
                          <ol
                            {...props}
                            style={{
                              margin: "0 0 12px",
                              paddingLeft: 20,
                              fontFamily: PAGE_FONT,
                            }}
                          />
                        ),
                        li: ({ ...props }) => (
                          <li {...props} style={{ fontFamily: PAGE_FONT }} />
                        ),
                        strong: ({ ...props }) => (
                          <strong {...props} style={{ fontFamily: PAGE_FONT }} />
                        ),
                        h1: ({ ...props }) => (
                          <h1
                            {...props}
                            style={{
                              fontFamily: PAGE_FONT,
                              fontSize: "1.35em",
                              margin: "0 0 10px",
                            }}
                          />
                        ),
                        h2: ({ ...props }) => (
                          <h2
                            {...props}
                            style={{
                              fontFamily: PAGE_FONT,
                              fontSize: "1.2em",
                              margin: "0 0 10px",
                            }}
                          />
                        ),
                        h3: ({ ...props }) => (
                          <h3
                            {...props}
                            style={{
                              fontFamily: PAGE_FONT,
                              fontSize: "1.1em",
                              margin: "0 0 8px",
                            }}
                          />
                        ),
                        code: ({ ...props }) => (
                          <code
                            {...props}
                            style={{
                              fontFamily: PAGE_FONT,
                              fontSize: "0.95em",
                            }}
                          />
                        ),
                        pre: ({ ...props }) => (
                          <pre
                            {...props}
                            style={{
                              fontFamily: PAGE_FONT,
                              fontSize: 14,
                              margin: "0 0 12px",
                              padding: 12,
                              borderRadius: 8,
                              background: COLORS.soft,
                              overflow: "auto",
                            }}
                          />
                        ),
                      }}
                    >
                      {agentResult.answer || "No answer returned."}
                    </ReactMarkdown>
                  </div>

                  {Array.isArray(agentResult.eligible_programs) &&
                  agentResult.eligible_programs.length ? (
                    <div style={{ marginTop: 18 }}>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          margin: "0 0 8px",
                          color: COLORS.ink,
                          fontFamily: PAGE_FONT,
                        }}
                      >
                        Mentioned programs
                      </h3>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: 18,
                          color: COLORS.muted,
                          fontFamily: PAGE_FONT,
                        }}
                      >
                        {agentResult.eligible_programs.map((program) => (
                          <li key={program}>{program}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {sources.length ? (
                    <div style={{ marginTop: 18 }}>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          margin: "0 0 8px",
                          color: COLORS.ink,
                          fontFamily: PAGE_FONT,
                        }}
                      >
                        Sources
                      </h3>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: 18,
                          color: COLORS.muted,
                          fontFamily: PAGE_FONT,
                        }}
                      >
                        {sources.slice(0, 10).map((source, index) => (
                          <li key={index} style={{ marginBottom: 6 }}>
                            {typeof source?.source === "string"
                              ? source.source
                              : JSON.stringify(source)}
                          </li>
                        ))}
                      </ul>
                      {sources.length > 10 ? (
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 13,
                            color: COLORS.muted,
                            fontFamily: PAGE_FONT,
                          }}
                        >
                          Showing 10 of {sources.length} sources.
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        );
      }}
    </Agent>
  );
}
