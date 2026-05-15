import { FiCheck } from 'react-icons/fi';
import { STATUS_STEPS } from '../../utils/helpers';

export default function StatusTimeline({ status }) {
  const rejected = status === 'Rejected';
  const currentIndex = rejected ? -1 : STATUS_STEPS.indexOf(status);

  if (rejected) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        This complaint was rejected.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex min-w-[320px] items-center justify-between">
        {STATUS_STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                    done
                      ? 'border-green-500 bg-green-500 text-white'
                      : active
                        ? 'border-[#2563EB] bg-[#2563EB] text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {done ? <FiCheck size={16} /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    active ? 'text-[#2563EB]' : done ? 'text-green-600' : 'text-slate-400'
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 ${i < currentIndex ? 'bg-green-500' : 'bg-slate-200'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
