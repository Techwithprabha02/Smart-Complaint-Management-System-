import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import ComplaintCard from '../components/complaints/ComplaintCard';
import Loader from '../components/shared/Loader';
import { useComplaints } from '../hooks/useComplaints';

export default function MyComplaints() {
  const { complaints, loading, fetchComplaints } = useComplaints();

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <article>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
          <p className="text-sm text-slate-500">Track status of your reported issues</p>
        </div>
        <Link
          to="/submit"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FiPlus /> New Report
        </Link>
      </header>

      {loading ? (
        <Loader />
      ) : complaints.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-slate-500">No complaints yet.</p>
          <Link to="/submit" className="mt-4 inline-block text-[#2563EB] hover:underline">
            Report your first issue →
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {complaints.map((c) => (
            <li key={c._id}>
              <ComplaintCard complaint={c} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
