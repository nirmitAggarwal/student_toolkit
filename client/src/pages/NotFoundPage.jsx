import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-10 text-center shadow-card transition-colors duration-300">
      <p className="text-xs uppercase tracking-[0.3em] text-foreground-muted dark:text-slate-500 font-semibold">404 Error</p>
      <h1 className="mt-6 text-5xl font-serif font-bold text-foreground dark:text-white">Page Not Found</h1>
      <p className="mt-4 text-base text-foreground-muted dark:text-slate-400 max-w-md mx-auto">The route you tried to reach does not exist. Return to the dashboard to continue.</p>
      <Link className="mt-8 inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary-hover px-6 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-glow" to="/dashboard">
        Go back to dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
