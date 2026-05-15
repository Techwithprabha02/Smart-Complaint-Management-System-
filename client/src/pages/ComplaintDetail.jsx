import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';
import StatusBadge from '../components/complaints/StatusBadge';
import PriorityBadge from '../components/complaints/PriorityBadge';
import StatusTimeline from '../components/complaints/StatusTimeline';
import Loader from '../components/shared/Loader';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../hooks/useComplaints';
import { CATEGORY_ICONS, formatDateTime, isVideoUrl } from '../utils/helpers';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export default function ComplaintDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { getComplaint, updateStatus, removeComplaint } = useComplaints();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getComplaint(id)
      .then((c) => {
        setComplaint(c);
        setStatus(c.status);
        setAdminNote(c.adminNote || '');
      })
      .catch(() => toast.error('Complaint not found'))
      .finally(() => setLoading(false));
  }, [id, getComplaint]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const updated = await updateStatus(id, { status, adminNote });
      setComplaint(updated);
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    try {
      await removeComplaint(id);
      toast.success('Deleted');
      window.location.href = '/admin';
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!complaint) {
    return (
      <p className="text-center text-slate-500">
        Complaint not found. <Link to="/my-complaints">Go back</Link>
      </p>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link to={isAdmin ? '/admin' : '/my-complaints'} className="mb-4 inline-flex items-center gap-1 text-sm text-[#2563EB]">
        <FiArrowLeft /> Back
      </Link>

      <header className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-3">
          <span className="text-3xl">{CATEGORY_ICONS[complaint.category]}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{complaint.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
              <FiMapPin /> {complaint.location?.address}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>
        <p className="mt-4 text-slate-600">{complaint.description}</p>
        <p className="mt-2 text-xs text-slate-400">Submitted {formatDateTime(complaint.createdAt)}</p>
      </header>

      <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-900">Progress</h2>
        <StatusTimeline status={complaint.status} />
      </section>

      {complaint.mediaUrls?.length > 0 && (
        <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Media</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {complaint.mediaUrls.map((url, i) => (
              <li key={i} className="overflow-hidden rounded-lg border">
                {isVideoUrl(url) ? (
                  <video src={url} controls className="h-40 w-full object-cover" />
                ) : (
                  <img src={url} alt="" className="h-40 w-full object-cover" />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {complaint.adminNote && !isAdmin && (
        <section className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-900">Admin Note</h3>
          <p className="mt-1 text-sm text-blue-800">{complaint.adminNote}</p>
        </section>
      )}

      {isAdmin && (
        <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Admin Actions</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Admin Note</label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Optional note for the citizen..."
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="rounded-lg bg-[#2563EB] px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Update Status'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-200 px-5 py-2 font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
