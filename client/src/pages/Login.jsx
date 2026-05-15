import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-500">Sign in to track your complaints</p>
        <LoginForm />
      </div>
    </div>
  );
}
