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

interface HalfDayScheduleProps {
  shift: IShift;
  alternateShifts: IAlternativeShift[];
  time?: string;
  orders?: IOrder[];
  half: "half-1" | "half-2";
}

const HalfDaySchedule: React.FC<HalfDayScheduleProps> = ({
  shift,
  alternateShifts,
  time,
  orders,
  half,
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

  const calculatePosition = (decimal: number) => (decimal / 12) * 100;
  const calculateWidth = (start: number, end: number) =>
    ((end - start) / 12) * 100;

  if (time && orders) {
    todayOrders = orders?.filter((order) => {
      const orderStart = parseInt(order.StartTime);
      const currentDate = convertDateToUnix(time);
      return isSameDay(currentDate, orderStart);
    });
  }

  const calculateOrderPosition = (start: number) => (start / 12) * 100;
  const calculateOrderWidth = (start: number, end: number) =>
    ((end - start) / 12) * 100;

  const getRandomColor = () => {
    const colors = [
      "bg-blue-300",
      "bg-red-300",
      "bg-yellow-300",
      "bg-orange-300",
      "bg-purple-300",
      "bg-pink-300",
      "bg-indigo-300",
      "bg-teal-300",
      "bg-sky-300",
      "bg-rose-300",
      "bg-cyan-300",
      "bg-amber-300",
      "bg-lime-300",
      "bg-emerald-300",
      "bg-violet-300",
      "bg-fuchsia-300",
      "bg-stone-300",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="relative h-20 border border-black-300 grid w-full">
      <div className="bg-gray-300 h-20 flex items-center">
        <div className="flex-1 border-r border-gray-400 relative h-full">
          {half === "half-1" && startDecimal < 12 && (
            <div
              className="absolute bg-green-300 h-full"
              style={{
                left: `${calculatePosition(startDecimal)}%`,
                width: `${calculateWidth(
                  startDecimal,
                  Math.min(endDecimal, 12)
                )}%`,
              }}
            ></div>
          )}
          {half === "half-2" && (
            <div
              className="absolute bg-green-300 h-full"
              style={{
                left: `${calculatePosition(0)}%`,
                width: `${calculateWidth(
                  Math.max(startDecimal, 12) - 12,
                  endDecimal - 12
                )}%`,
              }}
            ></div>
          )}
          {breaks?.map((breakItem, breakIndex) => {
            const [breakStartHour, breakStartMinute] = breakItem.startHour
              .split(":")
              .map(Number);
            const [breakEndHour, breakEndMinute] = breakItem.endHour
              .split(":")
              .map(Number);

            const breakStartDecimal = breakStartHour + breakStartMinute / 60;
            const breakEndDecimal = breakEndHour + breakEndMinute / 60;

            if (half === "half-1" && breakStartDecimal < 12) {
              return (
                <div
                  key={breakIndex}
                  className="absolute bg-gray-300 h-20"
                  style={{
                    left: `${calculatePosition(breakStartDecimal)}%`,
                    width: `${calculateWidth(
                      breakStartDecimal,
                      Math.min(breakEndDecimal, 12)
                    )}%`,
                  }}
                ></div>
              );
            } else if (half === "half-2" && breakEndDecimal > 12) {
              return (
                <div
                  key={breakIndex}
                  className="absolute bg-gray-300 h-20"
                  style={{
                    left: `${calculatePosition(breakStartDecimal - 12)}%`,
                    width: `${calculateWidth(
                      Math.max(breakStartDecimal, 12) - 12,
                      breakEndDecimal - 12
                    )}%`,
                  }}
                ></div>
              );
            }
            return null;
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

            if (half === "half-1" && orderStartDecimal < 12) {
              return (
                <OrderComponent
                  order={order}
                  orderEndDecimal={orderEndDecimal}
                  orderStartDecimal={orderStartDecimal}
                  key={orderIndex}
                  half={half}
                />
                // <div
                //   key={orderIndex}
                //   className={`absolute ${getRandomColor()} h-16 flex items-center justify-center`}
                //   style={{
                //     left: `${calculateOrderPosition(orderStartDecimal)}%`,
                //     width: `${calculateOrderWidth(
                //       orderStartDecimal,
                //       Math.min(orderEndDecimal, 12)
                //     )}%`,
                //     top: "50%",
                //     transform: "translateY(-50%)",
                //     overflow: "hidden",
                //     whiteSpace: "nowrap",
                //     textOverflow: "ellipsis",
                //     border: "1px solid black",
                //   }}
                // >
                //   {order.OrderNo}
                // </div>
              );
            } else if (half === "half-2" && orderEndDecimal > 12) {
              return (
                <OrderComponent
                  order={order}
                  orderEndDecimal={orderEndDecimal}
                  orderStartDecimal={orderStartDecimal}
                  key={orderIndex}
                  half={half}
                />
                // <div
                //   key={orderIndex}
                //   className={`absolute ${getRandomColor()} h-16 flex items-center justify-center`}
                //   style={{
                //     left: `${calculateOrderPosition(orderStartDecimal - 12)}%`,
                //     width: `${calculateOrderWidth(
                //       Math.max(orderStartDecimal, 12) - 12,
                //       orderEndDecimal - 12
                //     )}%`,
                //     top: "50%",
                //     transform: "translateY(-50%)",
                //     overflow: "hidden",
                //     whiteSpace: "nowrap",
                //     textOverflow: "ellipsis",
                //     border: "1px solid black",
                //   }}
                // >
                //   {order.OrderNo}
                // </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default HalfDaySchedule;
