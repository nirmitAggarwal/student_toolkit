import { holidays } from "../data/holidays.js";

export const getHolidays = (req, res) => {
    try {
        const { type, upcoming } = req.query;

        let result = [...holidays];

        // Filter by type
        if (type) {
            result = result.filter((holiday) => holiday.type === type);
        }

        // Show only upcoming holidays
        if (upcoming === "true") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            result = result.filter(
                (holiday) => new Date(holiday.date) >= today
            );
        }

        // Sort by date
        result.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({
            success: true,
            count: result.length,
            holidays: result,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch holidays",
        });
    }
};