import { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FiMapPin } from 'react-icons/fi';

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };
const mapContainerStyle = { width: '100%', height: '320px', borderRadius: '12px' };

export default function MapPicker({ value, onChange }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

  const center = value?.lat
    ? { lat: value.lat, lng: value.lng }
    : DEFAULT_CENTER;

  const [map, setMap] = useState(null);

  const reverseGeocode = useCallback(
    (lat, lng) => {
      if (!window.google?.maps) {
        onChange({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        const address =
          status === 'OK' && results[0]
            ? results[0].formatted_address
            : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        onChange({ lat, lng, address });
      });
    },
    [onChange]
  );

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    reverseGeocode(lat, lng);
  };

  if (!apiKey) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Add <code className="font-mono">VITE_GOOGLE_MAPS_API_KEY</code> to enable map picker.
        <input
          type="text"
          placeholder="Enter address manually"
          className="mt-3 w-full rounded-lg border px-3 py-2"
          value={value?.address || ''}
          onChange={(e) =>
            onChange({
              lat: value?.lat || DEFAULT_CENTER.lat,
              lng: value?.lng || DEFAULT_CENTER.lng,
              address: e.target.value,
            })
          }
        />
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="h-80 animate-pulse rounded-xl bg-slate-200" />;
  }

  return (
    <section>
      <label className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">
        <FiMapPin /> Click on map to set location
      </label>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        onClick={onMapClick}
        onLoad={setMap}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        {value?.lat && <Marker position={{ lat: value.lat, lng: value.lng }} />}
      </GoogleMap>
      {value?.address && (
        <p className="mt-2 text-sm text-slate-600">
          <strong>Selected:</strong> {value.address}
        </p>
      )}
    </section>
  );
}
