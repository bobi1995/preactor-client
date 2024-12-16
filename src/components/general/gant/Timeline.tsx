import React from "react";

interface TimelineProps {
  viewType: "hours" | "days" | "weeks";
  day: Date;
  margin: number;
}

const TimelineComponent: React.FC<TimelineProps> = ({
  viewType,
  day,
  margin,
}) => {
  // Get today's date

  // Helper function to format dates as DD/MM/YYYY
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

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
      // For "weeks", calculate the start date of each week
      return Array.from({ length: 4 }, (_, i) => {
        const startOfWeek = new Date(day);
        startOfWeek.setDate(day.getDate() + i * 7); // Add i weeks to today's date
        return `Week of ${formatDate(startOfWeek)}`;
      });
    }
  };

  return (
    <div className={`flex sticky top-[70px] bg-gray-200 z-10 ml-${margin}`}>
      {generateTimeline().map((time, index) => (
        <div key={index} className="flex-1 text-center border border-gray-300">
          {time}
        </div>
      ))}
    </div>
  );
};

export default TimelineComponent;
