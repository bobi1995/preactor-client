// src/components/schedulePage/WeeklyTimeline.tsx

import React from "react";
import { useTranslation } from "react-i18next";
import { ISchedule, IShift, IBreaks } from "../../../graphql/interfaces";
import { unixToHoursWithTimezone } from "../../../utils/time-converters";

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

const timeToDecimal = (timeStr: string): number => {
  if (typeof timeStr !== "string" || !timeStr.includes(":")) return 0;
  const [hours, minutes] = timeStr.split(":");
  return Number(hours) + Number(minutes) / 60;
};

const DayColumn: React.FC<{
  dayKey: keyof ISchedule;
  shift: IShift | null;
}> = ({ dayKey, shift }) => {
  const { t } = useTranslation("common");

  const renderShiftBar = () => {
    if (!shift) {
      return null; // No shift assigned for this day
    }

    const startDecimal = timeToDecimal(shift.startHour);
    let endDecimal = timeToDecimal(shift.endHour);
    if (endDecimal < startDecimal) endDecimal += 24;

    const leftPercentage = (startDecimal / 24) * 100;
    const widthPercentage = ((endDecimal - startDecimal) / 24) * 100;

    return (
      <div
        className="absolute inset-y-0 bg-indigo-500 rounded flex items-center justify-center text-white text-xs font-medium shadow-inner"
        style={{
          left: `${leftPercentage}%`,
          width: `${widthPercentage}%`,
          zIndex: 10,
        }}
        title={`${shift.name}: ${unixToHoursWithTimezone(
          shift.startHour
        )} - ${unixToHoursWithTimezone(shift.endHour)}`}
      >
        {/* Render breaks on top of the shift */}
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

            // Ensure the break is visually within the shift
            if (
              breakStartDecimal >= startDecimal &&
              breakEndDecimal <= endDecimal
            ) {
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
                  className="absolute inset-y-0 bg-sky-400/80 border-x border-sky-500/50"
                  style={{
                    left: `${breakLeft}%`,
                    width: `${breakWidth}%`,
                    zIndex: 20,
                  }}
                  title={`${breakItem.name}: ${unixToHoursWithTimezone(
                    breakItem.startTime
                  )} - ${unixToHoursWithTimezone(breakItem.endTime)}`}
                />
              );
            }
            return null;
          })}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="text-center font-semibold text-sm text-slate-600 py-2 border-b border-slate-200">
        {t(`days.${dayKey}`)}
      </div>
      <div className="relative h-12 bg-slate-100 border-b border-slate-200">
        {renderShiftBar()}
      </div>
    </div>
  );
};

const WeeklyTimeline: React.FC<WeeklyTimelineProps> = ({ schedule }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden p-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        {t("shiftPage.timelineTitle")}
      </h2>
      <div className="grid grid-cols-1">
        {weekDays.map((day) => (
          <DayColumn key={day} dayKey={day} shift={schedule[day]} />
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400 text-center">
        {t("shiftPage.timelineNote")}
      </p>
    </div>
  );
};

export default WeeklyTimeline;
