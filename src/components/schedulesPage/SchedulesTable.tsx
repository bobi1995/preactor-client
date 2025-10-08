// src/components/schedulesPage/SchedulesTable.tsx

import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ISchedule, IShift } from "../../graphql/interfaces";
import { CircleArrowRight, Trash2 } from "lucide-react";
import ConfirmationDialog from "../general/ConfirmDialog";

interface SchedulesTableProps {
  schedules: ISchedule[];
  query: string;
  onDelete: (id: string) => Promise<void>;
}

const ShiftChip: React.FC<{ shift: IShift | null }> = ({ shift }) => {
  const { t } = useTranslation();
  if (!shift)
    return (
      <span className="text-xs text-slate-400 italic">
        {t("scheduleBuilder.unassigned")}
      </span>
    );
  return (
    <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full inline-block">
      {shift.name}
    </div>
  );
};

const SchedulesTable: React.FC<SchedulesTableProps> = ({
  schedules,
  query,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              {t("common.name")}
            </th>
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => (
              <th
                key={day}
                className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t(`common.days.${day}`)}
              </th>
            ))}
            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-6 py-12 text-center">
                <p className="text-base font-medium text-gray-500">
                  {query
                    ? t("schedulesPage.noSchedulesMatchSearch")
                    : t("schedulesPage.noSchedulesAvailable")}
                </p>
                <p className="text-sm text-gray-400">
                  {query
                    ? t("schedulesPage.tryDifferentKeywords")
                    : t("schedulesPage.createNewPrompt")}
                </p>
              </td>
            </tr>
          ) : (
            schedules.map((schedule: ISchedule) => (
              <tr key={schedule.id} className="hover:bg-indigo-50/50">
                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-indigo-700">
                  {schedule.name}
                </td>
                <td className="px-4 py-4">
                  <ShiftChip shift={schedule.monday} />
                </td>
                <td className="px-4 py-4">
                  <ShiftChip shift={schedule.tuesday} />
                </td>
                <td className="px-4 py-4">
                  <ShiftChip shift={schedule.wednesday} />
                </td>
                <td className="px-4 py-4">
                  <ShiftChip shift={schedule.thursday} />
                </td>
                <td className="px-4 py-4">
                  <ShiftChip shift={schedule.friday} />
                </td>
                <td className="px-4 py-4">
                  <ShiftChip shift={schedule.saturday} />
                </td>
                <td className="px-4 py-4">
                  <ShiftChip shift={schedule.sunday} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-3">
                    <Link
                      to={`/schedule/${schedule.id}`}
                      title={t("common.edit")}
                      className="p-1 rounded-full text-gray-500 hover:text-green-600"
                    >
                      <CircleArrowRight className="w-5 h-5" />
                    </Link>
                    <ConfirmationDialog
                      title={t("schedulesPage.deleteTitle")}
                      description={t("schedulesPage.deleteDescription", {
                        scheduleName: schedule.name,
                      })}
                      confirmAction={() => onDelete(schedule.id)}
                      triggerButton={
                        <button
                          title={t("common.delete")}
                          className="p-1 rounded-full text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      }
                    />
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

export default SchedulesTable;
