import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/signup";

      const payload =
        mode === "signup"
          ? {
              full_name: formData.fullName,
              email: formData.email,
              password: formData.password,
            }
          : {
              email: formData.email,
              password: formData.password,
            };

      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Authentication failed.");
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.eligibilityData) {
        localStorage.setItem("eligibilityData", JSON.stringify(data.eligibilityData));
      }

      if (data.selectedPrograms) {
        localStorage.setItem("selectedPrograms", JSON.stringify(data.selectedPrograms));
      }

      navigate("/eligibility", {
        state: {
          mode: data.hasEligibilityProfile ? "existing" : "new",
          initialData: data.eligibilityData || null,
          selectedPrograms: data.selectedPrograms || [],
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logoBox}>
            <div style={styles.logoInner}>⬢</div>
          </div>

          <div style={styles.brand}>Benefits Navigator</div>
          <div style={styles.subBrand}>PORTAL</div>

          <div style={{ marginTop: 48 }}>
            <div style={styles.activeNav}>
              <span style={styles.navIcon}>👤</span>
              <span>{mode === "login" ? "Sign in" : "Sign up"}</span>
            </div>

            <div style={styles.disabledNav}>
              <span style={styles.navIcon}>📊</span>
              <span>Results</span>
              <span style={styles.lockBadge}>locked</span>
            </div>

            <div style={styles.disabledNav}>
              <span style={styles.navIcon}>✨</span>
              <span>AI Agent</span>
              <span style={styles.lockBadge}>locked</span>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </p>

          <div style={styles.toggleWrap}>
            <button
              type="button"
              onClick={() => setMode("login")}
              style={{
                ...styles.toggleButton,
                ...(mode === "login" ? styles.toggleActive : styles.toggleInactive),
              }}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              style={{
                ...styles.toggleButton,
                ...(mode === "signup" ? styles.toggleActive : styles.toggleInactive),
              }}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>FULL NAME</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            )}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>PASSWORD</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {mode === "login" && (
              <div style={styles.forgotWrap}>
                <button type="button" style={styles.linkButton}>
                  Forgot password?
                </button>
              </div>
            )}

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Signing up..."
                : mode === "login"
                ? "Log in"
                : "Sign up"}
            </button>
          </form>

          <div style={styles.dividerRow}>
            <div style={styles.divider} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.divider} />
          </div>

          <button type="button" style={styles.googleButton}>
            Continue with Google
          </button>

          <div style={styles.bottomText}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              style={styles.inlineLink}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f4f4f5",
    color: "#11151c",
    fontFamily: "Inter, sans-serif",
  },
  sidebar: {
    width: 320,
    background: "#212d40",
    color: "#fff",
    padding: "36px 28px",
    display: "flex",
    flexDirection: "column",
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "#7d4e57",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    fontSize: 20,
  },
  logoInner: {
    color: "#fff",
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  subBrand: {
    fontSize: 14,
    color: "#a5b0c2",
    letterSpacing: "0.08em",
  },
  activeNav: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(125, 78, 87, 0.28)",
    color: "#f0cfd5",
    padding: "14px 16px",
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 18,
  },
  disabledNav: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#7f8ba0",
    padding: "14px 16px",
    borderRadius: 12,
    marginBottom: 6,
    fontSize: 18,
  },
  navIcon: {
    width: 24,
    textAlign: "center",
  },
  lockBadge: {
    marginLeft: "auto",
    fontSize: 12,
    background: "#364156",
    color: "#c7d0de",
    padding: "4px 8px",
    borderRadius: 8,
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  card: {
    width: "100%",
    maxWidth: 580,
    background: "#ffffff",
    borderRadius: 28,
    padding: "42px 48px",
    border: "1px solid #e4e7ec",
    boxShadow: "0 8px 30px rgba(17, 21, 28, 0.06)",
  },
  title: {
    margin: 0,
    fontSize: 46,
    fontWeight: 700,
    color: "#11151c",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 18,
    color: "#364156",
  },
  toggleWrap: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 0,
    padding: 4,
    borderRadius: 16,
    border: "1px solid #d6dae1",
    background: "#f7f8fa",
    marginBottom: 28,
  },
  toggleButton: {
    height: 52,
    border: "none",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
  },
  toggleActive: {
    background: "#ffffff",
    color: "#11151c",
    boxShadow: "0 1px 4px rgba(17, 21, 28, 0.08)",
  },
  toggleInactive: {
    background: "transparent",
    color: "#364156",
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#364156",
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    border: "1px solid #d0d5dd",
    padding: "0 16px",
    fontSize: 18,
    boxSizing: "border-box",
    outline: "none",
    color: "#11151c",
  },
  forgotWrap: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#364156",
    cursor: "pointer",
    fontSize: 16,
  },
  submitButton: {
    width: "100%",
    height: 58,
    borderRadius: 14,
    border: "none",
    background: "#7d4e57",
    color: "#fff",
    fontSize: 20,
    fontWeight: 600,
    cursor: "pointer",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    margin: "28px 0 22px 0",
  },
  divider: {
    flex: 1,
    height: 1,
    background: "#e3e6eb",
  },
  dividerText: {
    color: "#6b7280",
    fontSize: 15,
  },
  googleButton: {
    width: "100%",
    height: 58,
    borderRadius: 14,
    border: "1px solid #d0d5dd",
    background: "#fff",
    color: "#11151c",
    fontSize: 18,
    fontWeight: 500,
    cursor: "pointer",
  },
  bottomText: {
    marginTop: 22,
    textAlign: "center",
    color: "#364156",
    fontSize: 16,
  },
  inlineLink: {
    border: "none",
    background: "none",
    color: "#7d4e57",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
    fontSize: 16,
  },
  error: {
    marginBottom: 14,
    padding: "12px 14px",
    borderRadius: 10,
    background: "#fdf0f2",
    color: "#7d4e57",
    fontSize: 14,
  },
};