// src/components/breaks/AssignedShiftsDialog.tsx
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { EyeIcon, XIcon } from "lucide-react";
import { IShift } from "../../graphql/interfaces";

interface Props {
  shifts: IShift[];
  breakName: string;
}

const AssignedShiftsDialog: React.FC<Props> = ({ shifts, breakName }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          title={t("breaksPage.assignedShiftsDialog.triggerTitle")}
          className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-100"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-50">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            {t("breaksPage.assignedShiftsDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            {t("breaksPage.assignedShiftsDialog.description", { breakName })}
          </Dialog.Description>
          <div className="mt-4 max-h-60 overflow-y-auto">
            {shifts && shifts.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {shifts.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">
                {t("breaksPage.assignedShiftsDialog.noAssignments")}
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                {t("common.close", "Close")}
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4" aria-label="Close">
              <XIcon className="h-5 w-5 text-gray-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default AssignedShiftsDialog;
