import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Attendance Tracker</h1>
        <p className="mt-2 text-slate-600">Track attendance and manage skip days</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {records.map((record, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Subject name"
                  value={record.subject}
                  onChange={(e) => handleChange(idx, 'subject', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Attended"
                    value={record.attended}
                    onChange={(e) => handleChange(idx, 'attended', e.target.value)}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    placeholder="Total"
                    value={record.total}
                    onChange={(e) => handleChange(idx, 'total', e.target.value)}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    placeholder="Required %"
                    value={record.required}
                    onChange={(e) => handleChange(idx, 'required', e.target.value)}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddRecord}
            className="mt-4 flex items-center gap-2 rounded-full bg-secondary px-6 py-2 text-sm font-semibold text-white hover:bg-primary"
          >
            <FiPlus className="h-4 w-4" />
            Add Subject
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="text-center rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white">
            <p className="text-sm opacity-80">Current %</p>
            <p className="mt-2 text-4xl font-bold">{metrics.percentage}%</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-green-50 p-4 text-center">
              <p className="text-xs text-slate-500">Can skip</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{metrics.canSkip}</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4 text-center">
              <p className="text-xs text-slate-500">Must attend</p>
              <p className="mt-2 text-2xl font-bold text-red-600">{metrics.mustAttend}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AttendanceTrackerPage;
