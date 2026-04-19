import { createRoot } from "react-dom/client";
import App from "./App";

// StrictMode is omitted: in development it double-mounts children, which breaks
// Leaflet/react-leaflet (map init / teardown). Symptoms match "flash then white screen",
// often worse on Windows where timing differs. Use ErrorBoundary in App instead.
createRoot(document.getElementById("root")).render(<App />);