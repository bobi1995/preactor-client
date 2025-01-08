import React from "react";

interface TimelineProps {
  viewType: "hours" | "days" | "weeks";
  day: Date;
}

const TimelineComponent: React.FC<TimelineProps> = ({ viewType, day }) => {
  // Helper function to format dates as DD/MM/YYYY
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // Helper function to get the week number
  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  // Generate the timeline based on the selected viewType
  const generateTimeline = () => {
    if (viewType === "hours") {
      return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    } else if (viewType === "days") {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(day);
        date.setDate(day.getDate() + i); // Add i days to today's date
        return formatDate(date);
      });
    } else {
      // For "weeks", calculate the week number
      const weeks = [];
      let currentDate = new Date(day);
      const currentDayIndex = currentDate.getDay();
      const daysToEndOfWeek = 6 - currentDayIndex;

      // Add remaining days of the current week
      weeks.push(`Week ${getWeekNumber(currentDate)}`);
      currentDate.setDate(currentDate.getDate() + daysToEndOfWeek + 1);

      // Add full weeks
      for (let i = 0; i < 3; i++) {
        weeks.push(`Week ${getWeekNumber(currentDate)}`);
        currentDate.setDate(currentDate.getDate() + 7);
      }

      // Add remaining days of the last week
      weeks.push(`Week ${getWeekNumber(currentDate)}`);

      return weeks;
    }
  };

  const calculateWidth = (index: number) => {
    const currentDayIndex = day.getDay() - 2;
    console.log(currentDayIndex);
    const daysToEndOfWeek = 6 - currentDayIndex;
    const daysFromStartOfWeek = currentDayIndex + 1;

    if (index === 0) return (daysToEndOfWeek / 28) * 100;
    if (index === 3) return (7 / 28) * 100;
    if (index === 4) return (daysFromStartOfWeek / 28) * 100;
    return (7 / 28) * 100;
  };

  return (
    <div className={`flex sticky top-[70px] bg-gray-200`}>
      {generateTimeline().map((time, index) => (
        <div
          key={index}
          className={`text-center border border-gray-300 ${
            viewType === "weeks" ? "" : "flex-1"
          }`}
          style={
            viewType === "weeks" ? { width: `${calculateWidth(index)}%` } : {}
          }
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default TimelineComponent;
