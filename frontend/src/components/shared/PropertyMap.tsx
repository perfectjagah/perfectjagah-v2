import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import type { PropertySummary } from "@/types";

// Fix default marker icons broken by Vite's asset bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Coordinates for each seeded property (lat, lng)
const PROPERTY_COORDS: Record<string, [number, number]> = {
  // Villas
  "West County Villas": [17.555, 78.275], // Nandigama, near Muttangi ORR Exit 3
  "Mayfair Sunrise": [17.449, 78.293], // Kollur, Hyderabad
  "APR Praveen's Eterno": [17.394, 78.304], // Patighanpur, near Financial District
  "SSLR's Suprabhatha": [17.442, 78.286], // Kollur (slightly diff pin from Mayfair)
  "Makuta Green Woods": [17.566, 78.499], // Gundlapochampally, Kompally
  "Janapriya Olive County": [17.573, 78.49], // Sri Rangavaram, Kompally
  // Plots
  "SRINIVASAM by PROTEK Realty": [17.427, 78.155], // Vattimeenapally, Shankerpally–Vikarabad
  "Newmark Gardenia": [17.339, 78.504], // Thummaluru, Srisailam Highway
  "SVG Flora": [17.724, 79.157], // Jangaon, Warangal Highway
  "RajaBhoomi Aananda": [17.451, 78.133], // Near Shankarpally
  "Shree Samprada": [17.618, 77.968], // Atmakur, Sadashivpet, Mumbai Highway
  "ANTARVANA - Hillock The Nature Retreat": [17.278, 78.012], // Mominpet, Ananthagiri
  // Apartments
  "MVV Lake Breeze": [17.524, 78.356], // Bachupally, Hyderabad
};

// Fallback centre (Hyderabad)
const DEFAULT_CENTER: [number, number] = [17.45, 78.35];

// Colour-coded icons per type
const TYPE_COLORS: Record<string, string> = {
  Villa: "#f59e0b",
  Plot: "#10b981",
  Apartment: "#3b82f6",
};

function makeIcon(type: string) {
  const color = TYPE_COLORS[type] ?? "#64748b";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.941 14 22 14 22S28 23.941 28 14C28 6.268 21.732 0 14 0z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>`.trim();

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  });
}

function formatPrice(price: number, type: string): string {
  if (type === "Plot" && price < 100000)
    return `₹${price.toLocaleString("en-IN")}/sq.yd`;
  if (type === "Villa" && price < 100000)
    return `₹${price.toLocaleString("en-IN")}/sq.ft`;
  if (type === "Apartment" && price < 100000)
    return `₹${price.toLocaleString("en-IN")}/sq.ft`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

/** Auto-fits map bounds to visible markers */
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
    } else {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
    }
  }, [map, positions]);
  return null;
}

interface Props {
  properties: PropertySummary[];
}

export function PropertyMap({ properties }: Props) {
  const mapped = properties
    .map((p) => ({ property: p, coords: PROPERTY_COORDS[p.title] }))
    .filter(
      (x): x is { property: PropertySummary; coords: [number, number] } =>
        !!x.coords,
    );

  const positions = mapped.map((x) => x.coords);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={10}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds positions={positions} />

      {mapped.map(({ property: p, coords }) => (
        <Marker key={p.id} position={coords} icon={makeIcon(p.propertyType)}>
          <Popup minWidth={220}>
            <div className="py-0.5">
              <p className="font-semibold text-sm text-gray-800 leading-tight mb-1">
                {p.title}
              </p>
              <p className="text-xs text-gray-500 mb-1">{p.location}</p>
              <span
                className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mb-2"
                style={{
                  background: (TYPE_COLORS[p.propertyType] ?? "#64748b") + "22",
                  color: TYPE_COLORS[p.propertyType] ?? "#64748b",
                }}
              >
                {p.propertyType}
              </span>
              <p className="text-sm font-bold text-amber-600 mb-2">
                {formatPrice(p.price, p.propertyType)}
              </p>
              <Link
                to={`/properties/${p.id}`}
                className="block text-center text-xs font-semibold text-white rounded-lg py-1.5 px-3"
                style={{ background: TYPE_COLORS[p.propertyType] ?? "#64748b" }}
              >
                View Details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Legend */}
      <div
        className="leaflet-bottom leaflet-right"
        style={{ pointerEvents: "none" }}
      >
        <div className="leaflet-control bg-white rounded-xl shadow-md px-3 py-2 mb-3 mr-2 text-xs space-y-1">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: color }}
              />
              <span className="text-gray-600">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </MapContainer>
  );
}
