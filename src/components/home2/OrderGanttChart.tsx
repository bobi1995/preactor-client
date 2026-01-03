import React, { useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IResource, IOrder } from "../../graphql/interfaces";
import { ViewMode } from "./ViewPicker";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { ZoomLevel } from "./ZoomControls"; // Import Type
import {
  startOfDay,
  endOfDay,
  addDays,
  format,
  differenceInMinutes,
  addHours,
} from "date-fns";
import { getOrderColor } from "../../utils/color-generator";
import {
  getOrderBackgroundStyle,
  formatDuration,
  parseAsLocal,
} from "../../utils/gantt-utils";

interface OrderGanttChartProps {
  resources: IResource[];
  orders: IOrder[];
  viewMode: ViewMode;
  currentDate: Date;
  zoomLevel: ZoomLevel; // New Prop
  onDateClick?: (date: Date) => void;
  onViewModeChange?: (viewMode: ViewMode) => void;
}

interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

const SETUP_TIME_MULTIPLIER = 24 * 60;

// --- DYNAMIC STYLES CONFIG ---
const ZOOM_STYLES = {
  compact: {
    rowHeight: "h-10",
    headerHeight: "h-10",
    orderHeight: "h-7",
    fontSize: "text-xs",
    iconSize: "w-3 h-3",
  },
  normal: {
    rowHeight: "h-16",
    headerHeight: "h-16",
    orderHeight: "h-12",
    fontSize: "text-sm",
    iconSize: "w-4 h-4",
  },
};

