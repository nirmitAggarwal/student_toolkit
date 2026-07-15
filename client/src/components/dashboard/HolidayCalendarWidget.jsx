import { useEffect, useState } from "react";
import { format } from "date-fns";

function HolidayCalendarWidget() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const holidayColors = {
    "Gazetted Holiday": "bg-orange-100 text-orange-700",
    "Restricted Holiday": "bg-blue-100 text-blue-700",
    "National Holiday": "bg-green-100 text-green-700",
    "Optional Holiday": "bg-purple-100 text-purple-700",
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

        // Backend returns { success, count, holidays }
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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-slate-900">
        Upcoming Holidays
      </h3>

      {loading ? (
        <p className="text-sm text-slate-500">Loading holidays...</p>
      ) : holidays.length === 0 ? (
        <p className="text-sm text-slate-500">No upcoming holidays.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {holidays
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((holiday) => (
              <div
                key={holiday._id}
                className={`rounded-2xl p-3 ${holidayColors[holiday.type] ||
                  "bg-slate-100 text-slate-700"
                  }`}
              >
                <p className="text-sm font-medium">{holiday.name}</p>

                <p className="text-xs opacity-75">
                  {format(new Date(holiday.date), "MMM d, yyyy")}
                </p>

                <p className="mt-1 text-xs">{holiday.type}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default HolidayCalendarWidget;