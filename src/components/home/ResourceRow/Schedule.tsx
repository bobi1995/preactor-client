import React from "react";
import { IResource, IShift } from "../../../graphql/interfaces";
import HoursSchedule from "./schedule/HoursSchedule";
import DaysSchedule from "./schedule/DaysSchedule";
import moment from "moment";
import WeekSchedule from "./schedule/WeekSchedule";

interface ScheduleProps {
  resource: IResource;
  viewType: "hours" | "days" | "weeks";
  time: string;
}

export const getDayOfWeek = (dateStr: string) => {
  if (dateStr.includes("Week")) {
    return "monday";
  }
  const onlyDate = dateStr.split(" ")[0];
  const [day, month, year] = onlyDate.split("/").map(Number);
  const date = new Date(year, month - 1, day); // JavaScript months are 0-indexed
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[date.getDay()].toLocaleLowerCase();
};

const Schedule: React.FC<ScheduleProps> = ({ resource, viewType, time }) => {
  const dayOfWeek = getDayOfWeek(time);

  if (viewType === "hours") {
    return (
      <HoursSchedule
        shift={
          resource.schedule[
            dayOfWeek as keyof typeof resource.schedule
          ] as IShift
        }
        alternateShifts={resource.alternateShifts}
        time={time}
      />
    );
  } else if (viewType === "weeks") {
    const formattedDate = moment().format("DD/MM/YYYY");
    return (
      <WeekSchedule
        schedule={resource.schedule}
        startDay={getDayOfWeek(formattedDate)}
        alternateShifts={resource.alternateShifts}
        time={time}
      />
    );
  } else {
    //const formattedDate = moment().format("DD/MM/YYYY");
    return (
      <DaysSchedule
        schedule={resource.schedule}
        startDay={getDayOfWeek(time)}
        alternateShifts={resource.alternateShifts}
        time={time}
      />
    );
  }
  const today = new Date();
  const startOfWeek = new Date(today);

  const getShiftForDay = (dayIndex: number) => {
    const dayDate = new Date();
    dayDate.setDate(startOfWeek.getDate() + dayIndex);
    const dayName = dayDate
      .toLocaleDateString("en-GB", { weekday: "long" })
      .toLowerCase();

    // Check for alternate shifts
    const alternateShift = resource.alternateShifts?.find((altShift) => {
      const startDate = new Date(parseInt(altShift.startDate) * 1000);
      const endDate = new Date(parseInt(altShift.endDate) * 1000);
      return dayDate >= startDate && dayDate <= endDate;
    });

    if (alternateShift) {
      console.log(alternateShift);
      return alternateShift.shift;
    }

    const shift = resource.schedule?.[
      dayName as keyof IResource["schedule"]
    ] as IShift | undefined;

    return shift || null;
  };

  const calculatePosition = (decimal: number) => {
    if (viewType === "weeks") return (decimal / 24) * (100 / 4);
    return 0;
  };

  const calculateWidth = (start: number, end: number) => {
    if (viewType === "weeks") return ((end - start) / 24) * 100;
    return 0;
  };

  return (
    <div className="relative h-20 border border-black-300 grid w-full">
      <div className="bg-gray-300 h-20 flex">
        {Array.from({
          length: 28,
        }).map((_, index) => {
          const shift = getShiftForDay(index);
          if (!shift) {
            return (
              <div
                key={index}
                className="flex-1 border-r border-gray-400 relative"
              ></div>
            );
          }

          const { startHour, endHour, breaks } = shift;

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

                const breakStartDecimal =
                  breakStartHour + breakStartMinute / 60;
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
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
