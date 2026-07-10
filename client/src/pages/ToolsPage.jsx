function ToolsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">All tools</h1>
        <p className="mt-2 text-sm text-slate-500">Choose from the toolkit for academic productivity.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-primary text-3xl">📘</div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">CGPA Calculator</h2>
          <p className="mt-2 text-sm text-slate-500">Build your semester CGPA with dynamic subjects.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-secondary text-3xl">📊</div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Attendance Tracker</h2>
          <p className="mt-2 text-sm text-slate-500">Track attendance, skip days, and stay on target.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-accent text-3xl">📄</div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">PDF Merger</h2>
          <p className="mt-2 text-sm text-slate-500">Merge and download study notes without leaving the browser.</p>
        </div>
      </div>
    </section>
  );
}

export default ToolsPage;
