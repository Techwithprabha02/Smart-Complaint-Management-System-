import { useEffect } from 'react';
import MapView from '../components/map/MapView';
import Loader from '../components/shared/Loader';
import { useComplaints } from '../hooks/useComplaints';
import { useAuth } from '../context/AuthContext';

export default function MapPage() {
  const { isAuthenticated } = useAuth();
  const { complaints, loading, fetchComplaints } = useComplaints();

  useEffect(() => {
    if (isAuthenticated) fetchComplaints();
  }, [isAuthenticated, fetchComplaints]);

  return (
    <article>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Complaint Map</h1>
        <p className="text-sm text-slate-500">
          {isAuthenticated
            ? 'Markers colored by category — click for details'
            : 'Sign in to view complaint locations'}
        </p>
      </header>
      {loading && isAuthenticated ? (
        <Loader />
      ) : (
        <MapView complaints={isAuthenticated ? complaints : []} />
      )}
    </article>
  );
}
