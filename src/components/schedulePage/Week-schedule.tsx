import React from "react";
import { IBreaks, ISchedule, IShift } from "../../graphql/interfaces";

interface WeekScheduleProps {
  schedule: ISchedule;
}

const WeekSchedule: React.FC<WeekScheduleProps> = ({ schedule }) => {
  const renderGreenZones = (shift: IShift) => {
    if (!shift)
      return (
        <div className="relative h-20 border grid w-full overflow-hidden"></div>
      );

    const { startHour, endHour, breaks } = shift;

    const [startHourValue, startMinuteValue] = startHour.split(":").map(Number);
    const [endHourValue, endMinuteValue] = endHour.split(":").map(Number);

    const startDecimal = startHourValue + startMinuteValue / 60;
    const endDecimal = endHourValue + endMinuteValue / 60;

    const calculatePosition = (decimal: number) => (decimal / 24) * 100;
    const calculateWidth = (start: number, end: number) =>
      ((end - start) / 24) * 100;

    return (
      <div className="relative h-20 border grid w-full overflow-hidden">
        <div
          className="absolute bg-green-300 h-full"
          style={{
            left: `${calculatePosition(startDecimal)}%`,
            width: `${calculateWidth(startDecimal, endDecimal)}%`,
          }}
        ></div>
        {breaks?.map((breakItem: IBreaks, index: number) => {
          const [breakStartHour, breakStartMinute] = breakItem.startHour
            .split(":")
            .map(Number);
          const [breakEndHour, breakEndMinute] = breakItem.endHour
            .split(":")
            .map(Number);

          const breakStartDecimal = breakStartHour + breakStartMinute / 60;
          const breakEndDecimal = breakEndHour + breakEndMinute / 60;

          return (
            <div
              key={breakItem.id + index}
              className="absolute bg-gray-300 h-full"
              style={{
                left: `${calculatePosition(breakStartDecimal)}%`,
                width: `${calculateWidth(breakStartDecimal, breakEndDecimal)}%`,
              }}
            ></div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="bg-gray-300 grid grid-cols-7">
      <div>{renderGreenZones(schedule.monday)}</div>
      <div>{renderGreenZones(schedule.tuesday)}</div>
      <div>{renderGreenZones(schedule.wednesday)}</div>
      <div>{renderGreenZones(schedule.thursday)}</div>
      <div>{renderGreenZones(schedule.friday)}</div>
      <div>{renderGreenZones(schedule.saturday)}</div>
      <div>{renderGreenZones(schedule.sunday)}</div>
    </div>
  );
};

export default WeekSchedule;
