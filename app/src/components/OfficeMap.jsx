import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const mapStyle = { width: "100%", height: "100%" };
const wrapperStyle = {
  width: "100%",
  height: 420,
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid #d9dde3",
  marginBottom: "1.25rem",
};

/**
 * Lazy-loaded so the locations page can paint the office list before Leaflet/tiles initialize.
 */
export default function OfficeMap({ offices, mapCenter }) {
  return (
    <div style={wrapperStyle}>
      <MapContainer center={mapCenter} zoom={9} style={mapStyle}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {offices.map((office) => (
          <Marker key={office.id} position={[office.lat, office.lng]}>
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
