import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const eventColors = {
  Holiday: "#C0A062",       // IEEE Accent Gold
  Semester: "#00508F",      // IEEE Primary Blue
  Examination: "#ef4444",   // Examination Red
  Vacation: "#10b981",      // Vacation Green
  Event: "#4DB6AC",         // IEEE Secondary Teal
};

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/calendar`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch calendar");
        }

        const data = await response.json();

        const formattedEvents = data.events.flatMap((event) => {
          const baseProps = {
            allDay: true,
            backgroundColor: eventColors[event.type] || "#64748b",
            borderColor: eventColors[event.type] || "#64748b",
            textColor: "#ffffff",
            extendedProps: {
              type: event.type,
              description: event.description,
              originalStart: event.start,
              originalEnd: event.end,
            },
          };

          if (event.end && event.start !== event.end) {
            return [
              {
                ...baseProps,
                id: `${event.id}-start`,
                title: `${event.title} (Start)`,
                start: event.start,
              },
              {
                ...baseProps,
                id: `${event.id}-end`,
                title: `${event.title} (End)`,
                start: event.end,
              }
            ];
          }

          return {
            ...baseProps,
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  const handleEventClick = ({ event }) => {
    const { type, description, originalStart, originalEnd } = event.extendedProps;

    const startStr = originalStart ? new Date(originalStart).toLocaleDateString() : 'N/A';
    const endStr = originalEnd ? new Date(originalEnd).toLocaleDateString() : '';

    const cleanTitle = event.title.replace(" (Start)", "").replace(" (End)", "");

    alert(
      `${cleanTitle}\n\nType: ${type}\n\nStart: ${startStr}${endStr ? `\nEnd: ${endStr}` : ''}\n\n${description || ""}`
    );
  };

  const handleMonthChange = (e) => {
    if (e.target.value && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(e.target.value);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-foreground-muted dark:text-slate-400">
          Loading calendar...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground dark:text-white">
            Academic & Holiday Calendar
          </h1>
          <p className="mt-2 text-sm text-foreground-muted dark:text-slate-400">
            View all academic events and holidays in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="month-picker" className="text-sm font-semibold text-foreground dark:text-slate-350">
            Jump to:
          </label>
          <input
            id="month-picker"
            type="month"
            onChange={handleMonthChange}
            className="cursor-pointer rounded-xl border border-border dark:border-border-dark bg-background dark:bg-surface-dark-elevated px-4 py-2 text-sm text-foreground dark:text-white outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card transition-colors duration-300">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] lg:min-w-full text-foreground dark:text-slate-200">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto"
              fixedWeekCount={false}
              dayMaxEvents={3}
              eventDisplay="block"
              eventClick={handleEventClick}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 border-t border-border dark:border-border-dark pt-4 sm:gap-6">
          <Legend color="#C0A062" label="Holiday" />
          <Legend color="#00508F" label="Semester" />
          <Legend color="#ef4444" label="Examination" />
          <Legend color="#10b981" label="Vacation" />
          <Legend color="#4DB6AC" label="Event" />
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-full sm:h-4 sm:w-4"
        style={{ backgroundColor: color }}
      ></span>
      <span className="text-xs text-foreground dark:text-slate-350 sm:text-sm font-semibold">{label}</span>
    </div>
  );
}

export default CalendarPage;