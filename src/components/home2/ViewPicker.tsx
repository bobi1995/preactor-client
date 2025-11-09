import React from "react";
import { useTranslation } from "react-i18next";
import { Clock, Calendar, CalendarRange } from "lucide-react";

export type ViewMode = "halfDay" | "day" | "multiWeek";

interface ViewPickerProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewPicker: React.FC<ViewPickerProps> = ({
  currentView,
  onViewChange,
}) => {
  const { t } = useTranslation();

  const views: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      value: "halfDay",
      label: t("home2.viewPicker.halfDay"),
      icon: <Clock className="w-4 h-4" />,
    },
    {
      value: "day",
      label: t("home2.viewPicker.day"),
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      value: "multiWeek",
      label: t("home2.viewPicker.multiWeek"),
      icon: <CalendarRange className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      {views.map((view) => (
        <button
          key={view.value}
          onClick={() => onViewChange(view.value)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              currentView === view.value
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          {view.icon}
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewPicker;
