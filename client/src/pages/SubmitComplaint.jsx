import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MapPicker from '../components/map/MapPicker';
import MediaUploader from '../components/complaints/MediaUploader';
import { useComplaints } from '../hooks/useComplaints';

const CATEGORIES = ['Water', 'Electricity', 'Garbage', 'Road', 'Other'];

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const { submitComplaint } = useComplaints();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Water',
    location: null,
  });
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location?.address) {
      toast.error('Please select a location on the map');
      return;
    }

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('location', JSON.stringify(form.location));
    files.forEach((f) => fd.append('media', f));

    setLoading(true);
    try {
      const complaint = await submitComplaint(fd);
      toast.success('Complaint submitted!');
      navigate(`/complaints/${complaint._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Report an Issue</h1>
        <p className="text-sm text-slate-500">Describe the problem and pin its location</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
        <section>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="e.g. Water pipe burst on Main Street"
          />
        </section>

        <section>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Describe the issue in detail..."
          />
        </section>

        <section>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 focus:border-[#2563EB] focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </section>

        <MapPicker value={form.location} onChange={(location) => setForm({ ...form, location })} />

        <MediaUploader files={files} onChange={setFiles} />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#2563EB] py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </article>
  );
}
