import React from "react";
import { useTranslation } from "react-i18next";

interface TimelineProps {
  viewType: "hours" | "days" | "weeks";
  day: Date;
}

const StaticTimeline: React.FC<TimelineProps> = ({ viewType, day }) => {
  const { t } = useTranslation("resource");

  // Helper function to format dates as DD/MM/YYYY
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // Helper function to return the day of the week based on the index
  const formDay = (ind: number) => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    return days[ind % 7];
  };

  // Generate the timeline based on the selected viewType
  const generateTimeline = () => {
    if (viewType === "hours") {
      return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    } else if (viewType === "days") {
      return Array.from({ length: 7 }, (_, i) => formDay(i));
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
    <div className={`flex sticky top-[70px] bg-gray-200`}>
      {generateTimeline().map((time, index) => (
        <div key={index} className="flex-1 text-center border border-gray-300">
          {t(time)}
        </div>
      ))}
    </div>
  );
};

export default StaticTimeline;
