import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ViewMode } from "./ViewPicker";

interface TimelineNavigationProps {
  currentDate: Date;
  viewMode: ViewMode;
  onNavigate: (date: Date) => void;
}

const TimelineNavigation: React.FC<TimelineNavigationProps> = ({
  currentDate,
  viewMode,
  onNavigate,
}) => {
  const { t } = useTranslation();

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case "halfDay":
        newDate.setHours(newDate.getHours() - 12); // Move 12 hours back
        break;
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "multiWeek":
        newDate.setDate(newDate.getDate() - 28); // Move 4 weeks back
        break;
    }
    onNavigate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case "halfDay":
        newDate.setHours(newDate.getHours() + 12); // Move 12 hours forward
        break;
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "multiWeek":
        newDate.setDate(newDate.getDate() + 28); // Move 4 weeks forward
        break;
    }
    onNavigate(newDate);
  };

  const handleToday = () => {
    onNavigate(new Date());
  };

  const formatDateDisplay = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (viewMode === "halfDay") {
      // Show date with time range for half-day view
      const startHour = currentDate.getHours() < 12 ? 0 : 12;
      const endHour = startHour === 0 ? 11 : 23;
      return `${currentDate.toLocaleDateString(undefined, options)} ${String(
        startHour
      ).padStart(2, "0")}:00 - ${String(endHour).padStart(2, "0")}:59`;
    }

    if (viewMode === "multiWeek") {
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 27);
      return `${currentDate.toLocaleDateString(
        undefined,
        options
      )} - ${endDate.toLocaleDateString(undefined, options)}`;
    }

    return currentDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
      <button
        onClick={handlePrevious}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        title={t("home2.navigation.previous")}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleToday}
        className="px-4 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
      >
        {t("home2.navigation.today")}
      </button>

      <div className="px-4 py-1 text-sm font-semibold text-gray-900 min-w-[300px] text-center">
        {formatDateDisplay()}
      </div>

      <button
        onClick={handleNext}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        title={t("home2.navigation.next")}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TimelineNavigation;
