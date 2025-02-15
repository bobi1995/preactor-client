import React from "react";
import {
  IAlternativeShift,
  IOrder,
  ISchedule,
  IShift,
} from "../../../../graphql/interfaces";
import HoursSchedule from "./HoursSchedule";
import { addDaysToDate } from "../../../../utils/time-converters";

interface WeekScheduleProps {
  schedule: ISchedule;
  startDay: string;
  alternateShifts: IAlternativeShift[];
  time: string;
  orders: IOrder[];
}

const WeekSchedule: React.FC<WeekScheduleProps> = ({
  schedule,
  startDay,
  alternateShifts,
  time,
  orders,
}) => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const startIndex = daysOfWeek.indexOf(startDay);
  const orderedDays = [
    ...daysOfWeek.slice(startIndex),
    ...daysOfWeek.slice(0, startIndex),
  ];

  return (
    <div className="relative h-20 border border-black-300 grid w-full">
      <div className="bg-gray-300 h-20 flex">
        {Array.from({ length: 28 }).map((_, index) => {
          const dayIndex = index % 7;
          const day = orderedDays[dayIndex];
          const shift = schedule[day as keyof ISchedule] as IShift;

          return (
            <div
              key={index}
              className="flex-1 border-r border-gray-400 relative"
            >
              {
                <HoursSchedule
                  shift={shift}
                  alternateShifts={alternateShifts}
                  time={addDaysToDate(time, index)}
                  orders={orders}
                />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekSchedule;
