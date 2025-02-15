import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";

interface TimelineProps {
  viewType: "hours" | "days" | "weeks" | "half-1" | "half-2";
  day: Date;
  setTime?: (time: string) => void;
  setViewType?: (
    viewType: "hours" | "days" | "weeks" | "half-1" | "half-2"
  ) => void;
}

// Helper function to format dates as DD/MM/YYYY
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function getFirstDayOfWeek(week: number, year: number) {
  // Set the year and week
  return moment()
    .year(year)
    .week(week)
    .startOf("week")
    .add(1, "day") // Shift to Monday (ISO weeks start on Monday)
    .format("DD/MM/YYYY");
}

const TimelineComponent: React.FC<TimelineProps> = ({
  viewType,
  day,
  setTime,
  setViewType,
}) => {
  const { t } = useTranslation("resource");
  // Helper function to get the week number
  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const getDayOfWeek = (date: Date) =>
    t(
      date.toLocaleDateString("en-GB", { weekday: "long" }).toLocaleLowerCase()
    );

  // Generate the timeline based on the selected viewType
  const generateTimeline = () => {
    if (viewType === "hours") {
      return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    } else if (viewType === "half-1") {
      return Array.from({ length: 12 }, (_, i) => `${i}:00`);
    } else if (viewType === "half-2") {
      return Array.from({ length: 12 }, (_, i) => `${i + 12}:00`);
    } else if (viewType === "days") {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(day);
        date.setDate(day.getDate() + i);
        return `${formatDate(date)} (${getDayOfWeek(date)})`;
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
    const daysToEndOfWeek = 6 - currentDayIndex;
    const daysFromStartOfWeek = currentDayIndex + 1;

    if (index === 0) return (daysToEndOfWeek / 28) * 100;
    if (index === 3) return (7 / 28) * 100;
    if (index === 4) return (daysFromStartOfWeek / 28) * 100;
    return (7 / 28) * 100;
  };

  const handleClick = (time: string, index?: number) => {
    if (!setTime || !setViewType) return;
    if (viewType === "hours") {
      if (index && index >= 12) {
        return setViewType("half-2");
      } else return setViewType("half-1");
    }
    if (viewType === "days" || viewType === "weeks") {
      if (time.includes("Week")) {
        setTime(
          getFirstDayOfWeek(parseInt(time.split(" ")[1]), day.getFullYear())
        );
        return setViewType("days");
      }
      setTime(time);
      if (viewType === "days") {
        setViewType("hours");
      } else {
        setViewType("days");
      }
    }
  };

  return (
    <div className={`flex sticky top-[70px] bg-gray-200`}>
      {generateTimeline().map((time, index) => (
        <div
          onClick={() => handleClick(time, index)}
          key={index}
          className={`h-7 text-center border border-gray-300 ${
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
