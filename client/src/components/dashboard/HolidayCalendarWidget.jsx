import { useState } from 'react';
import { format } from 'date-fns';

function HolidayCalendarWidget() {
  const [holidays, setHolidays] = useState([
    { date: '2026-08-15', name: 'Independence Day', type: 'national' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national' },
    { date: '2026-12-25', name: 'Christmas', type: 'international' },
  ]);

  const holidayColors = {
    national: 'bg-orange-100 text-orange-700',
    international: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-4">Holidays</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {holidays.map((holiday, idx) => (
          <div key={idx} className={`rounded-2xl p-3 ${holidayColors[holiday.type]}`}>
            <p className="text-sm font-medium">{holiday.name}</p>
            <p className="text-xs opacity-75">{format(new Date(holiday.date), 'MMM d, yyyy')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HolidayCalendarWidget;
