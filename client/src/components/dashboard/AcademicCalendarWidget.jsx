import { useEffect, useState } from "react";
import { format } from "date-fns";

function AcademicCalendarWidget() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const eventColors = {
    Semester: "bg-primary-light text-primary dark:bg-primary/20 dark:text-secondary border-l-4 border-primary dark:border-secondary",
    Examination: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-350 border-l-4 border-red-500",
    Vacation: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-350 border-l-4 border-emerald-500",
    Event: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-350 border-l-4 border-indigo-500",
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/academic-calendar`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch academic calendar");
        }

        const data = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = data.events
          .filter((event) => new Date(event.endDate) >= today)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() -
              new Date(b.startDate).getTime()
          );

        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Error fetching academic calendar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
      <h3 className="font-serif font-semibold text-foreground dark:text-white mb-4">
        Academic Calendar
      </h3>

      {loading ? (
        <p className="text-sm text-foreground-muted dark:text-slate-400">
          Loading academic calendar...
        </p>
      ) : events.length === 0 ? (
        <p className="text-sm text-foreground-muted dark:text-slate-400">
          No upcoming events.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
          {events.map((event) => (
            <div
              key={event.id}
              className={`rounded-xl p-3 transition-all duration-200 ${eventColors[event.type] || "bg-background dark:bg-surface-dark-elevated text-foreground dark:text-white border-l-4 border-border dark:border-border-dark"
                }`}
            >
              <p className="text-sm font-semibold">{event.title}</p>

              <p className="text-xs opacity-75 mt-1">
                {format(new Date(event.startDate), "MMM d, yyyy")}
                {event.endDate &&
                  ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
              </p>

              <p className="mt-1 text-xs font-semibold">{event.type}</p>

              {event.description && (
                <p className="mt-1 text-xs text-foreground-muted dark:text-slate-400">
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AcademicCalendarWidget;
