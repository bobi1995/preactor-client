import React from "react";
import {
  IBreaks,
  IResource,
  IAlternativeShift,
} from "../../../graphql/interfaces";

interface ScheduleProps {
  resource: IResource;
  viewType: "hours" | "days" | "weeks";
}

const Schedule: React.FC<ScheduleProps> = ({ resource, viewType }) => {
  const today = new Date();

  const getShiftForDay = (dayIndex: number) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + dayIndex);
    const dayTimestamp = Math.floor(dayDate.getTime() / 1000);

    const altShift = resource.alternateShifts.find(
      (altShift: IAlternativeShift) => {
        return (
          dayTimestamp >= parseInt(altShift.startDate) &&
          dayTimestamp <= parseInt(altShift.endDate)
        );
      }
    );

    return altShift ? altShift.shift : resource.regularShift;
  };

  const calculatePosition = (decimal: number) => {
    if (viewType === "hours") return (decimal / 24) * 100;
    if (viewType === "days") return (decimal / 24) * 100;
    if (viewType === "weeks") return (decimal / 24) * (100 / 4);
    return 0;
  };

  const calculateWidth = (start: number, end: number) => {
    if (viewType === "hours") return ((end - start) / 24) * 100;
    if (viewType === "days") return ((end - start) / 24) * 100;
    if (viewType === "weeks") return ((end - start) / 24) * (100 / 4);
    return 0;
  };

  return (
    <div className="relative h-20 border border-black-300 grid w-full">
      <div className="bg-gray-300 h-20 flex">
        {Array.from({
          length: viewType === "hours" ? 1 : viewType === "days" ? 7 : 4,
        }).map((_, index) => {
          const shift = getShiftForDay(index);
          const { startHour, endHour, breaks } = shift || {};

          if (!startHour || !endHour) return null;

          const [startHourValue, startMinuteValue] = startHour
            .split(":")
            .map(Number);
          const [endHourValue, endMinuteValue] = endHour.split(":").map(Number);

          const startDecimal = startHourValue + startMinuteValue / 60;
          const endDecimal = endHourValue + endMinuteValue / 60;

          return (
            <div
              key={index}
              className="flex-1 border-r border-gray-400 relative"
            >
              {index >= 0 && index <= 4 && (
                <div
                  className="absolute bg-green-300 h-20"
                  style={{
                    left: `${calculatePosition(startDecimal)}%`,
                    width: `${calculateWidth(startDecimal, endDecimal)}%`,
                  }}
                ></div>
              )}
              {breaks?.map((breakItem: IBreaks) => {
                const [breakStartHour, breakStartMinute] = breakItem.startHour
                  .split(":")
                  .map(Number);
                const [breakEndHour, breakEndMinute] = breakItem.endHour
                  .split(":")
                  .map(Number);

                const breakStartDecimal =
                  breakStartHour + breakStartMinute / 60;
                const breakEndDecimal = breakEndHour + breakEndMinute / 60;

                return (
                  <div
                    key={breakItem.id}
                    className="absolute bg-gray-300 h-20"
                    style={{
                      left: `${calculatePosition(breakStartDecimal)}%`,
                      width: `${calculateWidth(
                        breakStartDecimal,
                        breakEndDecimal
                      )}%`,
                    }}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
