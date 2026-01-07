import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Save, RefreshCw, Cpu, History, PlayCircle } from "lucide-react";

// Custom Hooks
import {
  useOptimizerData,
  useUpdateOptimizerSettings,
  useRunOptimizer,
} from "../graphql/hook/optimizer";

// Components
import LoadingDialog from "../components/general/LoadingDialog";
import ErrorComponent from "../components/general/Error";
import ResourcePrioritySelector from "../components/optimizer/ResourcePrioritySelector";
import OptimizerHistoryTable from "../components/optimizer/OptimizerHistoryTable";

const OptimizerSettingsPage: React.FC = () => {
  const { t } = useTranslation();

  // --- DATA FETCHING ---
  const { settings, executions, resources, loading, error, refetch } =
    useOptimizerData();

  const { updateSettings, loading: saving } = useUpdateOptimizerSettings();
  const { runOptimizer, loading: running } = useRunOptimizer();

  // --- LOCAL FORM STATE ---
  const [strategy, setStrategy] = useState("balanced");

  // New state for the checkbox logic
  const [isWindowEnabled, setIsWindowEnabled] = useState(false);
  const [windowDays, setWindowDays] = useState(0);

  const [gravity, setGravity] = useState(true);
  const [resourcePriority, setResourcePriority] = useState<number[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form when settings data loads
  useEffect(() => {
    if (settings) {
      setStrategy(settings.strategy);
      setGravity(settings.gravity);
      setResourcePriority(settings.resourcePriority || []);

      // Logic: If 0, it is disabled. If > 0, enabled.
      if (settings.campaignWindowDays > 0) {
        setIsWindowEnabled(true);
        setWindowDays(settings.campaignWindowDays);
      } else {
        setIsWindowEnabled(false);
        setWindowDays(7); // Default to 7 for UI if they enable it later
      }

      setIsDirty(false);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings({
        strategy,
        campaignWindowDays: isWindowEnabled ? windowDays : 0, // Send 0 if unchecked
        gravity,
        resourcePriority,
      });
      toast.success(
        t("optimizer.settingsSaved", "Default settings saved successfully.")
      );
      setIsDirty(false);
    } catch (err: any) {
      console.error(err);
      toast.error(t("optimizer.saveError", "Failed to save settings."));
    }
  };

  const handleRun = async () => {
    try {
      const result = await runOptimizer({
        strategy,
        campaignWindowDays: isWindowEnabled ? windowDays : 0, // Send 0 if unchecked
        gravity,
        resourcePriority,
      });

      if (result?.success) {
        toast.success(
          t("optimizer.runSuccess", "Optimizer started successfully.")
        );
      } else {
        toast.error(
          result?.message ||
            t("optimizer.runError", "Failed to start optimizer.")
        );
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || t("optimizer.runError"));
    }
  };

  if (loading && !settings) return <LoadingDialog isLoading={true} />;
  if (error)
    return <ErrorComponent message={error.message} onRetry={refetch} />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="w-8 h-8 text-indigo-600" />
            {t("optimizer.title", "Optimizer Control Center")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "optimizer.subtitle",
              "Configure default behaviors for the scheduling engine and audit performance."
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={running || loading}
            className="w-42 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <PlayCircle
              className={`w-5 h-5 ${running ? "animate-spin" : ""}`}
            />
            {running
              ? t("optimizer.running", "Running...")
              : t("optimizer.run", "Run Optimizer")}
          </button>

          <button
            onClick={() => refetch()}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title={t("common.refresh", "Refresh Data")}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* SECTION A: CONFIGURATION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">
            {t("optimizer.defaults", "Default Configuration")}
          </h2>
          {isDirty && (
            <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
              {t("optimizer.unsavedChanges", "Unsaved Changes")}
            </span>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Settings */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("optimizer.strategy.label", "Strategy")}
              </label>
              <select
                value={strategy}
                onChange={(e) => {
                  setStrategy(e.target.value);
                  setIsDirty(true);
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              >
                <option value="balanced">
                  {t("optimizer.strategy.balanced", "Balanced (Standard)")}
                </option>
                <option value="minimize_setup">
                  {t("optimizer.strategy.minimizeSetup", "Minimize Setup Time")}
                </option>
                <option value="deadline">
                  {t("optimizer.strategy.deadline", "Deadline Priority")}
                </option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  "optimizer.strategy.helper",
                  "Determines how the algorithm weights competing goals."
                )}
              </p>
            </div>

            {/* UPDATED URGENT WINDOW SECTION */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWindowEnabled}
                  onChange={(e) => {
                    setIsWindowEnabled(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                {t("optimizer.urgentWindow.label", "Urgent Window (Days)")}
              </label>

              <div
                className={`flex items-center gap-2 transition-opacity ${
                  !isWindowEnabled
                    ? "opacity-50 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={windowDays}
                  onChange={(e) => {
                    setWindowDays(parseInt(e.target.value) || 0);
                    setIsDirty(true);
                  }}
                  disabled={!isWindowEnabled}
                  className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <span className="text-sm text-gray-500">
                  {t("optimizer.urgentWindow.days", "days")}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  "optimizer.urgentWindow.helper",
                  "Orders due within this window are strictly prioritized."
                )}
              </p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  {t("optimizer.gravity.label", "Gravity")}
                </span>
                <span className="text-xs text-gray-500">
                  {t("optimizer.gravity.helper", "Pull tasks to earliest time")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setGravity(!gravity);
                  setIsDirty(true);
                }}
                className={`${
                  gravity ? "bg-indigo-600" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    gravity ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save className="w-4 h-4" />
                {saving
                  ? t("optimizer.saving", "Saving...")
                  : t("optimizer.saveDefaults", "Save Defaults")}
              </button>
            </div>
          </div>

          {/* Right Column: Resource Priority */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t(
                "optimizer.resourcePriority.label",
                "Resource Priority Sequence"
              )}
            </label>
            <p className="text-xs text-gray-500 mb-3">
              {t(
                "optimizer.resourcePriority.helper",
                "Define the order in which the scheduler attempts to assign work. High priority resources are filled first."
              )}
            </p>
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

      {/* SECTION B: HISTORY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-800">
            {t("optimizer.logs", "Execution Logs")}
          </h2>
        </div>

        <OptimizerHistoryTable executions={executions} resources={resources} />
      </div>
    </div>
  );
};

export default OptimizerSettingsPage;
