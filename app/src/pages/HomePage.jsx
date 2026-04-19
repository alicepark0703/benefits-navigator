import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const scrollToForm = () => {
    document.getElementById("eligibility-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.heroSection}>
        <div style={styles.heroText}>
          <p style={styles.kicker}>WELCOME TO</p>
          <h1 style={styles.title}>Benefits Navigator</h1>
          <p style={styles.tagline}>
            Find the benefits you qualify for, simply and clearly.
          </p>
          <p style={styles.description}>
            Benefits Navigator helps individuals and families quickly explore
            eligibility for essential assistance programs in New York,
            including SNAP, Medicaid, and HEAP.
          </p>

          <div style={styles.buttonRow}>
            <button style={styles.primaryButton} onClick={scrollToForm}>
              Check Eligibility
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/home/locations")}
            >
              Find Closest Office
            </button>
          </div>
        </div>

        <div style={styles.heroImageBox}>
          <img src="/images/hero.jpg" alt="Family" style={styles.heroImage} />
        </div>
      </section>

      {/* LOGIN / SIGNUP BOX */}
      <section style={styles.authSection}>
        <div style={styles.authBox}>
          <h2 style={styles.authTitle}>Get Started</h2>
          <p style={styles.authText}>
            Sign in or create an account to save your progress and access personalized results.
          </p>

          <div style={styles.buttonRowCentered}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/home")}
            >
              Login
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/home")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.cardGridThree}>
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>1. Fill Out the Eligibility Form</h3>
            <p style={styles.cardText}>
              Answer a few simple questions about your household and income.
            </p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>2. Get Personalized Results</h3>
            <p style={styles.cardText}>
              Instantly see which programs you may qualify for.
            </p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>3. Explore with AI Guidance</h3>
            <p style={styles.cardText}>
              Ask questions and get help understanding next steps.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section style={styles.sectionAlt}>
        <h2 style={styles.sectionTitle}>Programs Included</h2>

        <div style={styles.cardGridThree}>
          <div style={styles.programCard}>
            <img src="/images/snap.jpg" alt="SNAP" style={styles.programImage} />
            <h3 style={styles.cardTitle}>SNAP</h3>
            <p style={styles.cardText}>Food assistance support.</p>
          </div>

          <div style={styles.programCard}>
            <img
              src="/images/medicaid.jpg"
              alt="Medicaid"
              style={styles.programImage}
            />
            <h3 style={styles.cardTitle}>Medicaid</h3>
            <p style={styles.cardText}>Health coverage support.</p>
          </div>

          <div style={styles.programCard}>
            <img src="/images/heap.jpg" alt="HEAP" style={styles.programImage} />
            <h3 style={styles.cardTitle}>HEAP</h3>
            <p style={styles.cardText}>Energy assistance support.</p>
          </div>
        </div>
      </section>

      {/* NEW FEATURE */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Find Help Near You</h2>
        <p style={styles.sectionDescription}>
          Locate the nearest SNAP, Medicaid, or HEAP office in your area.
        </p>
        <div style={styles.centeredButton}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/home/locations")}
          >
            Find Nearby Offices
          </button>
        </div>
      </section>

      {/* AI */}
      <section style={styles.sectionAlt}>
        <h2 style={styles.sectionTitle}>Need Help?</h2>
        <div style={styles.centeredButton}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/home/agent")}
          >
            Ask the Assistant
          </button>
        </div>
      </section>

      {/* CTA / FORM */}
      <section id="eligibility-form" style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>
          Find out what you may qualify for today.
        </h2>

        <div style={styles.buttonRowCentered}>
          <button style={styles.primaryButton} onClick={() => navigate("/home/eligibility")}>
            Start Eligibility Check
          </button>
        </div>
      </section>

      {/* FOOTER CREDIT */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p style={styles.placeholderCaption}>
          Images sourced from Unsplash.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f9fc",
    color: "#11151c",
    minHeight: "100vh",
  },

  heroSection: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "72px 48px",
    gap: "32px",
    background: "linear-gradient(180deg, #eef4fb 0%, #f7f9fc 100%)",
  },

  heroText: {
    flex: "1 1 500px",
    maxWidth: "620px",
  },

  kicker: {
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#364156",
    marginBottom: "12px",
  },

  title: {
    fontSize: "52px",
    fontWeight: "700",
    margin: "0 0 16px 0",
    color: "#11151c",
  },

  tagline: {
    fontSize: "22px",
    fontWeight: "500",
    marginBottom: "16px",
    color: "#364156",
  },

  description: {
    fontSize: "17px",
    lineHeight: "1.7",
    color: "#4b5563",
    marginBottom: "24px",
  },

  buttonRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  buttonRowCentered: {
    display: "flex",
    gap: "14px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "24px",
  },

  primaryButton: {
    padding: "14px 24px",
    backgroundColor: "#5b5271",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(33, 45, 64, 0.18)",
  },

  secondaryButton: {
    padding: "14px 24px",
    backgroundColor: "transparent",
    color: "#364156",
    border: "1px solid #5b5271",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  heroImageBox: {
    flex: "1 1 360px",
    maxWidth: "480px",
  },

  placeholderImageLarge: {
    height: "280px",
    backgroundColor: "#ffffff",
    border: "2px dashed #364156",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(17, 21, 28, 0.06)",
  },

  placeholderCaption: {
    fontSize: "9px",
    color: "#364156",
    marginTop: "12px",
  },

  section: {
    padding: "64px 48px",
    backgroundColor: "#f7f9fc",
  },

  sectionAlt: {
    padding: "64px 48px",
    backgroundColor: "#eef4fb",
  },

  sectionTitle: {
    fontSize: "34px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "16px",
    color: "#11151c",
  },

  sectionDescription: {
    fontSize: "17px",
    color: "#364156",
    textAlign: "center",
    maxWidth: "760px",
    margin: "0 auto 36px auto",
    lineHeight: "1.7",
  },

  cardGridThree: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginTop: "32px",
  },

  infoCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #d9e2ec",
    borderTop: "4px solid #5b5271",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 8px 20px rgba(17, 21, 28, 0.05)",
  },

  programCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #d9e2ec",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(17, 21, 28, 0.05)",
  },

  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#212d40",
  },

  cardText: {
    fontSize: "16px",
    color: "#4b5563",
    lineHeight: "1.6",
  },

  placeholderImageSmall: {
    height: "140px",
    backgroundColor: "#eef4fb",
    border: "2px dashed #364156",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px",
    color: "#6b7280",
    fontWeight: "600",
  },

  centeredButton: {
    display: "flex",
    justifyContent: "center",
    marginTop: "24px",
  },

  descriptionCentered: {
    fontSize: "17px",
    color: "#364156",
    textAlign: "center",
    maxWidth: "820px",
    margin: "0 auto 18px auto",
    lineHeight: "1.8",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginTop: "32px",
  },

  featureCard: {
    backgroundColor: "#d9e2ec",
    color: "#364156",
    borderRadius: "14px",
    padding: "20px",
    textAlign: "center",
    fontWeight: "600",
    boxShadow: "0 8px 20px rgba(33, 45, 64, 0.14)",
  },

  ctaSection: {
    padding: "72px 48px",
    textAlign: "center",
    background:  "#d9e2ec",
    color: "#11151c",
  },

  ctaTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
  },

  heroImage: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    borderRadius: "16px",
    boxShadow: "0 10px 24px rgba(17, 21, 28, 0.06)",
  },

  programImage: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "18px",
  },

  authSection: {
  padding: "40px 48px",
  display: "flex",
  justifyContent: "center",
  backgroundColor: "#f7f9fc",
  },

  authBox: {
    width: "100%",
    maxWidth: "700px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "36px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(17, 21, 28, 0.08)",
    border: "1px solid #e5e7eb",
  },

  authTitle: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#11151c",
  },

  authText: {
    fontSize: "16px",
    color: "#4b5563",
    marginBottom: "24px",
  },
};