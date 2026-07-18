import { Link } from 'react-router-dom';

function ToolCard({ title, description, href, icon }) {
  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary dark:hover:border-secondary flex flex-col justify-between h-full">
      <div>
        {icon && <div className="text-3xl mb-4">{icon}</div>}
        <h3 className="text-xl font-serif font-semibold text-foreground dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-foreground-muted dark:text-slate-405 leading-relaxed">{description}</p>
      </div>
      <Link
        to={href}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary-hover px-5 py-2 text-sm font-semibold text-white transition-all duration-200 w-fit"
      >
        Launch
      </Link>
    </div>
  );
}

export default ToolCard;
