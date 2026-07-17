import { useState } from 'react';
import { format } from 'date-fns';

function AcademicCalendarWidget() {
  const [events, setEvents] = useState([
    { date: '2026-08-15', title: 'Semester Start', type: 'event' },
    { date: '2026-10-02', title: 'Midterm Exams', type: 'exam' },
    { date: '2026-11-26', title: 'Assignment Deadline', type: 'assignment' },
  ]);

  const eventColors = {
    event: 'bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary border-l-4 border-primary dark:border-secondary',
    exam: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-350 border-l-4 border-red-500',
    assignment: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-350 border-l-4 border-emerald-500',
  };

  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
      <h3 className="font-serif font-semibold text-foreground dark:text-white mb-4">Academic Calendar</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        {events.map((event, idx) => (
          <div key={idx} className={`rounded-xl p-3 transition-all duration-200 ${eventColors[event.type]}`}>
            <p className="text-sm font-semibold">{event.title}</p>
            <p className="text-xs opacity-75 mt-1">{format(new Date(event.date), 'MMM d, yyyy')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AcademicCalendarWidget;
