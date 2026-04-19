import { Link } from "react-router-dom";
export default function Sidebar({
  mode = "login",
  isOpen = true,
  onClose,
  showOverlay = false,
  navItems = [],
  title = "Benefits Navigator",
  subtitle = "PORTAL",
}) {
  return (
    <>
      {showOverlay && isOpen && (
        <div style={styles.overlay} onClick={onClose} />
      )}

      <aside
        style={{
          ...styles.sidebar,
          ...(showOverlay
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                zIndex: 20,
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.25s ease",
                boxShadow: "8px 0 24px rgba(17, 21, 28, 0.16)",
              }
            : {
                minHeight: "100vh",
              }),
        }}
      >
        <div>
          <Link to="*" style={styles.logoBox}>
            <div style={styles.logoInner}>❤</div>
          </Link>

          <div style={styles.brand}>{title}</div>
          <div style={styles.subBrand}>{subtitle}</div>

          <div style={{ marginTop: 48 }}>
            {navItems.length > 0 ? (
              navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  style={item.active ? styles.activeNav : styles.disabledNav}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.locked && <span style={styles.lockBadge}>locked</span>}
                </button>
              ))
            ) : (
              <>
                <div style={styles.activeNav}>
                  <span style={styles.navIcon}></span>
                  <span>{mode === "login" ? "Sign in" : "Sign up"}</span>
                </div>

                <div style={styles.disabledNav}>
                  <span style={styles.navIcon}></span>
                  <span>Results</span>
                  <span style={styles.lockBadge}>locked</span>
                </div>

                <div style={styles.disabledNav}>
                  <span style={styles.navIcon}></span>
                  <span>AI Agent</span>
                  <span style={styles.lockBadge}>locked</span>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

const baseNavButton = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 12,
  border: "none",
  textAlign: "left",
  cursor: "pointer",
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17, 21, 28, 0.22)",
    zIndex: 15,
  },
  sidebar: {
    width: 320,
    minWidth: 320,
    background: "#212d40",
    color: "#fff",
    padding: "36px 28px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "#5b5271",
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
    ...baseNavButton,
    background: "rgba(106, 78, 125, 0.28)",
    color: "#9e95a1",
    padding: "14px 16px",
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 18,
  },
  disabledNav: {
    ...baseNavButton,
    background: "transparent",
    color: "#7f8ba0",
    padding: "14px 16px",
    borderRadius: 12,
    marginBottom: 6,
    fontSize: 18,
  },
  navIcon: {
    width: 24,
    textAlign: "center",
    flexShrink: 0,
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
    background: "#5b5271",
    color: "#fff",
    fontSize: 22,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(17, 21, 28, 0.18)",
  },
  lockBadge: {
    marginLeft: "auto",
    fontSize: 12,
    background: "#364156",
    color: "#c7d0de",
    padding: "4px 8px",
    borderRadius: 8,
  },
};