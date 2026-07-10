import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

function ExamCountdownWidget() {
  const [exams, setExams] = useState([
    { name: 'Mathematics Final', date: new Date(2026, 7, 15), color: '#1D4ED8' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', date: '', color: '#1D4ED8' });

  const handleAddExam = () => {
    if (!newExam.name || !newExam.date) {
      toast.error('Fill all fields');
      return;
    }
    setExams([...exams, { ...newExam, date: new Date(newExam.date) }]);
    setNewExam({ name: '', date: '', color: '#1D4ED8' });
    setShowForm(false);
    toast.success('Exam added!');
  };

  const upcomingExams = exams
    .sort((a, b) => a.date - b.date)
    .slice(0, 3);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-4">Upcoming Exams</h3>
      <div className="space-y-3">
        {upcomingExams.map((exam, idx) => {
          const daysLeft = differenceInDays(exam.date, new Date());
          return (
            <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border-l-4" style={{ borderColor: exam.color }}>
              <div>
                <p className="font-medium text-slate-900">{exam.name}</p>
                <p className="text-xs text-slate-500">{format(exam.date, 'MMM d, yyyy')}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: exam.color }}>{daysLeft}</p>
                <p className="text-xs text-slate-500">days left</p>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={() => setShowForm(!showForm)} className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-primary">
        <FiPlus className="h-4 w-4" />
        Add Exam
      </button>
      {showForm && (
        <div className="mt-4 space-y-3 p-4 bg-slate-50 rounded-2xl">
          <input type="text" placeholder="Exam name" value={newExam.name} onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
          <input type="date" value={newExam.date} onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
          <button onClick={handleAddExam} className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-secondary">
            Save Exam
          </button>
        </div>
      )}
    </div>
  );
}

export default ExamCountdownWidget;
