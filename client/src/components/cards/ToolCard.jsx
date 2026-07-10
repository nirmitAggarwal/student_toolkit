import { Link } from 'react-router-dom';

function ToolCard({ title, description, href }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-glow">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <Link
        to={href}
        className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
      >
        Launch
      </Link>
    </div>
  );
}

export default ToolCard;
