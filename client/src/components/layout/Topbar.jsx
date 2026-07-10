import { FiSearch, FiSettings, FiMoon, FiSun } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useTheme } from '../../contexts/ThemeContext';

function Topbar() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 shadow-sm">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome, {user?.name || 'Scholar'}</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your Academic Hub</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-3 text-slate-600 dark:text-slate-400">
          <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search tools"
            className="w-full bg-transparent pl-10 outline-none dark:text-white"
            aria-label="Search tools"
          />
        </div>
        <button
          onClick={toggleTheme}
          className="rounded-full bg-slate-100 dark:bg-slate-700 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="rounded-full bg-slate-100 dark:bg-slate-700 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          title="Settings"
        >
          <FiSettings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
