import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IResource, IOrder } from "../../graphql/interfaces";
import { ViewMode } from "./ViewPicker";
import OrderDetailsDialog from "./OrderDetailsDialog";
import {
  startOfDay,
  endOfDay,
  addDays,
  format,
  differenceInMinutes,
  parseISO,
  addHours,
} from "date-fns";

interface OrderGanttChartProps {
  resources: IResource[];
  orders: IOrder[];
  viewMode: ViewMode;
  currentDate: Date;
  onDateClick?: (date: Date) => void;
  onViewModeChange?: (viewMode: ViewMode) => void;
}

interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

const OrderGanttChart: React.FC<OrderGanttChartProps> = ({
  resources,
  orders,
  viewMode,
  currentDate,
  onDateClick,
  onViewModeChange,
}) => {
  const { t } = useTranslation();
  const leftPanelRef = React.useRef<HTMLDivElement>(null);
  const rightPanelRef = React.useRef<HTMLDivElement>(null);

  // Order details dialog state
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState<boolean>(false);

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOrderDialogOpen(false);
    setSelectedOrder(null);
  };

  // Synchronized scrolling - only right panel scrolls, left follows
  const handleRightScroll = () => {
    if (leftPanelRef.current && rightPanelRef.current) {
      leftPanelRef.current.scrollTop = rightPanelRef.current.scrollTop;
    }
  };

  // Calculate time slots based on view mode
  const timeSlots = useMemo((): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    if (viewMode === "halfDay") {
      // 12-hour view - show either 00:00-11:59 or 12:00-23:59 based on current hour
      const start = new Date(currentDate);
      const startHour = currentDate.getHours() < 12 ? 0 : 12;
      start.setHours(startHour, 0, 0, 0);

      for (let i = 0; i < 12; i++) {
        const slotStart = addHours(start, i);
        const slotEnd = addHours(start, i + 1);
        slots.push({
          start: slotStart,
          end: slotEnd,
          label: format(slotStart, "HH:mm"),
        });
      }
    } else if (viewMode === "day") {
      // 24-hour view
      const start = startOfDay(currentDate);
      for (let i = 0; i < 24; i++) {
        const slotStart = addHours(start, i);
        const slotEnd = addHours(start, i + 1);
        slots.push({
          start: slotStart,
          end: slotEnd,
          label: format(slotStart, "HH:mm"),
        });
      }
    } else if (viewMode === "multiWeek") {
      // 4-week view (28 days)
      const start = startOfDay(currentDate);
      for (let i = 0; i < 28; i++) {
        const day = addDays(start, i);
        slots.push({
          start: startOfDay(day),
          end: endOfDay(day),
          label: format(day, "EEE d"),
        });
      }
    }

    return slots;
  }, [viewMode, currentDate]);

  // Calculate timeline bounds
  const timelineStart = timeSlots[0]?.start;
  const timelineEnd = timeSlots[timeSlots.length - 1]?.end;
  const totalMinutes =
    timelineStart && timelineEnd
      ? differenceInMinutes(timelineEnd, timelineStart)
      : 0;

  // Group orders by resource
  const ordersByResource = useMemo(() => {
    const grouped = new Map<string, IOrder[]>();

    resources.forEach((resource) => {
      grouped.set(resource.id, []);
    });

    orders.forEach((order) => {
      // Only include orders with valid resource and date/time fields
      if (order.resource?.id && order.startTime && order.endTime) {
        const resourceOrders = grouped.get(order.resource.id) || [];
        resourceOrders.push(order);
        grouped.set(order.resource.id, resourceOrders);
      }
    });

    return grouped;
  }, [resources, orders]);

  // Calculate position and width for an order bar
  const getOrderBarStyle = (order: IOrder) => {
    if (!timelineStart || !timelineEnd) return { left: "0%", width: "0%" };

    // Check if order has valid date/time fields
    if (!order.startTime || !order.endTime) {
      return { left: "0%", width: "0%", display: "none" };
    }

    const orderStart = parseISO(order.startTime);
    const orderEnd = parseISO(order.endTime);

    // Check if order is within visible timeline
    if (orderEnd < timelineStart || orderStart > timelineEnd) {
      return { left: "0%", width: "0%", display: "none" };
    }

    // Clamp order to visible timeline
    const visibleStart =
      orderStart < timelineStart ? timelineStart : orderStart;
    const visibleEnd = orderEnd > timelineEnd ? timelineEnd : orderEnd;

    const startOffset = differenceInMinutes(visibleStart, timelineStart);
    const duration = differenceInMinutes(visibleEnd, visibleStart);

    const left = (startOffset / totalMinutes) * 100;
    const width = (duration / totalMinutes) * 100;

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  const getColumnWidth = () => {
    if (viewMode === "multiWeek") return "120px"; // 28 days * 120px = 3360px
    if (viewMode === "day") return "80px"; // 24 hours * 80px = 1920px
    return ""; // halfDay uses flex-1 to fill space
  };

  const getTotalTimelineWidth = () => {
    if (viewMode === "multiWeek") return "3360px"; // 28 * 120px
    if (viewMode === "day") return "1920px"; // 24 * 80px
    return "100%"; // halfDay fills available width
  };

  return (
    <div className="flex h-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Left Panel - Resources List */}
      <div
        ref={leftPanelRef}
        className="w-64 border-r border-gray-200 flex-shrink-0 overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center px-4 border-b border-indigo-700">
          <h3 className="font-semibold text-lg">
            {t("home2.gantt.resources")}
          </h3>
        </div>

        {/* Resource Rows */}
        <div className="divide-y divide-gray-200">
          {resources.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <p>{t("home2.gantt.noResources")}</p>
            </div>
          ) : (
            resources.map((resource) => (
              <div
                key={resource.id}
                className="h-16 px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                {resource.color && (
                  <div
                    className="w-8 h-8 rounded flex-shrink-0"
                    style={{ backgroundColor: resource.color }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {resource.name}
                  </p>
                  {resource.externalCode && (
                    <p className="text-xs text-gray-500 font-mono">
                      {resource.externalCode}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Timeline */}
      <div
        ref={rightPanelRef}
        onScroll={handleRightScroll}
        className="flex-1 overflow-x-auto overflow-y-auto"
      >
        <div
          style={{
            minWidth: getTotalTimelineWidth(),
            width: getTotalTimelineWidth(),
          }}
        >
          {/* Timeline Header */}
          <div
            className="sticky top-0 z-10 h-16 text-white border-b border-indigo-700"
            style={{ backgroundColor: "#9333ea" }}
          >
            <div
              className="flex h-full"
              style={{ width: getTotalTimelineWidth() }}
            >
              {timeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center border-r border-indigo-700/30 last:border-r-0 ${
                    viewMode === "halfDay" ? "flex-1" : "flex-shrink-0"
                  } ${
                    viewMode === "multiWeek"
                      ? "cursor-pointer hover:bg-purple-700 transition-colors"
                      : ""
                  }`}
                  style={{
                    width:
                      viewMode === "halfDay" ? undefined : getColumnWidth(),
                  }}
                  onClick={() => {
                    if (
                      viewMode === "multiWeek" &&
                      onDateClick &&
                      onViewModeChange
                    ) {
                      onDateClick(slot.start);
                      onViewModeChange("day");
                    }
                  }}
                >
                  <span className="text-sm font-medium">{slot.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Rows */}
          <div
            className="divide-y divide-gray-200"
            style={{ width: getTotalTimelineWidth() }}
          >
            {resources.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <p>{t("home2.gantt.noData")}</p>
              </div>
            ) : (
              resources.map((resource) => {
                const resourceOrders = ordersByResource.get(resource.id) || [];
                return (
                  <div
                    key={resource.id}
                    className="h-16 relative"
                    style={{
                      width: getTotalTimelineWidth(),
                    }}
                  >
                    {/* Timeline grid */}
                    <div
                      className="absolute top-0 left-0 h-full flex z-0"
                      style={{ width: getTotalTimelineWidth() }}
                    >
                      {timeSlots.map((slot, idx) => (
                        <div
                          key={idx}
                          className={`border-r border-gray-200 last:border-r-0 h-full ${
                            viewMode === "halfDay" ? "flex-1" : "flex-shrink-0"
                          } ${
                            viewMode === "multiWeek"
                              ? "cursor-pointer hover:bg-indigo-50 transition-colors"
                              : ""
                          }`}
                          style={{
                            width:
                              viewMode === "halfDay"
                                ? undefined
                                : getColumnWidth(),
                            backgroundColor:
                              idx % 2 === 0 ? "#f9fafb" : "#ffffff",
                          }}
                          onClick={() => {
                            if (
                              viewMode === "multiWeek" &&
                              onDateClick &&
                              onViewModeChange
                            ) {
                              onDateClick(slot.start);
                              onViewModeChange("day");
                            }
                          }}
                        />
                      ))}
                    </div>

                    {/* Order bars */}
                    <div
                      className="absolute top-0 left-0 h-full px-2 py-2"
                      style={{ width: getTotalTimelineWidth() }}
                    >
                      {resourceOrders.map((order) => {
                        const style = getOrderBarStyle(order);
                        if (style.display === "none") return null;

                        return (
                          <div
                            key={order.id}
                            className="absolute h-12 rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
                            style={{
                              ...style,
                              backgroundColor: resource.color || "#6366f1",
                              border: "2px solid rgba(255,255,255,0.3)",
                            }}
                            onClick={() => handleOrderClick(order)}
                            title={`${order.orderNumber || "Order"} - ${
                              order.opName || ""
                            }${
                              order.startTime && order.endTime
                                ? `\n${format(
                                    parseISO(order.startTime),
                                    "PPp"
                                  )} - ${format(
                                    parseISO(order.endTime),
                                    "PPp"
                                  )}`
                                : ""
                            }`}
                          >
                            <div className="h-full px-2 flex items-center text-white text-xs font-medium">
                              <span className="truncate">
                                {order.orderNumber || `Order ${order.id}`}
                                {order.operationNumber &&
                                  ` (${order.operationNumber})`}
                              </span>
                            </div>
                            {/* Hover tooltip */}
                            <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 -top-20 left-0 z-50 whitespace-nowrap shadow-lg">
                              <div className="font-semibold">
                                {order.orderNumber || `Order ${order.id}`}
                              </div>
                              {order.opName && <div>{order.opName}</div>}
                              {order.startTime && (
                                <div className="text-gray-300 mt-1">
                                  {format(parseISO(order.startTime), "PPp")}
                                </div>
                              )}
                              {order.endTime && (
                                <div className="text-gray-300">
                                  {format(parseISO(order.endTime), "PPp")}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isOrderDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default OrderGanttChart;
