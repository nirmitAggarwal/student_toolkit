import { academicCalendar } from "../data/academicCalendar.js";

export const getAcademicCalendar = (req, res) => {
    res.json({
        success: true,
        count: academicCalendar.length,
        events: academicCalendar,
    });
};