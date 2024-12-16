import React from "react";
import { ClockIcon } from "@heroicons/react/24/solid";
import AssignBreakDialogBtn from "./AssignBreakDialogBtn";

interface ShiftInfoProps {
  name: string;
  startHour: string;
  endHour: string;
  id: string;
  t: (key: string, options?: any) => string;
}

const ShiftInfo: React.FC<ShiftInfoProps> = ({
  name,
  startHour,
  endHour,
  id,
  t,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="w-6 h-6 text-blue-500 mr-2" />
            <span className="font-medium text-gray-700">{startHour}</span>
            <span className="mx-1">-</span>
            <span className="font-medium text-gray-700">{endHour}</span>
          </div>
        </div>
        <AssignBreakDialogBtn shiftId={id} t={t} />
      </div>
    </div>
  );
};

export default ShiftInfo;
