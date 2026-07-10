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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Time Table Manager</h1>
        <p className="mt-2 text-slate-600">Plan your weekly schedule effortlessly</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm font-semibold text-slate-700 text-left border-b">Day</th>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <th key={i} className="px-4 py-2 text-sm font-semibold text-slate-700 text-center border-b">
                    Period {i + 1}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, dayIdx) => (
              <tr key={day}>
                <td className="px-4 py-3 font-semibold text-slate-700 border-b">{day}</td>
                {Array(6)
                  .fill(0)
                  .map((_, slot) => (
                    <td key={slot} className="px-2 py-2 border-b">
                      <input
                        type="text"
                        placeholder="Subject"
                        value={timetable[day][slot] || ''}
                        onChange={(e) => handleChange(day, slot, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-primary"
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
