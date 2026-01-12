import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PlayCircle, X, Settings, CheckCircle2 } from "lucide-react";
import { useOptimizationScenarios } from "../../graphql/hook/optimizationScenario";
import { useRunOptimizer } from "../../graphql/hook/optimizer";
import { toast } from "react-toastify";

interface Props {
  onSuccess?: () => void;
  triggerButtonClass?: string;
  showIconOnly?: boolean;
  defaultMaxTime?: number; // <--- ADDED PROP
}

const RunOptimizerDialog: React.FC<Props> = ({
  onSuccess,
  triggerButtonClass,
  showIconOnly,
  defaultMaxTime = 60, // Default fallback
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Internal UI State
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(
    null
  );
  const [useCustomWindow, setUseCustomWindow] = useState(false);
  const [windowDays, setWindowDays] = useState(7);
  const [maxTime, setMaxTime] = useState(defaultMaxTime); // <--- State

  // Loading State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { scenarios, loading: loadingScenarios } = useOptimizationScenarios();
  const { runOptimizer } = useRunOptimizer();

  // Reset max time when dialog opens or defaults change
  useEffect(() => {
    if (isOpen) {
      setMaxTime(defaultMaxTime);
    }
  }, [isOpen, defaultMaxTime]);

  useEffect(() => {
    if (scenarios && scenarios.length > 0) {
      const defaultScenario = scenarios.find((s) => s.isDefault);
      setSelectedScenarioId(
        defaultScenario ? defaultScenario.id : scenarios[0].id
      );
    }
  }, [scenarios]);

  // TIMER LOGIC: Pure visual simulation (matches maxTime roughly for visuals)
  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      if (progress >= 100) return;

      // Use the actual maxTime for the progress bar duration (clamped minimum 10s for UX)
      const totalTimeMs = Math.max(maxTime, 10) * 1000;
      const updateInterval = 500;
      const increment = 100 / (totalTimeMs / updateInterval);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) return 99;
          return prev + increment;
        });
      }, updateInterval);
    }
    return () => clearInterval(interval);
  }, [isProcessing, progress, maxTime]);

  const handleFinish = () => {
    setTimeout(() => {
      setIsProcessing(false);
      setIsOpen(false);
      setProgress(0);
      if (onSuccess) onSuccess();
      toast.success(
        t(
          "optimizer.runDialog.successMessage",
          "Optimization completed successfully."
        )
      );
    }, 1500);
  };

  const handleRun = async () => {
    if (!selectedScenarioId) return;

    // 1. Show Loader
    setProgress(0);
    setIsProcessing(true);

    try {
      // 2. AWAIT SERVER
      const result = await runOptimizer({
        scenarioId: selectedScenarioId,
        campaignWindowDays: useCustomWindow ? windowDays : 0,
        maxTime: maxTime, // <--- Passed to Mutation
        resourcePriority: [],
      });

      if (result?.success) {
        setProgress(100);
        handleFinish();
      } else {
        setIsProcessing(false);
        toast.error(result?.message || "Failed to start.");
      }
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          triggerButtonClass ||
          "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md font-medium transition-all hover:from-blue-700 hover:to-indigo-700"
        }
      >
        <PlayCircle className="w-5 h-5" />
        {!showIconOnly && t("optimizer.runDialog.button", "Run Optimizer")}
      </button>

      {/* --- FULL SCREEN LOADING OVERLAY --- */}
      {isProcessing && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg text-center space-y-8 animate-in fade-in zoom-in duration-300">
            {progress < 100 ? (
              <>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="#4f46e5"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)}
                      className="transition-[stroke-dashoffset] duration-300 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-700">
                    {Math.round(progress)}%
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("optimizer.optimizing", "Optimizing Schedule...")}
                  </h2>
                  <p className="text-gray-500">
                    {t(
                      "optimizer.optimizing_banter",
                      "This usually takes a few minutes. Please do not close this window."
                    )}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t(
                    "optimizer.optimization_complete",
                    "Optimization Complete!"
                  )}
                </h2>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- CONFIG MODAL --- */}
      {isOpen && !isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                {t("optimizer.runDialog.title", "Run Configuration")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Scenario Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(
                    "optimizer.runDialog.selectLabel",
                    "Select Optimization Scenario"
                  )}
                </label>
                {loadingScenarios ? (
                  <div className="animate-pulse h-10 bg-gray-100 rounded"></div>
                ) : (
                  <select
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border bg-white"
                    value={selectedScenarioId || ""}
                    onChange={(e) =>
                      setSelectedScenarioId(Number(e.target.value))
                    }
                  >
                    {scenarios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.isDefault ? "(Default)" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Max Time Override */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(
                    "optimizer.maxTime.secondsLabel",
                    "Max Duration (Seconds)"
                  )}
                </label>
                <input
                  type="number"
                  min="10"
                  max="3600"
                  value={maxTime}
                  onChange={(e) => setMaxTime(parseInt(e.target.value) || 60)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
                />
              </div>

              {/* Window Override */}
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <label className="flex items-center gap-2 text-sm font-medium text-indigo-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomWindow}
                    onChange={(e) => setUseCustomWindow(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  {t(
                    "optimizer.runDialog.overrideWindow",
                    "Override Urgent Window"
                  )}
                </label>
                {useCustomWindow && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={windowDays}
                      onChange={(e) => setWindowDays(Number(e.target.value))}
                      className="w-20 border-gray-300 rounded shadow-sm p-1 text-sm border"
                    />
                    <span className="text-sm text-gray-600">
                      {t("optimizer.urgentWindow.days", "days")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {t("common.cancel", "Cancel")}
              </button>
              <button
                onClick={handleRun}
                disabled={!selectedScenarioId}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm font-medium"
              >
                {t("optimizer.runDialog.runNow", "Run Now")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RunOptimizerDialog;
