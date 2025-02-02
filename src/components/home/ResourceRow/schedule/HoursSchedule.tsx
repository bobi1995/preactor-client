import React from "react";
import { IShift, IAlternativeShift } from "../../../../graphql/interfaces";
import { convertDateToUnix } from "../../../../utils/time-converters";

interface HoursScheduleProps {
  shift: IShift;
  alternateShifts: IAlternativeShift[];
  time?: string;
}

const HoursSchedule: React.FC<HoursScheduleProps> = ({
  shift,
  alternateShifts,
  time,
}) => {
  if (alternateShifts && alternateShifts.length > 0) {
    alternateShifts.map((alShift: IAlternativeShift) => {
      if (time) {
        const current_day = convertDateToUnix(time);
        const start_day = parseInt(alShift.startDate);
        const end_day = parseInt(alShift.endDate);
        console.log(time, start_day, end_day, current_day);

        if (current_day >= start_day && current_day <= end_day) {
          console.log(time, alShift.shift);
          shift = alShift.shift;
        }
      }
    });
  }
  if (!shift) return null;

  let { startHour, endHour, breaks } = shift;

  const [startHourValue, startMinuteValue] = startHour.split(":").map(Number);
  const [endHourValue, endMinuteValue] = endHour.split(":").map(Number);

  const startDecimal = startHourValue + startMinuteValue / 60;
  const endDecimal = endHourValue + endMinuteValue / 60;

  const calculatePosition = (decimal: number) => (decimal / 24) * 100;
  const calculateWidth = (start: number, end: number) =>
    ((end - start) / 24) * 100;

  return (
    <div className="relative h-20 border border-black-300 grid w-full">
      <div className="bg-gray-300 h-20 flex">
        <div className="flex-1 border-r border-gray-400 relative">
          <div
            className="absolute bg-green-300 h-20"
            style={{
              left: `${calculatePosition(startDecimal)}%`,
              width: `${calculateWidth(startDecimal, endDecimal)}%`,
            }}
          ></div>
          {breaks?.map((breakItem, breakIndex) => {
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
                key={breakIndex}
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
      </div>
    </div>
  );
};

export default HoursSchedule;
