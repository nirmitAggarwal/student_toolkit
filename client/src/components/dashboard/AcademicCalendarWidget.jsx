import { useEffect, useState } from "react";
import { format } from "date-fns";

function AcademicCalendarWidget() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const eventColors = {
    Semester: "bg-blue-100 text-blue-700",
    Examination: "bg-red-100 text-red-700",
    Vacation: "bg-green-100 text-green-700",
    Event: "bg-purple-100 text-purple-700",
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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-slate-900">
        Academic Calendar
      </h3>

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading academic calendar...
        </p>
      ) : events.length === 0 ? (
        <p className="text-sm text-slate-500">
          No upcoming events.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className={`rounded-2xl p-3 ${eventColors[event.type] || "bg-slate-100 text-slate-700"
                }`}
            >
              <p className="text-sm font-medium">{event.title}</p>

              <p className="text-xs opacity-75">
                {format(new Date(event.startDate), "MMM d, yyyy")}
                {event.endDate &&
                  ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
              </p>

              <p className="mt-1 text-xs font-medium">{event.type}</p>

              {event.description && (
                <p className="mt-1 text-xs text-slate-600">
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