import React from "react";
import {
  IAlternativeShift,
  ISchedule,
  IShift,
} from "../../../../graphql/interfaces";
import HoursSchedule from "./HoursSchedule";
import { addDaysToDate } from "../../../../utils/time-converters";

interface DaysScheduleProps {
  schedule: ISchedule;
  startDay: string;
  alternateShifts: IAlternativeShift[];
  time: string;
}

const DaysSchedule: React.FC<DaysScheduleProps> = ({
  schedule,
  startDay,
  alternateShifts,
  time,
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
        {orderedDays.slice(0, 7).map((day, index) => {
          let shift = schedule[day as keyof ISchedule] as IShift;

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
                />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DaysSchedule;
