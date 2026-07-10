import { useState } from 'react';

function PercentageCalculatorPage() {
  const [obtained, setObtained] = useState('');
  const [total, setTotal] = useState('');

  const percentage = obtained && total ? ((obtained / total) * 100).toFixed(2) : 0;

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Percentage Calculator</h1>
        <p className="mt-2 text-slate-600">Calculate your marks percentage instantly</p>
      </div>

      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Marks Obtained</label>
            <input
              type="number"
              value={obtained}
              onChange={(e) => setObtained(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:shadow-glow"
              placeholder="Enter obtained marks"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Marks</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:shadow-glow"
              placeholder="Enter total marks"
            />
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white">
            <p className="text-sm opacity-80">Your Percentage</p>
            <p className="mt-3 text-5xl font-bold">{percentage}%</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PercentageCalculatorPage;
