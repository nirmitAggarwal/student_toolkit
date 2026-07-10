import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
      toast.error('Add at least one subject with grade');
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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">SGPA Calculator</h1>
        <p className="mt-2 text-slate-600">Calculate your semester GPA for a specific term</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {subjects.map((subject, idx) => (
              <div key={idx} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Subject name"
                  value={subject.name}
                  onChange={(e) => handleChange(idx, 'name', e.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 outline-none focus:border-primary"
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={subject.credits}
                  onChange={(e) => handleChange(idx, 'credits', e.target.value)}
                  className="w-20 rounded-2xl border border-slate-200 px-4 py-2 outline-none focus:border-primary"
                />
                <select
                  value={subject.grade}
                  onChange={(e) => handleChange(idx, 'grade', e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 outline-none focus:border-primary"
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
                    className="rounded-2xl bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleAddSubject}
            className="mt-4 flex items-center gap-2 rounded-full bg-secondary px-6 py-2 text-sm font-semibold text-white hover:bg-primary"
          >
            <FiPlus className="h-4 w-4" />
            Add Subject
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-sm uppercase text-slate-500">Your SGPA</p>
            <p className="mt-4 text-5xl font-bold text-secondary">{sgpa}</p>
            <p className="mt-2 text-xs text-slate-500">Semester GPA</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SGPACalculatorPage;
