import React from "react";
import { IOrder } from "../../../../graphql/interfaces";
import * as Tooltip from "@radix-ui/react-tooltip";
import { convertUnixToDateWithHours } from "../../../../utils/time-converters";

interface OrderComponentProps {
  order: IOrder;
  orderStartDecimal: number;
  orderEndDecimal: number;
  half?: "half-1" | "half-2";
}

const OrderComponent: React.FC<OrderComponentProps> = ({
  order,
  orderEndDecimal,
  orderStartDecimal,
  half,
}) => {
  const getColorById = (id: number) => {
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
    const index = id % colors.length;
    return colors[index];
  };

  let calculateOrderPosition = (start: number) => (start / 24) * 100;
  let calculateOrderWidth = (start: number, end: number) =>
    ((end - start) / 24) * 100;
  let componentLeft = 0;
  let componentWidth = 0;
  if (half) {
    calculateOrderPosition = (decimal: number) => (decimal / 12) * 100;
    calculateOrderWidth = (start: number, end: number) =>
      ((end - start) / 12) * 100;
  }

  if (!half) {
    componentLeft = calculateOrderPosition(orderStartDecimal);
    componentWidth = calculateOrderWidth(orderStartDecimal, orderEndDecimal);
  }
  if (half === "half-1") {
    componentLeft = calculateOrderPosition(orderStartDecimal);
    componentWidth = calculateOrderWidth(
      orderStartDecimal,
      Math.min(orderEndDecimal, 12)
    );
  }
  if (half === "half-2") {
    componentLeft = calculateOrderPosition(orderStartDecimal - 12);
    componentWidth = calculateOrderWidth(
      Math.max(orderStartDecimal, 12) - 12,
      orderEndDecimal - 12
    );
  }
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            className={`absolute ${getColorById(
              order.id
            )} h-16 flex items-center justify-center`}
            style={{
              left: `${componentLeft}%`,
              width: `${componentWidth}%`,
              top: "50%",
              transform: "translateY(-50%)",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              border: "1px solid black",
            }}
          >
            {order.OrderNo}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-white border p-2 rounded shadow-lg text-sm"
            sideOffset={5}
          >
            <div>
              <strong>Order No:</strong> {order.OrderNo}
            </div>
            <div>
              <strong>Start Hour:</strong>{" "}
              {convertUnixToDateWithHours(parseInt(order.StartTime) / 1000)}
            </div>
            <div>
              <strong>End Hour:</strong>{" "}
              {convertUnixToDateWithHours(parseInt(order.EndTime) / 1000)}
            </div>
            <div>
              <strong>Op No:</strong> {order.OpNo}
            </div>
            <Tooltip.Arrow className="fill-current text-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default OrderComponent;
