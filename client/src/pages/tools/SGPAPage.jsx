import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

function SGPACalculatorPage() {
  const [subjects, setSubjects] = useState([
    { name: '', credits: '', grade: 'A' },
  ]);

  const grades = {
    A: 10,
    'A-': 9,
    B: 8,
    'B-': 7,
    C: 6,
    C_: 5,
    D: 4,
    F: 0,
  };

  const calculateSGPA = () => {
    const validSubjects = subjects.filter((s) => s.name && s.credits && s.grade);
    if (validSubjects.length === 0) {
      return 0;
    }
    const totalPoints = validSubjects.reduce((sum, s) => sum + grades[s.grade] * parseFloat(s.credits), 0);
    const totalCredits = validSubjects.reduce((sum, s) => sum + parseFloat(s.credits), 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const sgpa = calculateSGPA();

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', credits: '', grade: 'A' }]);
  };

  const handleRemoveSubject = (idx) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  const handleChange = (idx, field, value) => {
    const updated = [...subjects];
    updated[idx][field] = value;
    setSubjects(updated);
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card transition-colors duration-300">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white">SGPA Calculator</h1>
        <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">Calculate your semester GPA for a specific term</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card space-y-4 transition-colors duration-300">
          <div className="space-y-4">
            {subjects.map((subject, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Subject name"
                  value={subject.name}
                  onChange={(e) => handleChange(idx, 'name', e.target.value)}
                  className="flex-1 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={subject.credits}
                  onChange={(e) => handleChange(idx, 'credits', e.target.value)}
                  className="w-24 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all text-sm"
                />
                <select
                  value={subject.grade}
                  onChange={(e) => handleChange(idx, 'grade', e.target.value)}
                  className="rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white px-4 py-2.5 outline-none focus:border-primary dark:focus:border-secondary transition-all cursor-pointer text-sm"
                >
                  {Object.keys(grades).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {subjects.length > 1 && (
                  <button
                    onClick={() => handleRemoveSubject(idx)}
                    className="rounded-xl bg-red-50 dark:bg-red-950/25 p-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 flex items-center justify-center"
                    title="Remove subject"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleAddSubject}
            className="mt-4 flex items-center gap-2 rounded-full bg-secondary hover:bg-secondary-hover px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 shadow-sm"
          >
            <FiPlus className="h-4 w-4" />
            Add Subject
          </button>
        </div>

        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300 flex flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-sm uppercase font-semibold tracking-wider text-foreground-muted dark:text-slate-400">Your SGPA</p>
            <p className="mt-4 text-6xl font-serif font-bold text-primary dark:text-secondary">{sgpa}</p>
            <p className="mt-2 text-xs text-foreground-muted dark:text-slate-500">Semester GPA</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SGPACalculatorPage;
