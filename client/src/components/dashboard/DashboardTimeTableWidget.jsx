function DashboardTimeTableWidget() {
  const todaySchedule = [
    { time: '09:00-10:00', subject: 'Data Structures', room: 'A-201' },
    { time: '10:15-11:15', subject: 'Database Systems', room: 'B-105' },
    { time: '13:00-14:00', subject: 'Web Development', room: 'Lab-3' },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-4">Today's Schedule</h3>
      <div className="space-y-3">
        {todaySchedule.map((slot, idx) => (
          <div key={idx} className="flex gap-4 rounded-2xl border border-slate-200 p-3 bg-gradient-to-r from-slate-50 to-transparent">
            <div className="font-mono text-sm font-semibold text-primary min-w-max">{slot.time}</div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{slot.subject}</p>
              <p className="text-xs text-slate-500">Room {slot.room}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardTimeTableWidget;
