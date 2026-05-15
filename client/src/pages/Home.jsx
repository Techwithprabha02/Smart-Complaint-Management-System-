import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <article>
      <section className="rounded-2xl bg-gradient-to-br from-[#2563EB] to-blue-800 px-6 py-16 text-white shadow-lg sm:px-12">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
          Report civic issues. Track fixes in real time.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          FixMyCity lets citizens report water leaks, power faults, garbage, and road damage —
          with AI priority detection and live status updates.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin' : '/submit'}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-[#2563EB] shadow hover:bg-blue-50"
            >
              {isAdmin ? 'Go to Dashboard' : 'Report an Issue'} <FiArrowRight />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-[#2563EB] shadow hover:bg-blue-50"
              >
                Get Started <FiArrowRight />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 font-semibold hover:bg-white/10"
              >
                Sign In
              </Link>
            </>
          )}
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 font-semibold hover:bg-white/10"
          >
            View Map
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Report Issues', desc: 'Submit with photos, location & category' },
          { title: 'AI Priority', desc: 'Urgency classified automatically' },
          { title: 'Live Tracking', desc: 'Status timeline from Pending to Resolved' },
          { title: 'Admin Dashboard', desc: 'City officials manage all complaints' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border bg-white p-5 shadow-sm">
            <FiCheckCircle className="mb-3 text-2xl text-[#16A34A]" />
            <h3 className="font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
