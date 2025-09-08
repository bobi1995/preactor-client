import React from "react";
import {
  IShift,
  IAlternativeShift,
  IOrder,
} from "../../../../graphql/interfaces";
import {
  convertDateToUnix,
  isSameDay,
} from "../../../../utils/time-converters";
import OrderComponent from "./OrderComponent";

interface HoursScheduleProps {
  shift: IShift;
  alternateShifts: IAlternativeShift[];
  time?: string;
  orders?: IOrder[];
}

const HoursSchedule: React.FC<HoursScheduleProps> = ({
  shift,
  alternateShifts,
  time,
  orders,
}) => {
  let todayOrders: IOrder[] = [];
  if (alternateShifts && alternateShifts.length > 0) {
    alternateShifts.map((alShift: IAlternativeShift) => {
      if (time) {
        const current_day = convertDateToUnix(time);
        const start_day = parseInt(alShift.startDate);
        const end_day = parseInt(alShift.endDate);

        if (current_day >= start_day && current_day <= end_day) {
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

  if (time && orders) {
    todayOrders = orders?.filter((order) => {
      const orderStart = parseInt(order.StartTime);
      const currentDate = convertDateToUnix(time);
      return isSameDay(currentDate, orderStart);
    });
  }

  return (
    <div className="relative h-20 border border-black-300 grid w-full">
      <div className="bg-gray-300 h-20 flex items-center">
        <div className="flex-1 border-r border-gray-400 relative h-full">
          <div
            className="absolute bg-green-300 h-full"
            style={{
              left: `${calculatePosition(startDecimal)}%`,
              width: `${calculateWidth(startDecimal, endDecimal)}%`,
            }}
          ></div>
          {breaks?.map((breakItem, breakIndex) => {
            const [breakStartHour, breakStartMinute] = breakItem.startTime
              .split(":")
              .map(Number);
            const [breakEndHour, breakEndMinute] = breakItem.endTime
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
          {todayOrders.map((order, orderIndex) => {
            const orderStart = parseInt(order.StartTime);
            const orderEnd = parseInt(order.EndTime);

            const orderStartDecimal =
              new Date(orderStart).getHours() +
              new Date(orderStart).getMinutes() / 60;
            const orderEndDecimal =
              new Date(orderEnd).getHours() +
              new Date(orderEnd).getMinutes() / 60;

            return (
              <OrderComponent
                order={order}
                orderEndDecimal={orderEndDecimal}
                orderStartDecimal={orderStartDecimal}
                key={orderIndex}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HoursSchedule;
