import { Link } from 'react-router-dom';
import { FiMapPin, FiChevronRight } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { CATEGORY_ICONS, formatDate } from '../../utils/helpers';

export default function ComplaintCard({ complaint }) {
  return (
    <Link
      to={`/complaints/${complaint._id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#2563EB]/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{CATEGORY_ICONS[complaint.category]}</span>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-[#2563EB]">
              {complaint.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{complaint.description}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <FiMapPin size={12} />
              {complaint.location?.address}
            </p>
          </div>
        </div>
        <FiChevronRight className="shrink-0 text-slate-300 group-hover:text-[#2563EB]" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={complaint.status} />
        <PriorityBadge priority={complaint.priority} />
        <span className="ml-auto text-xs text-slate-400">{formatDate(complaint.createdAt)}</span>
      </div>
    </Link>
  );
}
