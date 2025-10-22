import React from "react";
import { IBreaks } from "../../graphql/interfaces";
import { Trans, useTranslation } from "react-i18next";
import { TrashIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useRemoveBreakFromShift } from "../../graphql/hook/break";
import { timesToRepresentativeString } from "../../utils/time-converters";
import ConfirmationDialog from "../general/ConfirmDialog";
import { toast } from "react-toastify";

interface BreaksTableProps {
  breaks: IBreaks[];
  shiftId?: number;
}

const BreaksTable: React.FC<BreaksTableProps> = ({ breaks, shiftId }) => {
  const { t } = useTranslation();
  const { removeBreakFromShift } = useRemoveBreakFromShift();
  const handleRemove = async (breakId: number) => {
    if (!shiftId) return;
    try {
      await removeBreakFromShift(shiftId, breakId);
      toast.success(t("breaksTable.removeSuccess"));
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      {breaks.length > 0 ? (
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {t("breaksTable.name")}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {t("breaksTable.start")}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {t("breaksTable.end")}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {breaks.map((breakItem) => (
              <tr key={breakItem.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800">
                  {breakItem.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                    {timesToRepresentativeString(breakItem.startTime)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                    {timesToRepresentativeString(breakItem.endTime)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                  <ConfirmationDialog
                    title={t("breaksTable.removeBreak")}
                    description={
                      // 2. Use the Trans component to handle the translation with parameters and styling
                      <Trans
                        i18nKey="breaksTable.confirmRemove"
                        values={{ breakName: breakItem.name }}
                        components={{
                          bold: (
                            <span className="font-semibold text-slate-800" />
                          ),
                        }}
                      />
                    }
                    confirmAction={() => handleRemove(Number(breakItem.id))}
                    triggerButton={
                      <button
                        title={t("breaksTable.removeBreak")}
                        className="text-slate-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-slate-500 py-8">
          <svg
            className="mx-auto h-12 w-12 text-slate-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <p className="mt-2 text-sm">{t("breaksTable.noBreaksAssigned")}</p>
        </div>
      )}
    </div>
  );
};

export default BreaksTable;
