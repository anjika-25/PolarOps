import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';

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
    shortName: 'Maitri Station',
    coords: [-70.7667, 11.7333],
    type: 'Main Base',
    region: 'Schirmacher Oasis, East Antarctica',
    color: '#2F6F95',
    label: 'M'
  },
  {
    id: 'bharati',
    name: 'Bharati Station (Antarctica)',
    shortName: 'Bharati Station',
    coords: [-69.4072, 76.1911],
    type: 'Main Base',
    region: 'Larsemann Hills, East Antarctica',
    color: '#0B1F33',
    label: 'B'
  },
  {
    id: 'field_a',
    name: 'Field Camp A',
    shortName: 'Field Camp A',
    coords: [-70.8200, 11.8500],
    type: 'Field Outpost',
    region: 'Schirmacher Glaciology Zone',
    color: '#287D4C',
    label: 'FA'
  },
  {
    id: 'field_b',
    name: 'Field Camp B',
    shortName: 'Field Camp B',
    coords: [-70.9000, 11.6000],
    type: 'Field Outpost',
    region: 'Schirmacher Inland Runway',
    color: '#D89B24',
    label: 'FB'
  },
  {
    id: 'himadri',
    name: 'Himadri Station (Arctic)',
    shortName: 'Himadri Station',
    coords: [78.9233, 11.9267],
    type: 'Arctic Research Station',
    region: 'Ny-Ålesund, Svalbard, Norway',
    color: '#2F6F95',
    label: 'H'
  }
];

// Inner component helper to extract the Leaflet map instance reliably
const MapController = ({ onMapReady }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  return null;
};

const OperationalMap = () => {
  // Center near Antarctic stations by default (zoomed out covering all bases)
  const defaultCenter = [-70.5, 25.0];
  const defaultZoom = 3;

  const mapInstanceRef = useRef(null);
  const markerRefs = useRef({});
  const [activeStationId, setActiveStationId] = useState(null);

  const handleMapReady = (map) => {
    mapInstanceRef.current = map;
  };

  const handleFlyToStation = (st) => {
    setActiveStationId(st.id);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(st.coords, 8, { duration: 1.2 });
    }

    const marker = markerRefs.current[st.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleResetView = () => {
    setActiveStationId(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(defaultCenter, defaultZoom, { duration: 1.2 });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
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

      {/* Map Container with Interactive Legend Overlay */}
      <div className="h-[340px] w-full relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={false}
          className="h-full w-full"
          attributionControl={true}
        >
          <MapController onMapReady={handleMapReady} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stationMarkers.map((st) => (
            <Marker
              key={st.id}
              ref={(el) => {
                if (el) markerRefs.current[st.id] = el;
              }}
              position={st.coords}
              icon={createCustomIcon(st.color, st.label)}
              eventHandlers={{
                click: () => setActiveStationId(st.id),
              }}
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

        {/* Interactive Map Legend Overlay (Clickable Station Locator) */}
        <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-xs border border-polar-border shadow-md rounded-lg p-2.5 text-xs w-48 select-none">
          <div className="font-bold text-[10px] uppercase tracking-wider text-polar-textMuted mb-1.5 border-b border-polar-border pb-1 flex items-center justify-between">
            <span>Station Locator</span>
            {activeStationId ? (
              <button
                onClick={handleResetView}
                className="text-[9px] text-polar-primary hover:underline font-bold flex items-center gap-0.5"
                title="Reset to full map view"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            ) : (
              <span className="text-[9px] text-slate-400 font-normal">Click to Locate</span>
            )}
          </div>
          <div className="space-y-1">
            {stationMarkers.map((st) => {
              const isActive = activeStationId === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => handleFlyToStation(st)}
                  className={`w-full flex items-center justify-between text-left px-2 py-1 rounded transition-all text-[11px] group ${
                    isActive
                      ? 'bg-[#2F6F95] text-white font-bold shadow-2xs'
                      : 'hover:bg-slate-100/90 text-slate-700 font-semibold'
                  }`}
                  title={`Pan & zoom map to ${st.name}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-white shadow-2xs"
                      style={{ backgroundColor: st.color }}
                    />
                    <span className="truncate">{st.shortName}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold font-mono px-1 rounded ${
                      isActive ? 'bg-cyan-900/40 text-cyan-200' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {st.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalMap;
