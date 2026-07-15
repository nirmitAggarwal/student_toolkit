import { holidays } from "../data/holidays.js";
import { academicCalendar } from "../data/academicCalendar.js";

export const getCalendarEvents = (req, res) => {
    try {
        const holidayEvents = holidays.map((holiday, index) => ({
            id: `holiday-${index}`,
            title: holiday.name,
            start: holiday.date,
            end: holiday.date,
            type: "Holiday",
            allDay: true,
        }));

        const academicEvents = academicCalendar.map((event) => ({
            id: `academic-${event.id}`,
            title: event.title,
            start: event.startDate,
            end: event.endDate,
            type: event.type,
            description: event.description || "",
            allDay: true,
        }));

        res.json({
            success: true,
            events: [...holidayEvents, ...academicEvents],
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch calendar events",
        });
    }
};