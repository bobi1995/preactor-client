import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRawOrders } from "../graphql/hook/orderRaw";
import LoadingDialog from "../components/general/LoadingDialog";
import ErrorComponent from "../components/general/Error";
import RawOrderTable from "../components/orderRaw/RawOrderTable";
import { RefreshCw, PlayCircle } from "lucide-react";
import { useRunScheduler } from "../graphql/hook/python-scheduler";
const RawOrdersPage: React.FC = () => {
  const { t } = useTranslation();

  const { rawOrders, loading, error, refetch } = useRawOrders();
  const { runScheduler, loading: schedulerLoading } = useRunScheduler();
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    success: boolean;
    message: string;
    output: string;
  }>({
    isOpen: false,
    success: false,
    message: "",
    output: "",
  });
  const handleRunScheduler = async () => {
    try {
      // The mutation hook handles the loading state (schedulerLoading) automatically
      const response = await runScheduler();

      const result = response.data?.runScheduler;

      if (result) {
        // Show result modal
        setResultModal({
          isOpen: true,
          success: result.success,
          message: result.message || "Process finished",
          output: result.output || "",
        });
      }
    } catch (err: any) {
      console.error("Scheduler Error:", err);
      setResultModal({
        isOpen: true,
        success: false,
        message: err.message || "Unknown error occurred",
        output: "Check console for details.",
      });
    }
  };

  if (error) {
    return (
      <ErrorComponent
        message={t("errors.fetchFailed", "Failed to fetch raw orders.")}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4">
      <LoadingDialog isLoading={loading} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {t("rawOrdersPage.title", "Raw Orders")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t(
              "rawOrdersPage.subtitle",
              "Manage incoming orders waiting for sequencing."
            )}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRunScheduler}
            disabled={schedulerLoading || loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <PlayCircle className="w-5 h-5" />
            {t("ordersPage.optimizer.runOptimizer", "Run Optimizer")}
          </button>
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm"
            title={t("common.refresh", "Refresh")}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          {/* Add Create/Filter buttons here in the future */}
        </div>
      </div>

      {/* Main Content */}
      <RawOrderTable orders={rawOrders} />
    </div>
  );
};

export default RawOrdersPage;
