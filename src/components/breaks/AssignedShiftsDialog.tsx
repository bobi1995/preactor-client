// src/components/breaks/AssignedShiftsDialog.tsx
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { Briefcase, X } from "lucide-react";
import { IShift, IBreaks } from "../../graphql/interfaces";

interface Props {
  breakItem: IBreaks;
}

const AssignedShiftsDialog: React.FC<Props> = ({ breakItem }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!breakItem.shifts || breakItem.shifts.length === 0) {
    return (
      <span
        className="inline-flex items-center bg-gray-100 text-gray-500 font-medium text-xs px-3 py-1 rounded-full cursor-not-allowed"
        title={
          t("breaksPage.assignedShiftsDialog.noAssignments") ||
          "No shifts are assigned to this break"
        }
      >
        —
      </span>
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          title={
            t("breaksPage.assignedShiftsDialog.triggerTitle") ||
            "View assigned shifts"
          }
          className="inline-flex items-center bg-teal-100 text-teal-700 font-semibold text-xs px-3 py-1 rounded-full hover:bg-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <Briefcase className="w-3 h-3 mr-1.5" />
          {breakItem.shifts.length}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl max-w-lg w-[90vw] p-6 z-50">
          <Dialog.Title className="text-xl font-bold text-slate-800">
            {t("breaksPage.assignedShiftsDialog.title", "Assigned Shifts for ")}
            <span className="text-indigo-600"> {breakItem.name}</span>
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            {t("breaksPage.assignedShiftsDialog.description", {
              breakName: breakItem.name,
            })}
          </Dialog.Description>
          <div className="mt-5 max-h-80 overflow-y-auto pr-2">
            <ul className="space-y-3">
              {breakItem.shifts.map((s: IShift) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3 text-indigo-500" />
                    <span className="font-medium text-slate-700">{s.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {t("common.close", "Close")}
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default AssignedShiftsDialog;
