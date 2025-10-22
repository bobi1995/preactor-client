import React from "react";
import { useTranslation } from "react-i18next";
import { ISchedule, IShift, IBreaks } from "../../../graphql/interfaces";
import TimelineComponent from "./Timeline"; // The 24-hour ruler at the top

interface WeeklyTimelineProps {
  schedule: ISchedule;
}

const weekDays: (keyof ISchedule)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Helper to convert time string (e.g., "08:00:00.000") to a decimal hour
const timeToDecimal = (timeStr: string): number => {
  if (typeof timeStr !== "string" || !timeStr.includes(":")) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
};

// A single horizontal row representing one day in the Gantt chart
const DayRow: React.FC<{ dayKey: keyof ISchedule; shift: IShift | null }> = ({
  dayKey,
  shift,
}) => {
  const { t } = useTranslation();

  const renderShiftBar = () => {
    if (!shift) return null; // Return nothing if no shift is assigned

    const startDecimal = timeToDecimal(shift.startHour);
    let endDecimal = timeToDecimal(shift.endHour);
    // Handle shifts that cross midnight
    if (endDecimal < startDecimal) endDecimal += 24;

    // Use 'left' and 'width' for horizontal positioning
    const leftPercentage = (startDecimal / 24) * 100;
    const widthPercentage = ((endDecimal - startDecimal) / 24) * 100;

    return (
      <div
        className="absolute h-full bg-indigo-500/80 rounded flex items-center justify-center text-white text-xs font-medium shadow-inner overflow-hidden"
        style={{
          left: `${leftPercentage}%`,
          width: `${widthPercentage}%`,
          zIndex: 10,
        }}
        title={`${shift.name}: ${shift.startHour.slice(
          0,
          5
        )} - ${shift.endHour.slice(0, 5)}`}
      >
        {/* Breaks are positioned relative to the parent shift bar */}
        {Array.isArray(shift.breaks) &&
          shift.breaks.map((breakItem: IBreaks) => {
            if (
              !breakItem ||
              typeof breakItem.startTime !== "string" ||
              typeof breakItem.endTime !== "string"
            )
              return null;

            const breakStartDecimal = timeToDecimal(breakItem.startTime);
            let breakEndDecimal = timeToDecimal(breakItem.endTime);
            if (breakEndDecimal < breakStartDecimal) breakEndDecimal += 24;

            // Only render breaks that are within the shift's time
            if (
              breakStartDecimal >= startDecimal &&
              breakEndDecimal <= endDecimal
            ) {
              // Calculate position and width RELATIVE to the parent shift bar
              const breakLeft =
                ((breakStartDecimal - startDecimal) /
                  (endDecimal - startDecimal)) *
                100;
              const breakWidth =
                ((breakEndDecimal - breakStartDecimal) /
                  (endDecimal - startDecimal)) *
                100;

              return (
                <div
                  key={breakItem.id}
                  className="absolute h-full bg-sky-400/70"
                  style={{
                    left: `${breakLeft}%`,
                    width: `${breakWidth}%`,
                    zIndex: 20,
                  }}
                  title={`${breakItem.name}: ${breakItem.startTime.slice(
                    0,
                    5
                  )} - ${breakItem.endTime.slice(0, 5)}`}
                />
              );
            }
            return null;
          })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[120px_1fr] border-t border-slate-200">
      {/* Day Label Column */}
      <div className="font-semibold text-sm text-slate-600 p-3 flex items-center border-r border-slate-200 bg-slate-50">
        {t(`common.days.${dayKey}`)}
      </div>
      {/* Timeline Bar Column */}
      <div className="relative h-12 bg-slate-100">{renderShiftBar()}</div>
    </div>
  );
};

const WeeklyTimeline: React.FC<WeeklyTimelineProps> = ({ schedule }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          {t("shiftPage.timelineTitle")}
        </h2>

        {/* Header section with an empty spacer for day labels and the 24-hour ruler */}
        <div className="grid grid-cols-[120px_1fr]">
          <div>{/* Empty spacer */}</div>
          <TimelineComponent viewType="hours" day={new Date()} />
        </div>

        {/* The 7-day Gantt chart rows */}
        <div className="border border-slate-200 rounded-b-md overflow-hidden">
          {weekDays.map((day) => (
            <DayRow
              key={day}
              dayKey={day}
              shift={schedule[day] as IShift | null}
            />
          ))}
        </div>

        <p className="mt-2 text-xs text-slate-400 text-center">
          {t("shiftPage.timelineNote")}
        </p>
      </div>
    </div>
  );
};

export default WeeklyTimeline;
