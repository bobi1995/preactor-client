// src/components/breaks/BreaksTable.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { IBreaks } from "../../graphql/interfaces";
import { ClockIcon } from "lucide-react";
import AssignedShiftsDialog from "./AssignedShiftsDialog";
import EditBreakDialog from "./EditBreakDialog";
import DeleteBreakDialog from "./DeleteBreakDialog";
import { timesToRepresentativeString } from "../../utils/time-converters";

interface Props {
  breaks: IBreaks[];
  query: string;
}

const BreaksTable: React.FC<Props> = ({ breaks, query }) => {
  const { t } = useTranslation();
  console.log(breaks);
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
              {t("breaksPage.table.name")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
              {t("breaksPage.table.start")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
              {t("breaksPage.table.end")}
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {breaks.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center">
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
                  {/* FIX: Removed the conditional logic for the message */}
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
            breaks.map((breakItem) => (
              <tr key={breakItem.id} className="hover:bg-indigo-50/50">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-indigo-700 hover:text-indigo-900">
                  {breakItem.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 mr-2 text-indigo-400" />
                    {timesToRepresentativeString(breakItem.startTime)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 mr-2 text-purple-400" />
                    {timesToRepresentativeString(breakItem.endTime)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-3">
                    <AssignedShiftsDialog
                      shifts={breakItem.shifts}
                      breakName={breakItem.name}
                    />
                    <EditBreakDialog breakItem={breakItem} />
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
