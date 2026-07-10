import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404 error</p>
      <h1 className="mt-6 text-5xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-base text-slate-600">The route you tried to reach does not exist yet. Return to the dashboard to continue.</p>
      <Link className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary" to="/dashboard">
        Go back to dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