const OrderGanttChart: React.FC<OrderGanttChartProps> = ({
  resources,
  orders,
  viewMode,
  currentDate,
  zoomLevel,
  onDateClick,
  onViewModeChange,
}) => {
  const { t } = useTranslation();
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Get current styles based on zoom level
  const styles = ZOOM_STYLES[zoomLevel];

  // --- Tooltip & Dialog State (Unchanged) ---
  const [tooltipData, setTooltipData] = useState<{
    order: IOrder;
    setupMinutes: number;
    x: number;
    y: number;
  } | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState<boolean>(false);

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
    setTooltipData(null);
  };

  const handleCloseDialog = () => {
    setIsOrderDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleMouseEnter = (
    e: React.MouseEvent,
    order: IOrder,
    setupMinutes: number
  ) => {
    setTooltipData({
      order,
      setupMinutes,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipData) {
      setTooltipData((prev) =>
        prev ? { ...prev, x: e.clientX, y: e.clientY } : null
      );
    }
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  // --- Helper Functions (isWorkingTime, etc.) Unchanged ---
  const isWorkingTime = (
    resource: IResource,
    slotStart: Date,
    slotEnd: Date
  ): boolean => {
    if (!resource.schedule) return true;
    const dayOfWeek = format(slotStart, "EEEE").toLowerCase();
    const daySchedule =
      resource.schedule[dayOfWeek as keyof typeof resource.schedule];
    if (!daySchedule || typeof daySchedule === "string") return false;

    const slotStartMinutes = slotStart.getHours() * 60 + slotStart.getMinutes();
    const slotEndMinutes = slotEnd.getHours() * 60 + slotEnd.getMinutes();
    const [startHour, startMin] = daySchedule.startHour.split(":").map(Number);
    const [endHour, endMin] = daySchedule.endHour.split(":").map(Number);
    const workStartMinutes = startHour * 60 + startMin;
    const workEndMinutes = endHour * 60 + endMin;

    return (
      slotStartMinutes < workEndMinutes && slotEndMinutes > workStartMinutes
    );
  };

  const getBreakOverlays = (
    resource: IResource,
    slotStart: Date,
    slotEnd: Date
  ) => {
    if (!resource.schedule) return [];
    const dayOfWeek = format(slotStart, "EEEE").toLowerCase();
    const daySchedule =
      resource.schedule[dayOfWeek as keyof typeof resource.schedule];
    if (!daySchedule || typeof daySchedule === "string" || !daySchedule.breaks)
      return [];

    const overlays: Array<{ left: string; width: string }> = [];
    const slotStartMinutes = slotStart.getHours() * 60 + slotStart.getMinutes();
    const slotEndMinutes = slotEnd.getHours() * 60 + slotEnd.getMinutes();
    const slotDuration = slotEndMinutes - slotStartMinutes;

    daySchedule.breaks.forEach((breakItem) => {
      const [bStartH, bStartM] = breakItem.startTime.split(":").map(Number);
      const [bEndH, bEndM] = breakItem.endTime.split(":").map(Number);
      const breakStart = bStartH * 60 + bStartM;
      const breakEnd = bEndH * 60 + bEndM;

      if (breakStart < slotEndMinutes && breakEnd > slotStartMinutes) {
        const overlapStart = Math.max(breakStart, slotStartMinutes);
        const overlapEnd = Math.min(breakEnd, slotEndMinutes);
        const leftPercent =
          ((overlapStart - slotStartMinutes) / slotDuration) * 100;
        const widthPercent = ((overlapEnd - overlapStart) / slotDuration) * 100;
        overlays.push({ left: `${leftPercent}%`, width: `${widthPercent}%` });
      }
    });
    return overlays;
  };

  const getNonWorkingOverlay = (
    resource: IResource,
    slotStart: Date,
    slotEnd: Date
  ) => {
    if (!resource.schedule) return null;
    const dayOfWeek = format(slotStart, "EEEE").toLowerCase();
    const daySchedule =
      resource.schedule[dayOfWeek as keyof typeof resource.schedule];
    if (!daySchedule || typeof daySchedule === "string") return null;

    const slotStartMin = slotStart.getHours() * 60 + slotStart.getMinutes();
    const slotEndMin = slotEnd.getHours() * 60 + slotEnd.getMinutes();
    const slotDuration = slotEndMin - slotStartMin;
    const [sH, sM] = daySchedule.startHour.split(":").map(Number);
    const [eH, eM] = daySchedule.endHour.split(":").map(Number);
    const workStart = sH * 60 + sM;
    const workEnd = eH * 60 + eM;

    if (slotStartMin < workEnd && slotEndMin > workEnd) {
      const left = ((workEnd - slotStartMin) / slotDuration) * 100;
      const width = ((slotEndMin - workEnd) / slotDuration) * 100;
      return { left: `${left}%`, width: `${width}%` };
    }
    if (slotStartMin < workStart && slotEndMin > workStart) {
      const width = ((workStart - slotStartMin) / slotDuration) * 100;
      return { left: `0%`, width: `${width}%` };
    }
    return null;
  };

  const handleRightScroll = () => {
    if (leftPanelRef.current && rightPanelRef.current) {
      leftPanelRef.current.scrollTop = rightPanelRef.current.scrollTop;
    }
  };

  // --- Time Slot & Order Logic (Unchanged) ---
  const timeSlots = useMemo((): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    if (viewMode === "halfDay") {
      const start = new Date(currentDate);
      const startHour = currentDate.getHours() < 12 ? 0 : 12;
      start.setHours(startHour, 0, 0, 0);
      for (let i = 0; i < 12; i++) {
        const s = addHours(start, i);
        slots.push({
          start: s,
          end: addHours(start, i + 1),
          label: format(s, "HH:mm"),
        });
      }
    } else if (viewMode === "day") {
      const start = startOfDay(currentDate);
      for (let i = 0; i < 24; i++) {
        const s = addHours(start, i);
        slots.push({
          start: s,
          end: addHours(start, i + 1),
          label: format(s, "HH:mm"),
        });
      }
    } else if (viewMode === "multiWeek") {
      const start = startOfDay(currentDate);
      for (let i = 0; i < 28; i++) {
        const d = addDays(start, i);
        slots.push({
          start: startOfDay(d),
          end: endOfDay(d),
          label: format(d, "EEE d"),
        });
      }
    }
    return slots;
  }, [viewMode, currentDate]);

  const timelineStart = timeSlots[0]?.start;
  const timelineEnd = timeSlots[timeSlots.length - 1]?.end;
  const totalMinutes =
    timelineStart && timelineEnd
      ? differenceInMinutes(timelineEnd, timelineStart)
      : 0;

  const ordersByResource = useMemo(() => {
    const grouped = new Map<string, IOrder[]>();
    resources.forEach((r) => grouped.set(r.id, []));
    orders.forEach((o) => {
      if (o.resource?.id && o.startTime && o.endTime) {
        const list = grouped.get(o.resource.id) || [];
        list.push(o);
        grouped.set(o.resource.id, list);
      }
    });
    return grouped;
  }, [resources, orders]);

  const getOrderBarStyle = (order: IOrder, setupMinutes: number) => {
    if (!timelineStart || !timelineEnd || !order.startTime || !order.endTime) {
      return { display: "none" };
    }
    const start = parseAsLocal(order.startTime);
    const end = parseAsLocal(order.endTime);
    if (!start || !end) return { display: "none" };
    if (end < timelineStart || start > timelineEnd) return { display: "none" };

    const visibleStart = start < timelineStart ? timelineStart : start;
    const visibleEnd = end > timelineEnd ? timelineEnd : end;
    const startOffset = differenceInMinutes(visibleStart, timelineStart);
    const duration = differenceInMinutes(visibleEnd, visibleStart);
    const left = (startOffset / totalMinutes) * 100;
    const width = (duration / totalMinutes) * 100;

    const baseColor = getOrderColor(order.orderNumber || String(order.id));
    const { background } = getOrderBackgroundStyle(
      order.startTime,
      order.endTime,
      setupMinutes,
      baseColor
    );

    return {
      left: `${left}%`,
      width: `${width}%`,
      background: background || baseColor,
      display: "block",
    };
  };

  // --- Dynamic Widths based on Zoom ---
  const getColumnMinWidth = () => {
    // Zoom Normal allows wider columns for better visibility
    if (zoomLevel === "normal") {
      return viewMode === "multiWeek" ? "120px" : "80px";
    }
    // Zoom Compact
    return viewMode === "multiWeek" ? "60px" : "60px";
  };

  const getTotalTimelineWidth = () => {
    // Zoom Normal
    if (zoomLevel === "normal") {
      return viewMode === "multiWeek" ? "3360px" : "100%";
    }
    // Zoom Compact
    return viewMode === "multiWeek" ? "1680px" : "100%";
  };

  const getMinTimelineWidth = () => {
    // Zoom Normal requires more scrolling space
    if (zoomLevel === "normal") {
      return viewMode === "day" ? "1920px" : getTotalTimelineWidth();
    }
    // Zoom Compact
    return viewMode === "day" ? "1440px" : getTotalTimelineWidth();
  };

  return (
    <>
      <div className="flex h-full bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300">
        {/* LEFT PANEL */}
        <div
          ref={leftPanelRef}
          className="w-56 border-r border-gray-200 flex-shrink-0 overflow-hidden transition-all duration-300"
        >
          <div
            className={`sticky top-0 z-10 ${styles.headerHeight} bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center px-3 border-b border-indigo-700`}
          >
            <h3 className={`font-semibold ${styles.fontSize}`}>
              {t("home2.gantt.resources")}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {resources.length === 0 ? (
              <div
                className={`px-4 py-8 text-center text-gray-500 ${styles.fontSize}`}
              >
                {t("home2.gantt.noResources")}
              </div>
            ) : (
              resources.map((r) => (
                <div
                  key={r.id}
                  className={`${styles.rowHeight} px-3 flex items-center gap-2 hover:bg-gray-50 transition-colors`}
                >
                  {r.color && (
                    <div
                      className={`${styles.iconSize} rounded flex-shrink-0`}
                      style={{ backgroundColor: r.color }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium text-gray-900 truncate ${styles.fontSize}`}
                    >
                      {r.name}
                    </p>
                    {r.externalCode && (
                      <p
                        className={`text-gray-500 font-mono leading-none ${
                          zoomLevel === "compact" ? "text-[10px]" : "text-xs"
                        }`}
                      >
                        {r.externalCode}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          ref={rightPanelRef}
          onScroll={handleRightScroll}
          className="flex-1 overflow-x-auto overflow-y-auto"
        >
          <div
            style={{
              minWidth: getMinTimelineWidth(),
              width: getTotalTimelineWidth(),
            }}
          >
            {/* Header */}
            <div
              className={`sticky top-0 z-10 ${styles.headerHeight} text-white border-b border-indigo-700 transition-all duration-300`}
              style={{ backgroundColor: "#9333ea" }}
            >
              <div className="flex h-full" style={{ width: "100%" }}>
                {timeSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-center border-r border-indigo-700/30 last:border-r-0 ${
                      viewMode === "halfDay" || viewMode === "day"
                        ? "flex-1"
                        : "flex-shrink-0"
                    } ${
                      viewMode === "multiWeek"
                        ? "cursor-pointer hover:bg-purple-700 transition-colors"
                        : ""
                    }`}
                    style={{
                      minWidth:
                        viewMode === "halfDay"
                          ? undefined
                          : getColumnMinWidth(),
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
                    <span className={`font-medium ${styles.fontSize}`}>
                      {slot.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid & Orders */}
            <div className="divide-y divide-gray-200" style={{ width: "100%" }}>
              {resources.length === 0 ? (
                <div
                  className={`px-4 py-8 text-center text-gray-500 ${styles.fontSize}`}
                >
                  {t("home2.gantt.noData")}
                </div>
              ) : (
                resources.map((resource) => {
                  const resourceOrders =
                    ordersByResource.get(resource.id) || [];
                  return (
                    <div
                      key={resource.id}
                      className={`${styles.rowHeight} relative transition-all duration-300`}
                      style={{ width: "100%" }}
                    >
                      {/* Background Grid */}
                      <div
                        className="absolute top-0 left-0 h-full flex z-0"
                        style={{ width: "100%" }}
                      >
                        {timeSlots.map((slot, idx) => {
                          const isWorking = isWorkingTime(
                            resource,
                            slot.start,
                            slot.end
                          );
                          const breaks = getBreakOverlays(
                            resource,
                            slot.start,
                            slot.end
                          );
                          const nonWork = getNonWorkingOverlay(
                            resource,
                            slot.start,
                            slot.end
                          );
                          let bg = idx % 2 === 0 ? "#f9fafb" : "#ffffff";
                          if (!isWorking) bg = "#e5e7eb";

                          return (
                            <div
                              key={idx}
                              className={`border-r border-gray-200 last:border-r-0 h-full relative ${
                                viewMode === "halfDay" || viewMode === "day"
                                  ? "flex-1"
                                  : "flex-shrink-0"
                              }`}
                              style={{
                                minWidth:
                                  viewMode === "halfDay"
                                    ? undefined
                                    : getColumnMinWidth(),
                                backgroundColor: bg,
                              }}
                            >
                              {nonWork && (
                                <div
                                  className="absolute top-0 h-full bg-gray-200"
                                  style={{
                                    left: nonWork.left,
                                    width: nonWork.width,
                                  }}
                                />
                              )}
                              {breaks.map((b, i) => (
                                <div
                                  key={i}
                                  className="absolute top-0 h-full bg-orange-200 opacity-60"
                                  style={{ left: b.left, width: b.width }}
                                />
                              ))}
                            </div>
                          );
                        })}
                      </div>

                      {/* Orders */}
                      <div
                        className="absolute top-0 left-0 h-full px-0 py-0 flex items-center"
                        style={{ width: "100%" }}
                      >
                        {resourceOrders.map((order) => {
                          const setupMinutes =
                            (order.setupTime || 0) * SETUP_TIME_MULTIPLIER;

                          const style = getOrderBarStyle(order, setupMinutes);
                          if (style.display === "none") return null;

                          return (
                            <div
                              key={order.id}
                              className={`absolute ${styles.orderHeight} rounded-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden`}
                              style={{
                                ...style,
                                border: "1px solid rgba(255,255,255,0.4)",
                              }}
                              onClick={() => handleOrderClick(order)}
                              onMouseEnter={(e) =>
                                handleMouseEnter(e, order, setupMinutes)
                              }
                              onMouseMove={handleMouseMove}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div
                                className={`h-full px-1 flex items-center text-white font-medium relative z-10 leading-none ${
                                  zoomLevel === "compact"
                                    ? "text-[10px]"
                                    : "text-xs"
                                }`}
                              >
                                <span className="truncate drop-shadow-md">
                                  {order.orderNumber || `Order ${order.id}`}
                                </span>
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
      </div>

      {/* Floating Tooltip (Unchanged) */}
      {tooltipData && (
        <div
          className="fixed z-[9999] pointer-events-none bg-slate-900 text-white text-xs rounded-lg p-3 shadow-2xl border border-slate-700 min-w-[200px]"
          style={{
            left: tooltipData.x + 15,
            top: tooltipData.y + 15,
          }}
        >
          {/* ... tooltip content ... */}
          <div className="font-bold text-sm text-indigo-300 mb-1 border-b border-slate-700 pb-1">
            {tooltipData.order.orderNumber || `Order ${tooltipData.order.id}`}
          </div>
          {/* ... rest of tooltip ... */}
          <div className="space-y-1 mt-2">
            {tooltipData.order.opName && (
              <div>
                <span className="text-slate-400">{t("home2.gantt.op")}:</span>{" "}
                {tooltipData.order.opName}
              </div>
            )}
            {/* ... setup, start, end ... */}
            {tooltipData.setupMinutes > 0 && (
              <div className="flex items-center gap-2 text-gray-300 bg-slate-800 p-1 rounded">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>
                  {t("home2.gantt.setup")}:{" "}
                  {formatDuration(tooltipData.setupMinutes)}
                </span>
              </div>
            )}
            {tooltipData.order.startTime && (
              <div>
                <span className="text-slate-400">
                  {t("home2.gantt.start")}:
                </span>{" "}
                {format(parseAsLocal(tooltipData.order.startTime)!, "PP p")}
              </div>
            )}
            {tooltipData.order.endTime && (
              <div>
                <span className="text-slate-400">{t("home2.gantt.end")}:</span>{" "}
                {format(parseAsLocal(tooltipData.order.endTime)!, "PP p")}
              </div>
            )}
          </div>
        </div>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isOrderDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default OrderGanttChart;
