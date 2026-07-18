import { useState } from 'react';

function PercentageCalculatorPage() {
  const [obtained, setObtained] = useState('');
  const [total, setTotal] = useState('');

  const percentage = obtained && total ? ((obtained / total) * 100).toFixed(2) : 0;

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card transition-colors duration-300">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white">Percentage Calculator</h1>
        <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">Calculate your marks percentage instantly</p>
      </div>

      <div className="max-w-md rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card transition-colors duration-300">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground dark:text-slate-300 mb-2">Marks Obtained</label>
            <input
              type="number"
              value={obtained}
              onChange={(e) => setObtained(e.target.value)}
              className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
              placeholder="Enter obtained marks"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground dark:text-slate-300 mb-2">Total Marks</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
              placeholder="Enter total marks"
            />
          </div>

          <div className="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-glow transition-colors duration-300">
            <p className="text-sm opacity-80">Your Percentage</p>
            <p className="mt-3 text-5xl font-serif font-bold">{percentage}%</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PercentageCalculatorPage;
