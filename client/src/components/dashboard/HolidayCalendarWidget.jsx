import { useEffect, useState } from "react";
import { format } from "date-fns";

function HolidayCalendarWidget() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const holidayColors = {
    "Gazetted Holiday": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-l-4 border-amber-500",
    "Restricted Holiday": "bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary border-l-4 border-primary dark:border-secondary",
    "National Holiday": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-350 border-l-4 border-emerald-500",
    "Optional Holiday": "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-350 border-l-4 border-indigo-500",
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/holidays?type=Gazetted%20Holiday&upcoming=true`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch holidays");
        }

        const data = await response.json();
        setHolidays(data.holidays);
      } catch (err) {
        console.error("Error fetching holidays:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
      <h3 className="font-serif font-semibold text-foreground dark:text-white mb-4">
        Upcoming Holidays
      </h3>

      {loading ? (
        <p className="text-sm text-foreground-muted dark:text-slate-400">Loading holidays...</p>
      ) : holidays.length === 0 ? (
        <p className="text-sm text-foreground-muted dark:text-slate-400">No upcoming holidays.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
          {holidays
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((holiday) => (
              <div
                key={holiday._id}
                className={`rounded-xl p-3 transition-all duration-200 ${holidayColors[holiday.type] ||
                  "bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white border-l-4 border-border dark:border-border-dark"
                  }`}
              >
                <p className="text-sm font-semibold">{holiday.name}</p>

                <p className="text-xs opacity-75 mt-1 font-medium">
                  {format(new Date(holiday.date), "MMM d, yyyy")}
                </p>

                <p className="mt-1 text-xs font-semibold">{holiday.type}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default HolidayCalendarWidget;
