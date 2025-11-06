// src/components/breaks/BreaksTable.tsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IBreaks } from "../../graphql/interfaces";
import { Clock, Timer } from "lucide-react";
import AssignedShiftsDialog from "./AssignedShiftsDialog";
import EditBreakDialog from "./EditBreakDialog";
import DeleteBreakDialog from "./DeleteBreakDialog";
import {
  timesToRepresentativeString,
  timeToMinutes,
  formatMinutes,
} from "../../utils/time-converters";

interface Props {
  breaks: IBreaks[];
  query: string;
}

const BreaksTable: React.FC<Props> = ({ breaks, query }) => {
  const { t } = useTranslation();

  const enrichedData = useMemo(() => {
    return breaks.map((breakItem) => {
      const breakDuration =
        timeToMinutes(breakItem.endTime) - timeToMinutes(breakItem.startTime);
      return {
        ...breakItem,
        displayDuration: formatMinutes(breakDuration > 0 ? breakDuration : 0),
      };
    });
  }, [breaks]);

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      {/* Added table-fixed for more predictable column widths */}
      <table className="min-w-full table-fixed">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="w-4/12 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("breaksPage.table.name", "Name")}
            </th>
            <th className="w-2/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("breaksPage.table.start", "Start Time")}
            </th>
            <th className="w-2/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("breaksPage.table.end", "End Time")}
            </th>
            <th className="w-1/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("breaksPage.table.duration", "Duration")}
            </th>
            <th className="w-2/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("breaksPage.table.assignedShifts", "Assigned Shifts")}
            </th>
            <th className="w-1/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("common.actions", "Actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {enrichedData.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-16 h-16 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                  <p className="mt-3 text-base font-medium text-gray-500">
                    {query
                      ? t("breaksPage.table.noBreaksMatchSearch")
                      : t("breaksPage.table.noBreaksAvailable")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {query
                      ? t("breaksPage.table.tryDifferentKeywords")
                      : t("breaksPage.table.createNewPrompt")}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            enrichedData.map((breakItem) => (
              <tr key={breakItem.id} className="hover:bg-indigo-50/50">
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="text-base font-medium text-indigo-700">
                    {breakItem.name}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-gray-700">
                  {/* Added justify-center to center the content */}
                  <div className="flex items-center justify-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                    {timesToRepresentativeString(breakItem.startTime)}
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-gray-700">
                  <div className="flex items-center justify-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    {timesToRepresentativeString(breakItem.endTime)}
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-gray-700">
                  <div className="flex items-center justify-center text-sm">
                    <Timer className="w-4 h-4 mr-2 text-red-400" />
                    {breakItem.displayDuration}
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-center">
                  <AssignedShiftsDialog breakItem={breakItem} />
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-center space-x-3">
                    <EditBreakDialog
                      breakItem={breakItem}
                      allBreaks={enrichedData}
                    />
                    <DeleteBreakDialog breakItem={breakItem} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default BreaksTable;
