import React from "react";
interface ViewPickerProps {
  viewType: "hours" | "days" | "weeks" | "half-1" | "half-2";
  setViewType: React.Dispatch<
    React.SetStateAction<"hours" | "days" | "weeks" | "half-1" | "half-2">
  >;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  t: (key: string, options?: any) => string;
}

const ViewPicker: React.FC<ViewPickerProps> = ({
  viewType,
  setViewType,
  t,
}) => {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-100 sticky top-0 z-20">
      <button
        onClick={() => {
          setViewType("half-1");
        }}
        className={`px-4 py-2 border rounded w-24 ${
          viewType === "half-1" || viewType === "half-2"
            ? "bg-blue-500 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        {t("half")}
      </button>
      <button
        onClick={() => {
          setViewType("hours");
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
