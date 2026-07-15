import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const eventColors = {
    Holiday: "#f59e0b",
    Semester: "#2563eb",
    Examination: "#ef4444",
    Vacation: "#10b981",
    Event: "#8b5cf6",
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

                // FIX: Split long events into separate "Start" and "End" blocks
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
                            originalEnd: event.end, // Save these for the click popup
                        },
                    };

                    // If it has an end date and it spans multiple days
                    if (event.end && event.start !== event.end) {
                        return [
                            {
                                ...baseProps,
                                id: `${event.id}-start`,
                                title: `${event.title} (Start)`,
                                start: event.start,
                                // Notice: No 'end' property, so it won't stretch!
                            },
                            {
                                ...baseProps,
                                id: `${event.id}-end`,
                                title: `${event.title} (End)`,
                                start: event.end, // Plot this block on the end date
                            }
                        ];
                    }

                    // Standard 1-day event
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
        // Grab the original dates from extendedProps so the popup still shows the full duration accurately
        const { type, description, originalStart, originalEnd } = event.extendedProps;

        const startStr = originalStart ? new Date(originalStart).toLocaleDateString() : 'N/A';
        const endStr = originalEnd ? new Date(originalEnd).toLocaleDateString() : '';

        // Clean the title for the alert so it doesn't say "(Start)"
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
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-lg font-medium text-slate-600">
                    Loading calendar...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
            <div className="mx-auto max-w-7xl rounded-2xl bg-white p-4 text-slate-900 shadow-lg sm:p-6 md:rounded-3xl md:p-8">

                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Academic & Holiday Calendar
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 sm:mt-2 sm:text-base">
                            View all academic events and holidays in one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="month-picker" className="text-sm font-medium text-slate-600">
                            Jump to:
                        </label>
                        <input
                            id="month-picker"
                            type="month"
                            onChange={handleMonthChange}
                            className="cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <div className="min-w-[600px] lg:min-w-full">
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

                <div className="mt-6 flex flex-wrap gap-3 border-t pt-4 sm:gap-5 md:mt-8 md:pt-6">
                    <Legend color="#f59e0b" label="Holiday" />
                    <Legend color="#2563eb" label="Semester" />
                    <Legend color="#ef4444" label="Examination" />
                    <Legend color="#10b981" label="Vacation" />
                    <Legend color="#8b5cf6" label="Event" />
                </div>

            </div>
        </div>
    );
}

function Legend({ color, label }) {
    return (
        <div className="flex items-center gap-1.5 sm:gap-2">
            <span
                className="h-3 w-3 rounded-full sm:h-4 sm:w-4"
                style={{ backgroundColor: color }}
            ></span>
            <span className="text-xs text-slate-700 sm:text-sm">{label}</span>
        </div>
    );
}

export default CalendarPage;