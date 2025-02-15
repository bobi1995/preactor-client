import React from "react";
import { IResource, IShift } from "../../../graphql/interfaces";
import HoursSchedule from "./schedule/HoursSchedule";
import DaysSchedule from "./schedule/DaysSchedule";
import moment from "moment";
import WeekSchedule from "./schedule/WeekSchedule";
import HalfDaySchedule from "./schedule/HalfDaySchedule";

interface ScheduleProps {
  resource: IResource;
  viewType: "hours" | "days" | "weeks" | "half-1" | "half-2";
  time: string;
}

export const getDayOfWeek = (dateStr: string) => {
  if (dateStr.includes("Week")) {
    return "monday";
  }
  const onlyDate = dateStr.split(" ")[0];
  const [day, month, year] = onlyDate.split("/").map(Number);
  const date = new Date(year, month - 1, day);
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

  if (viewType === "half-1" || viewType === "half-2") {
    return (
      <HalfDaySchedule
        shift={
          resource.schedule[
            dayOfWeek as keyof typeof resource.schedule
          ] as IShift
        }
        alternateShifts={resource.alternateShifts}
        time={time}
        orders={resource.orders}
        half={viewType}
      />
    );
  }

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
        orders={resource.orders}
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
        orders={resource.orders}
      />
    );
  } else {
    return (
      <DaysSchedule
        schedule={resource.schedule}
        startDay={getDayOfWeek(time)}
        alternateShifts={resource.alternateShifts}
        time={time}
        orders={resource.orders}
      />
    );
  }
};

export default Schedule;
