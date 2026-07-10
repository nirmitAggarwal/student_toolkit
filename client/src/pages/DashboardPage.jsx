import { format } from 'date-fns';
import ExamCountdownWidget from '../components/dashboard/ExamCountdownWidget.jsx';
import AcademicCalendarWidget from '../components/dashboard/AcademicCalendarWidget.jsx';
import HolidayCalendarWidget from '../components/dashboard/HolidayCalendarWidget.jsx';
import DashboardTimeTableWidget from '../components/dashboard/DashboardTimeTableWidget.jsx';
import { useAuthStore } from '../store/useAuthStore';

function DashboardPage() {
  const today = format(new Date(), 'EEEE, MMMM d');
  const { user } = useAuthStore();

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Welcome back</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{user?.name || 'Scholar'}</h1>
              <p className="mt-2 text-sm text-slate-500">Keep track of your academic goals</p>
            </div>
            <div className="rounded-3xl bg-primary px-4 py-3 text-white shadow-glow text-sm font-semibold">{today}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-primary to-secondary p-6 shadow-sm text-white">
          <p className="text-sm opacity-80">Your Focus</p>
          <p className="mt-3 text-3xl font-bold">Make today count</p>
          <p className="mt-2 text-sm opacity-70">Stay organized, ace your exams</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ExamCountdownWidget />
        <AcademicCalendarWidget />
        <HolidayCalendarWidget />
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">This Week's Focus</h2>
        <DashboardTimeTableWidget />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/tools/cgpa" className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center hover:shadow-glow hover:border-primary transition">
            <p className="text-3xl">📊</p>
            <p className="mt-3 font-semibold text-slate-900">Track CGPA</p>
          </a>
          <a href="/tools/attendance" className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center hover:shadow-glow hover:border-primary transition">
            <p className="text-3xl">✅</p>
            <p className="mt-3 font-semibold text-slate-900">Attendance</p>
          </a>
          <a href="/tools/pdf" className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center hover:shadow-glow hover:border-primary transition">
            <p className="text-3xl">📄</p>
            <p className="mt-3 font-semibold text-slate-900">Merge PDFs</p>
          </a>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
