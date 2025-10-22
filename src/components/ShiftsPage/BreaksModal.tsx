// src/components/ShiftsPage/BreaksModal.tsx

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IShift, IBreaks } from "../../graphql/interfaces";
import { X, Clock } from "lucide-react";
import { formatMinutes, timeToMinutes } from "../../utils/time-converters";

interface BreaksModalProps {
  shift: IShift | null;
  isOpen: boolean;
  onClose: () => void;
}

const BreaksModal: React.FC<BreaksModalProps> = ({
  shift,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!shift) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl max-w-lg w-[90vw] p-6 z-50">
          <Dialog.Title className="text-xl font-bold text-slate-800">
            {t("shiftTable.breaksModal.title", "Breaks for")}
            <span className="text-indigo-600"> {shift.name}</span>
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            {t(
              "shiftTable.breaksModal.description",
              "The following breaks are scheduled for this shift."
            )}
          </Dialog.Description>

          <div className="mt-5 max-h-80 overflow-y-auto pr-2">
            <ul className="space-y-3">
              {shift.breaks.map((breakItem: IBreaks) => {
                const breakDuration =
                  timeToMinutes(breakItem.endTime) -
                  timeToMinutes(breakItem.startTime);
                return (
                  <li
                    key={breakItem.id}
                    className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                  >
                    <div className="font-medium text-slate-700">
                      {breakItem.name}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                        {breakItem.startTime.slice(0, 5)} -{" "}
                        {breakItem.endTime.slice(0, 5)}
                      </div>
                      <div className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">
                        {formatMinutes(breakDuration)}
                      </div>
                    </div>
                  </li>
                );
              })}
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
              onClick={onClose}
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

export default BreaksModal;
