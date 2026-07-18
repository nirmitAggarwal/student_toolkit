import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

function AttendanceTrackerPage() {
  const [records, setRecords] = useState([
    { subject: '', attended: '', total: '', required: 75 },
  ]);

  const calculateMetrics = () => {
    const current = records
      .filter((r) => r.attended && r.total)
      .map((r) => ({
        percentage: (r.attended / r.total) * 100,
        required: r.required,
        attended: r.attended,
        total: r.total,
      }))[0];

    if (!current) return { canSkip: 0, mustAttend: 0, percentage: 0 };

    const classesNeeded = Math.ceil((current.required / 100) * current.total);
    const mustAttend = classesNeeded - current.attended;
    const totalRemaining = current.total - current.attended;
    const canSkip = totalRemaining - mustAttend;

    return {
      percentage: current.percentage.toFixed(2),
      canSkip: Math.max(0, canSkip),
      mustAttend: Math.max(0, mustAttend),
    };
  };

  const metrics = calculateMetrics();

  const handleAddRecord = () => {
    setRecords([...records, { subject: '', attended: '', total: '', required: 75 }]);
  };

  const handleChange = (idx, field, value) => {
    const updated = [...records];
    updated[idx][field] = value;
    setRecords(updated);
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card transition-colors duration-300">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white">Attendance Tracker</h1>
        <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">Track attendance and manage skip days</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
          <div className="space-y-4">
            {records.map((record, idx) => (
              <div key={idx} className="rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated p-4 space-y-3 transition-colors duration-300">
                <input
                  type="text"
                  placeholder="Subject name"
                  value={record.subject}
                  onChange={(e) => handleChange(idx, 'subject', e.target.value)}
                  className="w-full rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated text-foreground dark:text-white px-3.5 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary transition-all"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Attended"
                    value={record.attended}
                    onChange={(e) => handleChange(idx, 'attended', e.target.value)}
                    className="rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated text-foreground dark:text-white px-3.5 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Total"
                    value={record.total}
                    onChange={(e) => handleChange(idx, 'total', e.target.value)}
                    className="rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated text-foreground dark:text-white px-3.5 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Required %"
                    value={record.required}
                    onChange={(e) => handleChange(idx, 'required', e.target.value)}
                    className="rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated text-foreground dark:text-white px-3.5 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddRecord}
            className="mt-4 flex items-center gap-2 rounded-full bg-secondary hover:bg-secondary-hover px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 shadow-sm"
          >
            <FiPlus className="h-4 w-4" />
            Add Subject
          </button>
        </div>

        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card space-y-6 transition-colors duration-300">
          <div className="text-center rounded-xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-glow">
            <p className="text-sm opacity-80 font-medium">Current %</p>
            <p className="mt-2 text-4xl font-serif font-bold">{metrics.percentage}%</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 text-center">
              <p className="text-xs text-emerald-700 dark:text-emerald-450 font-semibold">Can skip</p>
              <p className="mt-2 text-3xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{metrics.canSkip}</p>
            </div>
            <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-4 text-center">
              <p className="text-xs text-red-750 dark:text-red-400 font-semibold">Must attend</p>
              <p className="mt-2 text-3xl font-serif font-bold text-red-600 dark:text-red-400">{metrics.mustAttend}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AttendanceTrackerPage;
