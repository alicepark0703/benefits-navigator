import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const OfficeMap = lazy(() => import("../components/OfficeMap.jsx"));

const NY_STATE_CENTER = [42.95, -75.52];
const FETCH_MS = 12_000;

function formatApiError(payload) {
  const d = payload?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d[0]?.msg) return d.map((x) => x.msg).join(" ");
  if (d && typeof d === "object" && d.msg) return d.msg;
  return "Unable to fetch nearby offices.";
}

export default function LocationsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storedProfile = JSON.parse(localStorage.getItem("eligibilityData") || "null");
  const storedZip = (storedProfile?.county || "").trim();
  const [zipInput, setZipInput] = useState(storedZip);
  const [activeZip, setActiveZip] = useState(storedZip);

  const zipCode = activeZip;

  function handleSearch(e) {
    e?.preventDefault?.();
    const z = zipInput.trim();
    setActiveZip(z);
  }

  useEffect(() => {
    if (!activeZip) {
      setLoading(false);
      setError("");
      setOffices([]);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    const timeoutId = setTimeout(() => controller.abort(), FETCH_MS);

    async function loadLocations() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:8000/api/locations?zip_code=${encodeURIComponent(activeZip)}`,
          { signal: controller.signal }
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(formatApiError(payload));
        }

        if (!cancelled) setOffices(payload);
      } catch (err) {
        if (cancelled) return;
        if (err.name === "AbortError") {
          setError("Request timed out. Is the API running on port 8000?");
        } else {
          setError(err.message || "Unable to load office locations right now.");
        }
        setOffices([]);
      } finally {
        if (!cancelled) setLoading(false);
        clearTimeout(timeoutId);
      }
    }

    loadLocations();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [activeZip]);

  const mapCenter = useMemo(() => {
    if (offices.length > 0) {
      return [offices[0].lat, offices[0].lng];
    }
    return NY_STATE_CENTER;
  }, [offices]);

  const navItems = [
    {
      icon: "",
      label: "Eligibility Form",
      active: false,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/home/eligibility");
      },
    },
    {
      icon: "",
      label: "Results",
      active: false,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/home/results");
      },
    },
    {
      icon: "",
      label: "AI Agent",
      active: false,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/home/agent");
      },
    },
    {
      icon: "",
      label: "Nearby Offices",
      active: true,
      onClick: () => {
        setSidebarOpen(false);
        navigate("/home/locations");
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

      <main style={{...styles.main, position: "relative", zIndex: 0 }}>
        <section style={styles.panel}>
          <h2 style={styles.heading}>Nearby NY Benefit Offices</h2>
          <p style={styles.description}>
            Enter a New York ZIP code. We use it to rank offices by distance (approximate for your area).
          </p>

          <form onSubmit={handleSearch} style={styles.zipForm}>
            <label htmlFor="locations-zip" style={styles.zipLabel}>
              ZIP code
            </label>
            <div style={styles.zipRow}>
              <input
                id="locations-zip"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="e.g. 14201"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                style={styles.zipInput}
              />
              <button type="submit" style={styles.zipButton}>
                Search
              </button>
            </div>
          </form>

          {activeZip ? (
            <p style={styles.zipHint}>
              Results for <strong>{activeZip}</strong>
              {storedZip && activeZip !== storedZip ? (
                <span style={{ color: "#6b7280" }}> (eligibility form had {storedZip})</span>
              ) : null}
            </p>
          ) : (
            <p style={styles.zipHintMuted}>
              {storedZip
                ? `Your saved ZIP is ${storedZip} — press Search to load, or edit above.`
                : "Add a ZIP from your eligibility form, or type one above, then Search."}
            </p>
          )}

          {loading ? <p style={styles.message}>Loading nearby offices...</p> : null}
          {!loading && error ? <p style={styles.error}>{error}</p> : null}

          {!loading && !error && offices.length > 0 ? (
            <>
              <div style={styles.list}>
                {offices.map((office) => (
                  <article key={`${office.id}-card`} style={styles.card}>
                    <h3 style={styles.cardTitle}>{office.name}</h3>
                    <p style={styles.cardText}>{office.address}</p>
                    <p style={styles.cardText}>{office.phone || "Phone not listed"}</p>
                    <p style={styles.cardText}>
                      Programs: {office.programs?.length ? office.programs.join(", ") : "Not listed"}
                    </p>
                    <p style={styles.cardDistance}>{office.distance_miles} miles away</p>
                  </article>
                ))}
              </div>

              <div style={{ position: "relative", zIndex: 0 }}>
                <Suspense fallback={<div style={styles.mapPlaceholder}>Loading map…</div>}>
                  <OfficeMap offices={offices} mapCenter={mapCenter} />
                </Suspense>
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f4f6",
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
    background: "#5b5271",
    color: "#fff",
    fontSize: 22,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(17, 21, 28, 0.18)",
  },
  main: {
    minHeight: "100vh",
    padding: "96px 24px 40px 24px",
  },
  panel: {
    width: "100%",
    maxWidth: 920,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 24,
    border: "1px solid #d9dde3",
    boxShadow: "0 8px 24px rgba(17, 21, 28, 0.05)",
    padding: "2rem",
  },
  heading: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 28,
    fontWeight: 700,
    color: "#212d40",
  },
  description: {
    color: "#364156",
    fontSize: 15,
    marginBottom: "1rem",
  },
  zipForm: {
    marginBottom: "1rem",
  },
  zipLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#364156",
    marginBottom: 6,
  },
  zipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  zipInput: {
    padding: "10px 12px",
    border: "1px solid #d9dde3",
    borderRadius: 8,
    fontSize: 15,
    width: "100%",
    maxWidth: 200,
    outline: "none",
  },
  zipButton: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "#5b5271",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  zipHint: {
    fontSize: 14,
    color: "#364156",
    marginBottom: "1rem",
  },
  zipHintMuted: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: "1rem",
  },
  message: {
    color: "#364156",
    fontSize: 15,
  },
  error: {
    color: "#8a1f1f",
    background: "#fff5f5",
    border: "1px solid #ffd6d6",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
  },
  mapPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    border: "1px dashed #d9dde3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: 14,
    marginTop: "1rem",
  },
  list: {
    display: "grid",
    gap: 12,
  },
  card: {
    border: "1px solid #d9dde3",
    borderRadius: 12,
    padding: "12px 14px",
    background: "#fff",
  },
  cardTitle: {
    margin: "0 0 6px",
    color: "#212d40",
    fontSize: 17,
    fontWeight: 600,
  },
  cardText: {
    margin: "0 0 4px",
    color: "#364156",
    fontSize: 14,
  },
  cardDistance: {
    margin: "6px 0 0",
    color: "#5b5271",
    fontSize: 14,
    fontWeight: 600,
  },
};
