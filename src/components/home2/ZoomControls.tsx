import React from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useTranslation } from "react-i18next";

export type ZoomLevel = "compact" | "normal";

interface ZoomControlsProps {
  currentZoom: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  currentZoom,
  onZoomChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <button
        onClick={() => onZoomChange("compact")}
        disabled={currentZoom === "compact"}
        className={`p-2 rounded-md transition-all ${
          currentZoom === "compact"
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
        }`}
        title={t("common.zoomOut", "Zoom Out")}
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      <button
        onClick={() => onZoomChange("normal")}
        disabled={currentZoom === "normal"}
        className={`p-2 rounded-md transition-all ${
          currentZoom === "normal"
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
        }`}
        title={t("common.zoomIn", "Zoom In")}
      >
        <ZoomIn className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ZoomControls;
