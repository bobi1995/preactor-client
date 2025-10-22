// src/components/shift/Shift-table.tsx

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IBreaks, IShift } from "../../graphql/interfaces"; // Make sure IBreaks is imported
import { useNavigate } from "react-router";
import Pagination, { itemsPerPage } from "../general/Pagination";
import {
  Clock,
  CircleArrowRight,
  SquarePenIcon,
  Coffee,
  Hourglass,
  Timer,
} from "lucide-react"; // 1. Import new icons
import EditShiftDialog from "./EditShiftDialog";
import DeleteShiftDialog from "./DeleteShiftDialog";
import { formatMinutes, timeToMinutes } from "../../utils/time-converters";
import BreaksModal from "./BreaksModal";

interface ShiftTableProps {
  shifts: IShift[];
  loading: boolean;
  onRetry: () => void;
  currentPage: number;
  query: string;
}

const ShiftTable: React.FC<ShiftTableProps> = ({
  shifts,
  loading,
  onRetry,
  currentPage,
  query,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isBreaksModalOpen, setIsBreaksModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<IShift | null>(null);
  const { totalPages, data } = itemsPerPage(currentPage, shifts);

  const enrichedData = useMemo(() => {
    return data.map((shift: IShift) => {
      const totalBreakTimeInMinutes = shift.breaks.reduce(
        (acc: number, breakItem: IBreaks) => {
          const breakStart = timeToMinutes(breakItem.startTime);
          let breakEnd = timeToMinutes(breakItem.endTime);
          if (breakEnd < breakStart) breakEnd += 24 * 60;
          return acc + (breakEnd - breakStart);
        },
        0
      );

      const shiftStart = timeToMinutes(shift.startHour);
      let shiftEnd = timeToMinutes(shift.endHour);
      if (shiftEnd < shiftStart) shiftEnd += 24 * 60;

      const totalShiftTimeInMinutes = shiftEnd - shiftStart;
      const productivityTimeInMinutes =
        totalShiftTimeInMinutes - totalBreakTimeInMinutes;

      return {
        ...shift,
        displayBreakTime: formatMinutes(totalBreakTimeInMinutes),
        displayProductivityTime: formatMinutes(productivityTimeInMinutes),
      };
    });
  }, [data]);

  const handleViewBreaks = (shift: IShift) => {
    setSelectedShift(shift);
    setIsBreaksModalOpen(true);
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="w-3/12 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              {t("common.name")}
            </th>
            <th className="w-1/12 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
              {t("shiftTable.startHour")}
            </th>
            <th className="w-1/12 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
              {t("shiftTable.endHour")}
            </th>
            <th className="w-1/12 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
              {t("nav.break", "Breaks")}
            </th>
            <th className="w-2/12 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
              {t("shiftTable.breakTime", "Break Time")}
            </th>
            <th className="w-2/12 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
              {t("shiftTable.productivityTime", "Productivity Time")}
            </th>
            <th className="w-2/12 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!loading && data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <p className="mt-3 text-base font-medium text-gray-500">
                    {query
                      ? t("shiftTable.noShiftsMatchSearch")
                      : t("shiftTable.noShiftsAvailable")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {query
                      ? t("shiftTable.tryDifferentKeywords")
                      : t("shiftTable.createNewPrompt")}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            enrichedData.map((shift: any, index: number) => (
              <tr
                key={shift.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-indigo-50/50"
                } hover:bg-indigo-100/70 transition-colors duration-150 ease-in-out`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-base font-medium text-indigo-700">
                    {shift.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <div className="flex items-center justify-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                    {shift.startHour.slice(0, 5)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <div className="flex items-center justify-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    {shift.endHour.slice(0, 5)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {shift.breaks.length > 0 ? (
                    <button
                      onClick={() => handleViewBreaks(shift)}
                      className="inline-flex items-center bg-sky-100 text-sky-700 font-semibold text-xs px-3 py-1 rounded-full hover:bg-sky-200 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                      title={t("shiftTable.viewBreaksTooltip") || "View breaks"}
                    >
                      <Coffee className="w-3 h-3 mr-1.5" />
                      {shift.breaks.length}
                    </button>
                  ) : (
                    <span
                      className="inline-flex items-center bg-gray-100 text-gray-500 font-medium text-xs px-3 py-1 rounded-full cursor-not-allowed"
                      title={
                        t("shiftTable.noBreaksAssigned") ||
                        "No breaks are assigned"
                      }
                    >
                      —
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <div className="flex items-center justify-center text-sm">
                    <Timer className="w-4 h-4 mr-2 text-red-400" />
                    {shift.displayBreakTime}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <div className="flex items-center justify-center text-sm">
                    <Hourglass className="w-4 h-4 mr-2 text-green-500" />
                    {shift.displayProductivityTime}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => navigate(`/shift/${shift.id}`)}
                      title={t("shiftTable.viewDetails")}
                      className="text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
                    >
                      <CircleArrowRight className="w-5 h-5" />
                    </button>
                    <EditShiftDialog
                      shift={shift}
                      onSuccess={onRetry}
                      allShifts={shifts || []}
                    >
                      <button
                        title={t("shiftTable.editShift")}
                        className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-100"
                      >
                        <SquarePenIcon className="w-5 h-5" />
                      </button>
                    </EditShiftDialog>
                    <DeleteShiftDialog
                      shiftId={shift.id}
                      shiftName={shift.name}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <Pagination totalPages={totalPages} />
        </div>
      )}
      <BreaksModal
        isOpen={isBreaksModalOpen}
        onClose={() => setIsBreaksModalOpen(false)}
        shift={selectedShift}
      />
    </div>
  );
};

export default ShiftTable;
