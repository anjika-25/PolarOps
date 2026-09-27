import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Custom Leaflet marker icons using inline SVG for high-resolution rendering
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const stationMarkers = [
  {
    id: 'maitri',
    name: 'Maitri Station (Antarctica)',
    coords: [-70.7667, 11.7333],
    type: 'Main Base',
    region: 'Schirmacher Oasis, East Antarctica',
    color: '#2F6F95',
    label: 'M'
  },
  {
    id: 'bharati',
    name: 'Bharati Station (Antarctica)',
    coords: [-69.4072, 76.1911],
    type: 'Main Base',
    region: 'Larsemann Hills, East Antarctica',
    color: '#0B1F33',
    label: 'B'
  },
  {
    id: 'field_a',
    name: 'Field Camp A',
    coords: [-70.8200, 11.8500],
    type: 'Field Outpost',
    region: 'Schirmacher Glaciology Zone',
    color: '#287D4C',
    label: 'FA'
  },
  {
    id: 'field_b',
    name: 'Field Camp B',
    coords: [-70.9000, 11.6000],
    type: 'Field Outpost',
    region: 'Schirmacher Inland Runway',
    color: '#D89B24',
    label: 'FB'
  },
  {
    id: 'himadri',
    name: 'Himadri Station (Arctic)',
    coords: [78.9233, 11.9267],
    type: 'Arctic Research Station',
    region: 'Ny-Ålesund, Svalbard, Norway',
    color: '#2F6F95',
    label: 'H'
  }
];

const OperationalMap = () => {
  // Center near Antarctic stations by default
  const defaultCenter = [-70.5, 25.0];
  const defaultZoom = 3;

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-3.5 border-b border-polar-border flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-polar-primary" />
          <h3 className="text-sm font-bold text-polar-text uppercase tracking-wider">
            Simulated Operational Map
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-polar-textMuted bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
          Deterministic Station Markers
        </span>
      </div>

      <div className="h-[340px] w-full relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={false}
          className="h-full w-full"
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stationMarkers.map((st) => (
            <Marker
              key={st.id}
              position={st.coords}
              icon={createCustomIcon(st.color, st.label)}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <div className="font-bold text-xs text-[#0B1F33] mb-0.5">{st.name}</div>
                  <div className="text-[11px] text-slate-600 font-semibold">{st.type}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{st.region}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Coords: {st.coords[0]}, {st.coords[1]}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default OperationalMap;
