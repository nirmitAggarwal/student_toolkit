import { useState } from 'react';
import { format } from 'date-fns';

function AcademicCalendarWidget() {
  const [events, setEvents] = useState([
    { date: '2026-08-15', title: 'Semester Start', type: 'event' },
    { date: '2026-10-02', title: 'Midterm Exams', type: 'exam' },
    { date: '2026-11-26', title: 'Assignment Deadline', type: 'assignment' },
  ]);

  const eventColors = {
    event: 'bg-blue-100 text-blue-700',
    exam: 'bg-red-100 text-red-700',
    assignment: 'bg-green-100 text-green-700',
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-4">Academic Calendar</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {events.map((event, idx) => (
          <div key={idx} className={`rounded-2xl p-3 ${eventColors[event.type]}`}>
            <p className="text-sm font-medium">{event.title}</p>
            <p className="text-xs opacity-75">{format(new Date(event.date), 'MMM d, yyyy')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AcademicCalendarWidget;
