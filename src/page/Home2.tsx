import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useScheduleources } from "../graphql/hook/resource";
import { useOrders } from "../graphql/hook/order";
import OrderGanttChart from "../components/home2/OrderGanttChart";
import ViewPicker, { ViewMode } from "../components/home2/ViewPicker";
import TimelineNavigation from "../components/home2/TimelineNavigation";
import GanttSkeleton from "../components/home2/GanttSkeleton";
import ErrorComponent from "../components/general/Error";

const Home2 = () => {
  const { t } = useTranslation("home");

  // State management
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");

  // Fetch resources
  const {
    resources,
    loading: resourcesLoading,
    error: resourcesError,
    reload: reloadResources,
  } = useScheduleources();

  // Fetch ALL orders once
  const {
    orders: allOrders,
    loading: ordersLoading,
    error: ordersError,
    reload: reloadOrders,
  } = useOrders();

  // Filter orders based on current view (client-side filtering for performance)
  // No need to refetch - just display the relevant orders for the current view
  const visibleOrders = useMemo(() => {
    if (!allOrders) return [];
    // Return all orders - the OrderGanttChart component will handle
    // which ones are visible based on the date range
    return allOrders;
  }, [allOrders]);

  // Handle view mode change
  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
  };

  // Handle date navigation
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  // Handle retry on error
  const handleRetry = () => {
    reloadResources();
    reloadOrders();
  };

  // Loading state
  if (resourcesLoading && !resources) {
    return (
      <div className="h-[calc(100vh-80px)] p-4">
        <GanttSkeleton rowCount={8} />
      </div>
    );
  }

  // Error state
  if (resourcesError || ordersError) {
    return (
      <div className="h-[calc(100vh-80px)] p-4">
        <ErrorComponent
          message={t(
            "home2.error.fetchFailed",
            "Unable to fetch schedule data. Please check your connection."
          )}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col p-4 bg-gray-50">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("home2.title", "Production Schedule")}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <TimelineNavigation
            currentDate={currentDate}
            viewMode={viewMode}
            onNavigate={handleDateChange}
          />
          <ViewPicker currentView={viewMode} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="flex-1 min-h-0 relative">
        {ordersLoading ? (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-sm text-gray-600">
                {t("home2.loading", "Loading orders...")}
              </p>
            </div>
          </div>
        ) : null}

        <OrderGanttChart
          resources={resources || []}
          orders={visibleOrders}
          viewMode={viewMode}
          currentDate={currentDate}
        />
      </div>

      {/* Info Footer */}
      {resources && visibleOrders && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-6">
            <span>
              {t("home2.stats.resources", "Resources")}: {resources.length}
            </span>
            <span>
              {t("home2.stats.orders", "Orders")}: {visibleOrders.length}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {t("home2.stats.lastUpdate", "Last updated: {{time}}", {
              time: new Date().toLocaleTimeString(),
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home2;
