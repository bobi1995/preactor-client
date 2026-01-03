import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useScheduleResources } from "../graphql/hook/resource";
import { useOrders } from "../graphql/hook/order";
import { IOrder, IResource } from "../graphql/interfaces";
import OrderGanttChart from "../components/home2/OrderGanttChart";
import ViewPicker, { ViewMode } from "../components/home2/ViewPicker";
import TimelineNavigation from "../components/home2/TimelineNavigation";
import ZoomControls, { ZoomLevel } from "../components/home2/ZoomControls"; // Import
import ErrorComponent from "../components/general/Error";
import LoadingDialog from "../components/general/LoadingDialog";

const Home2 = () => {
  const { t } = useTranslation();

  // State management
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("compact"); // New State
  const [hideUnusedResources, setHideUnusedResources] =
    useState<boolean>(false);

  // Fetch resources
  const {
    resources,
    loading: resourcesLoading,
    error: resourcesError,
    reload: reloadResources,
  } = useScheduleResources();

  // Fetch ALL orders
  const {
    orders: allOrders,
    loading: ordersLoading,
    error: ordersError,
    reload: reloadOrders,
  } = useOrders();

  const visibleOrders = useMemo(() => {
    if (!allOrders) return [];
    return allOrders;
  }, [allOrders]);

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    setHideUnusedResources(false);
  };

  const filteredResources = useMemo(() => {
    if (!hideUnusedResources || !resources || !visibleOrders) {
      return resources || [];
    }
    const resourceIdsWithOrders = new Set(
      visibleOrders
        .filter((order: IOrder) => order.resource?.id)
        .map((order: IOrder) => order.resource!.id)
    );
    return resources.filter((resource: IResource) =>
      resourceIdsWithOrders.has(resource.id)
    );
  }, [hideUnusedResources, resources, visibleOrders]);

  const handleRetry = () => {
    reloadResources();
    reloadOrders();
  };

  if (resourcesLoading || ordersLoading)
    return <LoadingDialog isLoading={true} />;

  if (resourcesError || ordersError) {
    return (
      <div className="h-[calc(100vh-80px)] p-4">
        <ErrorComponent
          message={t(
            "home2.error.fetchFailed",
            "Unable to fetch schedule data."
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

          <button
            onClick={() => setHideUnusedResources(!hideUnusedResources)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              hideUnusedResources
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {hideUnusedResources ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  strokeWidth={2}
                  rx="2"
                />
              )}
            </svg>
            <span>{t("home2.hideUnused.label", "Hide unused")}</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <TimelineNavigation
            currentDate={currentDate}
            viewMode={viewMode}
            onNavigate={handleDateChange}
          />
          {/* New Zoom Controls */}
          <ZoomControls currentZoom={zoomLevel} onZoomChange={setZoomLevel} />

          <ViewPicker currentView={viewMode} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="flex-1 min-h-0 relative">
        <OrderGanttChart
          resources={filteredResources}
          orders={visibleOrders}
          viewMode={viewMode}
          currentDate={currentDate}
          zoomLevel={zoomLevel} // Pass the prop
          onDateClick={(date) => setCurrentDate(date)}
          onViewModeChange={(newViewMode) => setViewMode(newViewMode)}
        />
      </div>

      {/* Info Footer (Unchanged) */}
      {resources && visibleOrders && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-6">
            <span>
              {t("home2.stats.resources", "Resources")}:{" "}
              {filteredResources.length}
            </span>
            <span>
              {t("home2.stats.orders", "Orders")}: {visibleOrders.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home2;
