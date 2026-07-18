import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FiPlus, FiTrash2, FiClock, FiCalendar, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const COLORS = [
  { value: '#3B82F6', name: 'Blue' },
  { value: '#EF4444', name: 'Red' },
  { value: '#10B981', name: 'Green' },
  { value: '#8B5CF6', name: 'Purple' },
  { value: '#F59E0B', name: 'Orange' },
  { value: '#EC4899', name: 'Pink' },
];

function ExamCountdownWidget() {
  // Initialize state with localStorage persistence
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('student_toolkit_exams');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((exam) => ({
          ...exam,
          date: new Date(exam.date),
        }));
      } catch (e) {
        console.error('Failed to parse exams from localStorage', e);
      }
    }
    // Pre-populate with a default exam if none exist
    return [
      {
        id: 'default-1',
        name: 'Mathematics Final',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 30 * 60 * 1000), // 5d 4h 30m from now
        color: '#3B82F6',
      },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [newExam, setNewExam] = useState({ 
    name: '', 
    date: '', 
    hour: '', 
    minute: '', 
    period: '', 
    color: '#3B82F6' 
  });
  const [now, setNow] = useState(new Date());

  // Synchronized interval clock ticking every 1 second
  useEffect(() => {
    const ticker = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Save to localStorage whenever exams state changes
  useEffect(() => {
    localStorage.setItem('student_toolkit_exams', JSON.stringify(exams));
  }, [exams]);

  // Open the add form with blank date to show standard placeholder (e.g., dd/mm/yyyy)
  const handleOpenForm = () => {
    setNewExam({
      name: '',
      date: '',
      hour: '10',
      minute: '00',
      period: 'AM',
      color: '#3B82F6',
    });
    setShowForm(true);
  };

  const handleAddExam = (e) => {
    e.preventDefault();
    if (!newExam.name || !newExam.date) {
      toast.error('Please enter the exam name and select a date');
      return;
    }

    // Parse dropdown clock selections
    let hourNum = parseInt(newExam.hour, 10);
    const minNum = parseInt(newExam.minute, 10);
    
    if (newExam.period === 'PM' && hourNum < 12) {
      hourNum += 12;
    } else if (newExam.period === 'AM' && hourNum === 12) {
      hourNum = 0;
    }

    const formattedHour = hourNum.toString().padStart(2, '0');
    const formattedMin = minNum.toString().padStart(2, '0');

    // Create target date string: YYYY-MM-DDTHH:MM:00
    const examDate = new Date(`${newExam.date}T${formattedHour}:${formattedMin}:00`);
    
    if (isNaN(examDate.getTime())) {
      toast.error('Invalid date format. Please check the entered date.');
      return;
    }

    if (examDate.getTime() < Date.now()) {
      toast.error('Target date/time must be in the future');
      return;
    }

    const addedExam = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: newExam.name,
      date: examDate,
      color: newExam.color,
    };

    setExams((prev) => [...prev, addedExam]);
    setNewExam({ name: '', date: '', hour: '10', minute: '00', period: 'AM', color: '#3B82F6' });
    setShowForm(false);
    toast.success('Exam countdown added!');
  };

  const handleDeleteExam = (id, name) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
    toast.success(`Removed countdown for ${name}`);
  };

  // Helper to calculate ticking clock segments
  const calculateTimeRemaining = (targetDate) => {
    const total = targetDate.getTime() - now.getTime();
    if (total <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
  };

  // Sort upcoming exams chronologically
  const upcomingExams = [...exams].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
      <div className="flex items-center justify-between mb-4 border-b border-border dark:border-border-dark pb-3">
        <h3 className="font-serif font-bold text-foreground dark:text-white flex items-center gap-2">
          <FiClock className="text-primary dark:text-secondary h-5 w-5" />
          Exam Countdown
        </h3>
        <span className="rounded-full bg-primary/10 dark:bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-primary dark:text-secondary">
          {exams.length} active
        </span>
      </div>

      {/* Countdown List */}
      <div className="space-y-3">
        {upcomingExams.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-foreground-muted dark:text-slate-400">No exams tracked yet.</p>
            <p className="text-xs text-foreground-muted dark:text-slate-500 mt-1">Add one below to start counting down!</p>
          </div>
        ) : (
          upcomingExams.map((exam) => {
            const time = calculateTimeRemaining(exam.date);
            const isCompleted = time.total <= 0;

            return (
              <div 
                key={exam.id} 
                className="group relative flex items-center justify-between rounded-xl bg-background dark:bg-surface-dark-elevated p-4 border-l-4 transition-all hover:shadow-sm" 
                style={{ borderLeftColor: exam.color }}
              >
                {/* Left side: Exam Info */}
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-semibold text-foreground dark:text-white truncate text-sm" title={exam.name}>
                    {exam.name}
                  </p>
                  <p className="text-xs text-foreground-muted dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                    <FiCalendar className="h-3.5 w-3.5 shrink-0 text-foreground-muted" />
                    {format(exam.date, 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>

                {/* Right side: Countdown Timer */}
                <div className="flex items-center gap-3 shrink-0">
                  {isCompleted ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 animate-pulse">
                      Started / Finished
                    </span>
                  ) : (
                    <div className="flex gap-1 text-center font-mono">
                      {/* Days Segment */}
                      <div className="bg-surface dark:bg-background-dark text-foreground dark:text-slate-200 px-2 py-1 rounded-lg text-xs min-w-[32px] shadow-sm">
                        <span className="block font-bold text-sm">{time.days}</span>
                        <span className="text-[9px] text-foreground-muted dark:text-slate-550 font-semibold uppercase">d</span>
                      </div>
                      {/* Hours Segment */}
                      <div className="bg-surface dark:bg-background-dark text-foreground dark:text-slate-200 px-2 py-1 rounded-lg text-xs min-w-[32px] shadow-sm">
                        <span className="block font-bold text-sm">{time.hours.toString().padStart(2, '0')}</span>
                        <span className="text-[9px] text-foreground-muted dark:text-slate-550 font-semibold uppercase">h</span>
                      </div>
                      {/* Minutes Segment */}
                      <div className="bg-surface dark:bg-background-dark text-foreground dark:text-slate-200 px-2 py-1 rounded-lg text-xs min-w-[32px] shadow-sm">
                        <span className="block font-bold text-sm">{time.minutes.toString().padStart(2, '0')}</span>
                        <span className="text-[9px] text-foreground-muted dark:text-slate-550 font-semibold uppercase">m</span>
                      </div>
                      {/* Seconds Segment */}
                      <div className="bg-surface dark:bg-background-dark text-foreground dark:text-slate-200 px-2 py-1 rounded-lg text-xs min-w-[32px] shadow-sm">
                        <span className="block font-bold text-sm">{time.seconds.toString().padStart(2, '0')}</span>
                        <span className="text-[9px] text-foreground-muted dark:text-slate-550 font-semibold uppercase">s</span>
                      </div>
                    </div>
                  )}

                  {/* Hover trash button to delete */}
                  <button
                    onClick={() => handleDeleteExam(exam.id, exam.name)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-lg p-2 text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shrink-0 ml-1"
                    title={`Delete countdown for ${exam.name}`}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Trigger Action */}
      {!showForm ? (
        <button 
          onClick={handleOpenForm} 
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary-hover px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 shadow-sm"
        >
          <FiPlus className="h-4 w-4" />
          Add Countdown
        </button>
      ) : (
        <form onSubmit={handleAddExam} className="mt-4 space-y-4 p-4 bg-background dark:bg-surface-dark-elevated border border-border dark:border-border-dark rounded-xl">
          <div className="flex items-center justify-between border-b border-border dark:border-border-dark pb-2">
            <span className="text-xs font-semibold text-foreground-muted dark:text-slate-400">New Exam Countdown</span>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="text-foreground-muted hover:text-foreground dark:hover:text-white"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Input Name */}
            <div>
              <label className="block text-[11px] font-semibold text-foreground-muted dark:text-slate-400 mb-1">Exam / Course Name</label>
              <input 
                type="text" 
                placeholder="e.g., Chemistry Midterm" 
                value={newExam.name} 
                onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} 
                className="w-full rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated px-3 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary text-foreground dark:text-white"
              />
            </div>

            {/* Input Date (Typable Date Picker) */}
            <div>
              <label className="block text-[11px] font-semibold text-foreground-muted dark:text-slate-400 mb-1">Exam Date (YYYY-MM-DD)</label>
              <input 
                type="date" 
                value={newExam.date} 
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} 
                className="w-full rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated px-3 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary text-foreground dark:text-white"
              />
            </div>

            {/* Input Time (Clock Dropdown Selectors) */}
            <div>
              <label className="block text-[11px] font-semibold text-foreground-muted dark:text-slate-400 mb-1">Exam Time</label>
              <div className="grid grid-cols-3 gap-2">
                {/* Hours Select */}
                <select
                  value={newExam.hour}
                  onChange={(e) => setNewExam({ ...newExam, hour: e.target.value })}
                  className="rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated px-3 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary text-foreground dark:text-white cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                    const val = h.toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </select>

                {/* Minutes Select */}
                <select
                  value={newExam.minute}
                  onChange={(e) => setNewExam({ ...newExam, minute: e.target.value })}
                  className="rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated px-3 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary text-foreground dark:text-white cursor-pointer"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => {
                    const val = m.toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </select>

                {/* Period Select */}
                <select
                  value={newExam.period}
                  onChange={(e) => setNewExam({ ...newExam, period: e.target.value })}
                  className="rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark-elevated px-3 py-2 text-sm outline-none focus:border-primary dark:focus:border-secondary text-foreground dark:text-white cursor-pointer"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Color Dot selection */}
            <div>
              <label className="block text-[11px] font-semibold text-foreground-muted dark:text-slate-400 mb-2">Category Color Tag</label>
              <div className="flex items-center gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setNewExam({ ...newExam, color: color.value })}
                    className={`h-6 w-6 rounded-full transition-all duration-150 active:scale-90 relative ${
                      newExam.color === color.value 
                        ? 'ring-2 ring-primary dark:ring-secondary scale-110 shadow-sm' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {newExam.color === color.value && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="rounded-full border border-border dark:border-border-dark py-2 text-xs font-semibold text-foreground dark:text-slate-300 hover:bg-background dark:hover:bg-surface-dark-elevated transition duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="rounded-full bg-primary hover:bg-primary-hover py-2 text-xs font-semibold text-white transition duration-200 shadow-glow"
            >
              Save Countdown
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ExamCountdownWidget;
