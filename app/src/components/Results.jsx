import { useNavigate } from "react-router-dom";

export default function ResultsHub() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
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

        <p
          style={{
            color: "#364156",
            fontSize: 15,
            marginBottom: "2rem",
          }}
        >
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
            <p
              style={{
                fontSize: 14,
                color: "#364156",
                margin: 0,
              }}
            >
              See which programs and benefits you may qualify for.
            </p>
          </div>

          <div
            onClick={() => navigate("/chatbot")}
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
              Ask a question
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#364156",
                margin: 0,
              }}
            >
              Chat with our AI to learn more about your options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "1.5rem",
  border: "1px solid #364156",
  borderRadius: 14,
  cursor: "pointer",
  transition: "all 0.15s",
  background: "#fff",
};