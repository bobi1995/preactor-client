import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Save, AlertCircle, CalendarClock, Info, Timer } from "lucide-react"; // Added Timer icon
import { toast } from "react-toastify";
import { IResource } from "../../graphql/interfaces";
import { OptimizerSettingsData } from "../../graphql/hook/optimizer";
import ResourcePrioritySelector from "./ResourcePrioritySelector";

interface Props {
  settings: OptimizerSettingsData | null;
  resources: IResource[];
  updateSettings: (input: any) => Promise<any>;
  saving: boolean;
}

const GlobalOptimizerSettings: React.FC<Props> = ({
  settings,
  resources,
  updateSettings,
  saving,
}) => {
  const { t } = useTranslation();

  // --- LOCAL STATE ---
  const [windowDays, setWindowDays] = useState(7);
  const [isWindowEnabled, setIsWindowEnabled] = useState(false);
  const [maxTime, setMaxTime] = useState(60); // <--- New State
  const [resourcePriority, setResourcePriority] = useState<number[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Sync state when settings load
  useEffect(() => {
    if (settings) {
      setResourcePriority(settings.resourcePriority || []);
      // Sync Max Time
      setMaxTime(settings.maxTime || 60);

      if (settings.campaignWindowDays > 0) {
        setIsWindowEnabled(true);
        setWindowDays(settings.campaignWindowDays);
      } else {
        setIsWindowEnabled(false);
        setWindowDays(7);
      }
      setIsDirty(false);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings({
        campaignWindowDays: isWindowEnabled ? windowDays : 0,
        maxTime: maxTime, // <--- Send to API
        resourcePriority,
      });
      toast.success(t("optimizer.settingsSaved", "Global settings saved."));
      setIsDirty(false);
    } catch (err: any) {
      console.error(err);
      toast.error(t("optimizer.saveError", "Failed to save settings."));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* --- HEADER --- */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">
            {t("optimizer.defaults", "Global Configuration")}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {t(
              "optimizer.defaultsDesc",
              "Default parameters used when no scenario is selected."
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="w-3 h-3" />
              {t("optimizer.unsavedChanges", "Unsaved Changes")}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            {saving
              ? t("common.saving", "Saving...")
              : t("common.save", "Save")}
          </button>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Controls (Urgent Window & Max Time) - Spans 4/12 */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Info Card */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm flex gap-3">
            <Info className="w-5 h-5 flex-shrink-0 text-blue-600" />
            <p className="leading-relaxed opacity-90">
              {t(
                "optimizer.globalInfo",
                "These settings define the baseline behavior. Specific Optimization Scenarios can override weights, but these rules always apply as a foundation."
              )}
            </p>
          </div>

          {/* Urgent Window Control Card */}
          <div
            className={`border rounded-xl p-5 transition-all duration-300 ${
              isWindowEnabled
                ? "border-indigo-200 bg-indigo-50/30 shadow-sm"
                : "border-gray-200 bg-gray-50 opacity-90"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isWindowEnabled
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    {t("optimizer.urgentWindow.title", "Urgent Window")}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {t(
                      "optimizer.urgentWindow.subtitle",
                      "Prioritize imminent deadlines"
                    )}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isWindowEnabled}
                  onChange={(e) => {
                    setIsWindowEnabled(e.target.checked);
                    setIsDirty(true);
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div
              className={`transition-all duration-300 ${
                isWindowEnabled
                  ? "opacity-100 max-h-24"
                  : "opacity-40 max-h-24 grayscale"
              }`}
            >
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                {t("optimizer.urgentWindow.daysLabel", "Lookahead Duration")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={windowDays}
                  disabled={!isWindowEnabled}
                  onChange={(e) => {
                    setWindowDays(parseInt(e.target.value) || 0);
                    setIsDirty(true);
                  }}
                  className="block w-24 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg font-mono p-2 border"
                />
                <span className="text-sm font-medium text-gray-600">
                  {t("optimizer.urgentWindow.days", "days")}
                </span>
              </div>
            </div>
          </div>

          {/* Max Time Control Card (NEW) */}
          <div className="border rounded-xl p-5 border-gray-200 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  {t("ordersPage.optimizer.maxTime.title", "Execution Limit")}
                </h3>
                <p className="text-xs text-gray-500">
                  {t(
                    "ordersPage.optimizer.maxTime.subtitle",
                    "Maximum runtime for solver"
                  )}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                {t(
                  "ordersPage.optimizer.maxTime.secondsLabel",
                  "Max Duration (Seconds)"
                )}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="10"
                  max="3600"
                  value={maxTime}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      setMaxTime(val);
                      setIsDirty(true);
                    }
                  }}
                  className="block w-24 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg font-mono p-2 border"
                />
                <span className="text-sm font-medium text-gray-600">
                  {t("common.seconds", "seconds")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Resource Priority */}
        <div className="xl:col-span-8 flex flex-col h-full">
          <div className="mb-3 flex justify-between items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                {t(
                  "optimizer.resourcePriority.label",
                  "Resource Priority Sequence"
                )}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  "optimizer.resourcePriority.helperDrag",
                  "High priority resources are filled first. Drag or use arrows to reorder."
                )}
              </p>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-300 p-1">
            <ResourcePrioritySelector
              allResources={resources}
              selectedIds={resourcePriority}
              onChange={(newIds) => {
                setResourcePriority(newIds);
                setIsDirty(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalOptimizerSettings;
