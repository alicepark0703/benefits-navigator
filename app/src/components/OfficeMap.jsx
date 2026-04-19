import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const ICON_PATCH_KEY = "__bnLeafletIconPatch";

const mapStyle = { width: "100%", height: "100%" };
const wrapperStyle = {
  width: "100%",
  height: 420,
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid #d9dde3",
  marginBottom: "1.25rem",
};

const NY_FALLBACK = [42.95, -75.52];

function patchDefaultIconsOnce() {
  if (typeof globalThis === "undefined" || globalThis[ICON_PATCH_KEY]) return;
  globalThis[ICON_PATCH_KEY] = true;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}

/**
 * Leaflet must mount only after the browser tab is ready; react-leaflet + React dev
 * double-mount is a common source of "map flashes then blank page".
 */
export default function OfficeMap({ offices, mapCenter }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    patchDefaultIconsOnce();
    setReady(true);
  }, []);

  const center = (() => {
    const a = Number(mapCenter?.[0]);
    const b = Number(mapCenter?.[1]);
    if (Number.isFinite(a) && Number.isFinite(b)) return [a, b];
    return NY_FALLBACK;
  })();

  const validOffices = offices.filter(
    (o) =>
      Number.isFinite(Number(o.lat)) && Number.isFinite(Number(o.lng))
  );

  if (!ready) {
    return <div style={{ ...wrapperStyle, background: "#f4f4f6" }} aria-hidden />;
  }

  return (
    <div style={wrapperStyle}>
      <MapContainer
        key={`${center[0].toFixed(4)}-${center[1].toFixed(4)}`}
        center={center}
        zoom={9}
        style={mapStyle}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validOffices.map((office) => (
          <Marker
            key={office.id}
            position={[Number(office.lat), Number(office.lng)]}
          >
            <Popup>
              <strong>{office.name}</strong>
              <br />
              {office.address}
              <br />
              {office.phone || "Phone not listed"}
              <br />
              {office.distance_miles} miles away
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
