import { useState } from 'react';
import { format } from 'date-fns';

function HolidayCalendarWidget() {
  const [holidays, setHolidays] = useState([
    { date: '2026-08-15', name: 'Independence Day', type: 'national' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national' },
    { date: '2026-12-25', name: 'Christmas', type: 'international' },
  ]);

  const holidayColors = {
    national: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-l-4 border-amber-500',
    international: 'bg-indigo-50 text-indigo-750 dark:bg-indigo-950/40 dark:text-indigo-300 border-l-4 border-indigo-500',
  };

  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
      <h3 className="font-serif font-semibold text-foreground dark:text-white mb-4">Holidays</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        {holidays.map((holiday, idx) => (
          <div key={idx} className={`rounded-xl p-3 transition-all duration-200 ${holidayColors[holiday.type]}`}>
            <p className="text-sm font-semibold">{holiday.name}</p>
            <p className="text-xs opacity-75 mt-1">{format(new Date(holiday.date), 'MMM d, yyyy')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HolidayCalendarWidget;
