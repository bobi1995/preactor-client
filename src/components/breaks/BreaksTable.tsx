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
}

const BreaksTable: React.FC<Props> = ({ breaks }) => {
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
          {breaks.map((breakItem) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default BreaksTable;
