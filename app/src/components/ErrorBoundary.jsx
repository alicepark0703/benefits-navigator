import { Component } from "react";

/**
 * Catches render errors (e.g. Leaflet + React dev double-mount) so the app
 * does not go to a blank white screen with no hint.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: 24,
            fontFamily: "Inter, sans-serif",
            background: "#fff5f5",
            color: "#8a1f1f",
          }}
        >
          <h1 style={{ fontSize: 20, marginTop: 0 }}>Something went wrong</h1>
          <p style={{ maxWidth: 560, lineHeight: 1.5 }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          <p style={{ color: "#364156", fontSize: 14 }}>
            If this happened on the map page, try a hard refresh. The team can
            also check the browser console (F12) for details.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 16,
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#7d4e57",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
