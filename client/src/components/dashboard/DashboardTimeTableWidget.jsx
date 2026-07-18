function DashboardTimeTableWidget() {
  const todaySchedule = [
    { time: '09:00-10:00', subject: 'Data Structures', room: 'A-201' },
    { time: '10:15-11:15', subject: 'Database Systems', room: 'B-105' },
    { time: '13:00-14:00', subject: 'Web Development', room: 'Lab-3' },
  ];

  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
      <h3 className="font-serif font-semibold text-foreground dark:text-white mb-4">Today's Schedule</h3>
      <div className="space-y-3">
        {todaySchedule.map((slot, idx) => (
          <div key={idx} className="flex gap-4 rounded-xl border border-border dark:border-border-dark p-3.5 bg-gradient-to-r from-background dark:from-surface-dark-elevated to-transparent transition-colors duration-300">
            <div className="font-mono text-sm font-semibold text-primary dark:text-secondary min-w-max">{slot.time}</div>
            <div className="flex-1">
              <p className="font-semibold text-foreground dark:text-white text-sm">{slot.subject}</p>
              <p className="text-xs text-foreground-muted dark:text-slate-400 mt-0.5">Room {slot.room}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardTimeTableWidget;
