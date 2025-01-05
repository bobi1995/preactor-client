import React from "react";
interface ViewPickerProps {
  viewType: "hours" | "days" | "weeks";
  setViewType: React.Dispatch<React.SetStateAction<"hours" | "days" | "weeks">>;
}

const ViewPicker: React.FC<ViewPickerProps> = ({ viewType, setViewType }) => {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-100 sticky top-0 z-20">
      <button
        onClick={() => setViewType("hours")}
        className={`px-4 py-2 border rounded ${
          viewType === "hours"
            ? "bg-blue-500 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        Hour View
      </button>
      <button
        onClick={() => setViewType("days")}
        className={`px-4 py-2 border rounded ${
          viewType === "days"
            ? "bg-blue-500 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        Day View
      </button>
      <button
        onClick={() => setViewType("weeks")}
        className={`px-4 py-2 border rounded ${
          viewType === "weeks"
            ? "bg-blue-500 text-white"
            : "bg-white border-gray-300"
        }`}
      >
        Week View
      </button>
    </div>
  );
};

export default ViewPicker;
