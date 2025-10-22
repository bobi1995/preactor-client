// src/components/schedulePage/DayShiftSelector.tsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IShift } from "../../graphql/interfaces";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, Check, ChevronsUpDown } from "lucide-react";

// FIX #1: Define the specific DayKey type that this component works with.
type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface DayShiftSelectorProps {
  dayId: DayKey; // The ID is now correctly typed as DayKey
  dayName: string;
  shifts: IShift[];
  selectedShiftId: string | null;
  isModified: boolean;
  onShiftChange: (dayId: DayKey, shiftId: string | null) => void; // The callback expects a DayKey
}

const DayShiftSelector: React.FC<DayShiftSelectorProps> = ({
  dayId,
  dayName,
  shifts,
  selectedShiftId,
  isModified,
  onShiftChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const selectedShift = shifts.find((s) => s.id.toString() === selectedShiftId);

  const handleSelect = (shiftId: string | null) => {
    onShiftChange(dayId, shiftId);
    setIsOpen(false);
  };

  const topBorderClass = isModified
    ? "border-t-amber-400"
    : "border-t-indigo-500";
  const iconColorClass = isModified ? "text-amber-500" : "text-indigo-500";

  return (
    <div
      className={`bg-white p-3 rounded-xl shadow-lg border border-slate-200 flex flex-col justify-between border-t-4 ${topBorderClass} min-h-[120px] transition-all`}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <CalendarDays className={`h-5 w-5 ${iconColorClass}`} />
        <h3 className="font-bold text-center text-slate-700">{dayName}</h3>
      </div>

      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="w-full flex justify-between items-center bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 data-[state=open]:ring-2 data-[state=open]:ring-indigo-500">
            <span className="truncate">
              {selectedShift
                ? `${selectedShift.name}`
                : `-- ${t("scheduleBuilder.noShiftOption")} --`}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={5}
            align="start"
            className="w-[--radix-popover-trigger-width] max-h-60 overflow-y-auto bg-white p-1 rounded-md shadow-lg border z-50"
          >
            <div
              onClick={() => handleSelect(null)}
              className="flex items-center justify-between p-2 text-sm rounded-sm hover:bg-indigo-50 cursor-pointer"
            >
              <span className="italic text-slate-500">
                -- {t("scheduleBuilder.noShiftOption")} --
              </span>
              {!selectedShiftId && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
            </div>

            {shifts.map((shift) => (
              <div
                key={shift.id}
                onClick={() => handleSelect(shift.id.toString())}
                className="flex items-center justify-between p-2 text-sm rounded-sm hover:bg-indigo-50 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">
                    {shift.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({shift.startHour.slice(0, 5)} - {shift.endHour.slice(0, 5)}
                    )
                  </span>
                </div>
                {selectedShiftId === shift.id.toString() && (
                  <Check className="h-4 w-4 text-indigo-600" />
                )}
              </div>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default DayShiftSelector;
