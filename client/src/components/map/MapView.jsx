import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import StatusBadge from '../complaints/StatusBadge';
import PriorityBadge from '../complaints/PriorityBadge';
import { CATEGORY_COLORS } from '../../utils/helpers';

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };
const mapContainerStyle = { width: '100%', height: '480px', borderRadius: '12px' };

export default function MapView({ complaints = [] }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey || '' });
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  if (!apiKey) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
        Configure <code>VITE_GOOGLE_MAPS_API_KEY</code> to view complaints on the map.
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="h-[480px] animate-pulse rounded-xl bg-slate-200" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      onClick={() => setSelected(null)}
    >
      {complaints.map((c) => {
        if (!c.location?.lat) return null;
        const color = CATEGORY_COLORS[c.category] || '#2563EB';
        return (
          <Marker
            key={c._id}
            position={{ lat: c.location.lat, lng: c.location.lng }}
            onClick={() => setSelected(c)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: color,
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#fff',
            }}
          />
        );
      })}
      {selected && (
        <InfoWindow
          position={{ lat: selected.location.lat, lng: selected.location.lng }}
          onCloseClick={() => setSelected(null)}
        >
          <article className="max-w-[220px] p-1">
            <h4 className="font-semibold text-slate-900">{selected.title}</h4>
            <div className="mt-2 flex flex-wrap gap-1">
              <StatusBadge status={selected.status} />
              <PriorityBadge priority={selected.priority} />
            </div>
            <Link
              to={`/complaints/${selected._id}`}
              className="mt-2 inline-block text-sm text-[#2563EB] hover:underline"
            >
              View details →
            </Link>
          </article>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
