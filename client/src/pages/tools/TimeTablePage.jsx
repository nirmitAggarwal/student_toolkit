import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function TimeTablePage() {
  const [timetable, setTimetable] = useState(
    Object.fromEntries(DAYS.map((day) => [day, Array(6).fill(null)]))
  );

  const handleChange = (day, slot, value) => {
    setTimetable({
      ...timetable,
      [day]: timetable[day].map((v, i) => (i === slot ? value : v)),
    });
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card transition-colors duration-300">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white">Time Table Manager</h1>
        <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">Plan your weekly schedule effortlessly</p>
      </div>

      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card overflow-x-auto transition-colors duration-300">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-foreground dark:text-slate-300 text-left border-b border-border dark:border-border-dark font-serif">Day</th>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <th key={i} className="px-4 py-3 text-sm font-semibold text-foreground dark:text-slate-300 text-center border-b border-border dark:border-border-dark font-serif">
                    Period {i + 1}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day} className="hover:bg-background/40 dark:hover:bg-surface-dark-elevated/40 transition-colors">
                <td className="px-4 py-3 font-semibold text-foreground dark:text-slate-200 border-b border-border dark:border-border-dark text-sm">{day}</td>
                {Array(6)
                  .fill(0)
                  .map((_, slot) => (
                    <td key={slot} className="px-2 py-3 border-b border-border dark:border-border-dark">
                      <input
                        type="text"
                        placeholder="Subject"
                        value={timetable[day][slot] || ''}
                        onChange={(e) => handleChange(day, slot, e.target.value)}
                        className="w-full rounded-lg border border-border dark:border-border-dark bg-background dark:bg-surface-dark px-2.5 py-1.5 text-xs outline-none focus:border-primary dark:focus:border-secondary text-foreground dark:text-white transition-all placeholder:text-foreground-muted/50"
                      />
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TimeTablePage;
