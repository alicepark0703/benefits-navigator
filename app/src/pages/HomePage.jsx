import { useNavigate } from "react-router-dom";
export default function HomePage() {
    const navigate = useNavigate();
  return (
    <div style={styles.page}>
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
            including SNAP, Medicaid, and HEAP. Our goal is to make benefits
            information easier to understand and easier to access.
          </p>

          <div style={styles.buttonRow}>
            <button style={styles.primaryButton}>Check Eligibility</button>
            <button style={styles.secondaryButton}>Learn More</button>
          </div>
        </div>

        <div style={styles.heroImageBox}>
          <div style={styles.placeholderImageLarge}>
            Hero Photo Placeholder
          </div>
          <p style={styles.placeholderCaption}>
            Suggested image: family using a laptop, community support scene, or
            clean dashboard mockup
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.cardGridThree}>
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>1. Fill Out the Eligibility Form</h3>
            <p style={styles.cardText}>
              Answer a few simple questions about your household, income, and
              current situation.
            </p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>2. Get Personalized Results</h3>
            <p style={styles.cardText}>
              Instantly see which programs you may qualify for based on the
              information you provide.
            </p>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>3. Explore with AI Guidance</h3>
            <p style={styles.cardText}>
              Ask questions and get help understanding benefits, requirements,
              and next steps.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <h2 style={styles.sectionTitle}>Programs Included</h2>
        <p style={styles.sectionDescription}>
          We focus on three major assistance programs in New York to make the
          process more clear, practical, and accessible.
        </p>

        <div style={styles.cardGridThree}>
          <div style={styles.programCard}>
            <div style={styles.placeholderImageSmall}>SNAP Image Placeholder</div>
            <h3 style={styles.cardTitle}>SNAP</h3>
            <p style={styles.cardText}>
              Food assistance support for individuals and families.
            </p>
          </div>

          <div style={styles.programCard}>
            <div style={styles.placeholderImageSmall}>
              Medicaid Image Placeholder
            </div>
            <h3 style={styles.cardTitle}>Medicaid</h3>
            <p style={styles.cardText}>
              Health coverage support for eligible residents.
            </p>
          </div>

          <div style={styles.programCard}>
            <div style={styles.placeholderImageSmall}>HEAP Image Placeholder</div>
            <h3 style={styles.cardTitle}>HEAP</h3>
            <p style={styles.cardText}>
              Energy assistance for heating and home utility needs.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Need Help? Ask Our AI Assistant</h2>
        <p style={styles.sectionDescription}>
          Not sure what a requirement means? Confused about eligibility rules?
          Our AI assistant helps explain benefits in a simple and approachable
          way.
        </p>
        <div style={styles.centeredButton}>
            <button
                style={styles.primaryButton}
                onClick={() => navigate("/agent")}
            >
                Ask the Assistant
            </button>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <h2 style={styles.sectionTitle}>Why We Built This</h2>
        <p style={styles.descriptionCentered}>
          Accessing government benefits should not feel confusing or
          overwhelming. Many eligible individuals miss out on support because
          systems are difficult to navigate and information is not always easy
          to understand.
        </p>
        <p style={styles.descriptionCentered}>
          Benefits Navigator simplifies the process by helping users check
          eligibility, understand their options, and get guidance in one place.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Platform Features</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>Simple eligibility form</div>
          <div style={styles.featureCard}>Instant results dashboard</div>
          <div style={styles.featureCard}>AI powered explanations</div>
          <div style={styles.featureCard}>Focused on New York programs</div>
          <div style={styles.featureCard}>Clean and user friendly design</div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Find out what you may qualify for today.</h2>
        <div style={styles.buttonRowCentered}>
          <button style={styles.primaryButton}>Start Eligibility Check</button>
          <button style={styles.secondaryButton}>Explore Features</button>
        </div>
      </section>
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
    fontSize: "14px",
    color: "#6b7280",
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
    color: "#ffffff",
  },

  ctaTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
  },
};