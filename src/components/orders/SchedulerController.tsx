import React from "react";
import { useRunScheduler } from "../../graphql/hook/python-scheduler";
import { useTranslation } from "react-i18next";
const SchedulerController = () => {
  const { t } = useTranslation();
  const { runScheduler, data, loading, error } = useRunScheduler();
  const handleRunScheduler = async () => {
    try {
      const response = await runScheduler();
      console.log("Scheduler Response:", response);
    } catch (err) {
      console.error("Error running scheduler:", err);
    }
  };
  return (
    <div>
      <button
        onClick={handleRunScheduler}
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded"
      >
        {loading ? t("optimizer.planning") : t("optimizer.plan")}
      </button>

      {/* Опционално: Покажи логовете */}
      {data?.runScheduler?.output && (
        <pre className="text-xs bg-gray-100 p-2 mt-2 max-h-40 overflow-auto">
          {data.runScheduler.output}
        </pre>
      )}
    </div>
  );
};

export default SchedulerController;
