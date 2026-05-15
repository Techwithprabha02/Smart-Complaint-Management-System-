import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/my-complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <section>
        <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </section>
      <section>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </section>
      <section>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </section>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#2563EB] py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-[#2563EB] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
