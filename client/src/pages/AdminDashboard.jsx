import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import StatusBadge from '../components/complaints/StatusBadge';
import PriorityBadge from '../components/complaints/PriorityBadge';
import Loader from '../components/shared/Loader';
import { useComplaints } from '../hooks/useComplaints';
import { formatDate, CATEGORY_ICONS } from '../utils/helpers';

export default function AdminDashboard() {
  const { complaints, stats, loading, fetchComplaints, fetchStats } = useComplaints();
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
  });

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v)
    );
    fetchComplaints(params);
  }, [filters, fetchComplaints]);

  const statCards = [
    { label: 'Total', value: stats?.total ?? 0, color: 'text-slate-900' },
    { label: 'Pending', value: stats?.pending ?? 0, color: 'text-slate-600' },
    { label: 'In Progress', value: stats?.inProgress ?? 0, color: 'text-[#2563EB]' },
    { label: 'Resolved', value: stats?.resolved ?? 0, color: 'text-[#16A34A]' },
  ];

  return (
    <article>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Manage and resolve citizen complaints</p>
      </header>

      <ul className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <li key={s.label} className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </li>
        ))}
      </ul>

      <section className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4">
        <FiFilter className="text-slate-400" />
        {['status', 'category', 'priority'].map((key) => (
          <select
            key={key}
            value={filters[key]}
            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
            className="rounded-lg border px-3 py-2 text-sm capitalize"
          >
            <option value="">All {key}</option>
            {key === 'status' &&
              ['Pending', 'In Progress', 'Resolved', 'Rejected'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            {key === 'category' &&
              ['Water', 'Electricity', 'Garbage', 'Road', 'Other'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            {key === 'priority' &&
              ['Low', 'Medium', 'High', 'Critical'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
          </select>
        ))}
      </section>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/complaints/${c._id}`}
                      className="font-medium text-[#2563EB] hover:underline"
                    >
                      {CATEGORY_ICONS[c.category]} {c.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {complaints.length === 0 && (
            <p className="p-8 text-center text-slate-500">No complaints match filters.</p>
          )}
        </div>
      )}
    </article>
  );
}
