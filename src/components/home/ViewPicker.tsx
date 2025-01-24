import React from "react";
interface ViewPickerProps {
  viewType: "hours" | "days" | "weeks";
  setViewType: React.Dispatch<React.SetStateAction<"hours" | "days" | "weeks">>;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  t: (key: string, options?: any) => string;
}

const ViewPicker: React.FC<ViewPickerProps> = ({
  viewType,
  setViewType,
  setTime,
  t,
}) => {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-100 sticky top-0 z-20">
      <button
        onClick={() => {
          setViewType("hours");
          setTime(new Intl.DateTimeFormat("en-GB").format(new Date()));
        }}
        className={`px-4 py-2 border rounded w-24 ${
          viewType === "hours"
            ? "bg-blue-500 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        {t("hour_view")}
      </button>
      <button
        onClick={() => {
          setViewType("days");
          setTime(new Intl.DateTimeFormat("en-GB").format(new Date()));
        }}
        className={`px-4 py-2 border rounded w-24 ${
          viewType === "days"
            ? "bg-blue-500 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        {t("day_view")}
      </button>
      <button
        onClick={() => {
          setViewType("weeks");
          setTime(new Intl.DateTimeFormat("en-GB").format(new Date()));
        }}
        className={`px-4 py-2 border rounded w-24 ${
          viewType === "weeks"
            ? "bg-blue-500 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        {t("week_view")}
      </button>
    </div>
  );
};

export default ViewPicker;
