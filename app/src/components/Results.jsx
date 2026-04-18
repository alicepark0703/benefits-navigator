export default function Results({ data, userProfile }) {
    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto", padding: "2rem 0" }}>
            <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8, color: "#212d40" }}>You're all set!</h2>
            <p style={{ color: "#888", fontSize: 14, marginBottom: "2rem" }}>
                Choose what you'd like to see next.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                    onClick={() => window.location.href = "/eligibility-results"}
                    style={{
                        padding: "1.5rem",
                        border: "1px solid #364156",
                        borderRadius: 12,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        background: "#fff",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#7d4e57";
                        e.currentTarget.style.background = "#f5eef0";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#364156";
                        e.currentTarget.style.background = "#fff";
                    }}
                >
                    <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: "#212d40" }}>View my results</h3>
                    <p style={{ fontSize: 14, color: "#364156", margin: 0 }}>See which programs and benefits you may qualify for.</p>
                </div>

                <div
                    onClick={() => window.location.href = "/chatbot"}
                    style={{
                        padding: "1.5rem",
                        border: "1px solid #364156",
                        borderRadius: 12,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        background: "#fff",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#7d4e57";
                        e.currentTarget.style.background = "#f5eef0";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#364156";
                        e.currentTarget.style.background = "#fff";
                    }}
                >
                    <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: "#212d40" }}>Ask a question</h3>
                    <p style={{ fontSize: 14, color: "#364156", margin: 0 }}>Chat with our AI to learn more about your options.</p>
                </div>
            </div>
        </div>
    );
}