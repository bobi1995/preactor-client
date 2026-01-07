import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useOrders } from "../graphql/hook/order";
// 1. Change import to the new hook
import { useRunOptimizer } from "../graphql/hook/optimizer";
import ScheduledOrderTable from "../components/orders/ScheduledOrderTable";
import OrderFilter, { PeriodFilter } from "../components/orders/OrderFilter";
import SchedulerBlocker from "../components/orders/SchedulerBlocker";
import SchedulerResultModal from "../components/orders/SchedulerResultModal";
import LoadingDialog from "../components/general/LoadingDialog";
import ErrorComponent from "../components/general/Error";
import { RefreshCw, CalendarCheck, PlayCircle } from "lucide-react";
import {
  startOfDay,
  endOfDay,
  addDays,
  areIntervalsOverlapping,
} from "date-fns";
import { parseAsLocal } from "../utils/gantt-utils";
import { IOrder } from "../graphql/interfaces";

const ScheduledOrdersPage: React.FC = () => {
  const { t } = useTranslation();

  // 1. Data Hooks
  const { orders, loading, error, reload } = useOrders();
  // 2. Use new hook
  const { runOptimizer, loading: schedulerLoading } = useRunOptimizer();

  // 2. Local State for Results Modal
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

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState<PeriodFilter>("all");

  // 3. Handler for Running Scheduler (UPDATED)
  const handleRunScheduler = async () => {
    try {
      // Call with no arguments to use DB defaults
      const result = await runOptimizer();

      if (result) {
        setResultModal({
          isOpen: true,
          success: result.success,
          message: result.message || "Process finished",
          // The new mutation doesn't return raw 'output', so we use message or a generic string
          output: result.success
            ? t(
                "optimizer.runSuccess",
                "Optimizer finished successfully. Check logs in settings for details."
              )
            : result.message,
        });

        if (result.success) {
          reload();
        }
      }
    } catch (err: any) {
      console.error("Scheduler Error:", err);
      setResultModal({
        isOpen: true,
        success: false,
        message: err.message || "Unknown error occurred",
        output: "Check console or Optimizer Settings for details.",
      });
    }
  };

  // --- Filter Logic (Unchanged) ---
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    const now = new Date();
    let targetInterval: { start: Date; end: Date } | null = null;

    if (period === "today") {
      targetInterval = { start: startOfDay(now), end: endOfDay(now) };
    } else if (period === "next7") {
      targetInterval = {
        start: startOfDay(now),
        end: endOfDay(addDays(now, 7)),
      };
    } else if (period === "next14") {
      targetInterval = {
        start: startOfDay(now),
        end: endOfDay(addDays(now, 14)),
      };
    }

    return orders.filter((order: IOrder) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.product?.toLowerCase().includes(searchLower) ||
        order.resource?.name.toLowerCase().includes(searchLower) ||
        order.opName?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (period === "all" || !targetInterval) return true;

      const orderStart = parseAsLocal(order.startTime);
      const orderEnd = parseAsLocal(order.endTime);

      if (!orderStart || !orderEnd) return false;

      return areIntervalsOverlapping(
        { start: orderStart, end: orderEnd },
        targetInterval
      );
    });
  }, [orders, searchTerm, period]);

  if (error) {
    return (
      <ErrorComponent
        message={t("errors.fetchFailed", "Failed to fetch scheduled orders.")}
        onRetry={reload}
      />
    );
  }

  return (
    <>
      {/* 4. BLOCKING OVERLAY */}
      <SchedulerBlocker isVisible={schedulerLoading} />

      {/* 5. RESULT MODAL */}
      <SchedulerResultModal
        isOpen={resultModal.isOpen}
        onClose={() => setResultModal((prev) => ({ ...prev, isOpen: false }))}
        success={resultModal.success}
        message={resultModal.message}
        output={resultModal.output}
      />

      <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4 h-[calc(100vh-80px)] flex flex-col">
        {/* Initial Data Loading */}
        <LoadingDialog isLoading={loading && !schedulerLoading} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck className="w-8 h-8 text-indigo-600" />
              {t("ordersPage.title", "Scheduled Orders")}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {t(
                "ordersPage.subtitle",
                "List of all orders currently processed by the scheduler."
              )}
            </p>
          </div>

          <div className="flex gap-3">
            {/* 6. RUN SCHEDULER BUTTON */}
            <button
              onClick={handleRunScheduler}
              disabled={schedulerLoading || loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <PlayCircle className="w-5 h-5" />
              {t("ordersPage.optimizer.runOptimizer", "Run Optimizer")}
            </button>

            <button
              onClick={() => reload()}
              className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm"
              title={t("common.refresh", "Refresh")}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Component */}
        <OrderFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          period={period}
          onPeriodChange={setPeriod}
        />

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <ScheduledOrderTable orders={filteredOrders} />
        </div>
      </div>
    </>
  );
};

export default ScheduledOrdersPage;
