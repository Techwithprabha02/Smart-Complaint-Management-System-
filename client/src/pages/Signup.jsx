import SignupForm from '../components/auth/SignupForm';

export default function Signup() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mb-6 text-sm text-slate-500">Join FixMyCity to report local issues</p>
        <SignupForm />
      </div>
    </div>
  );
}
